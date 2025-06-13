import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds
const RATE_LIMIT_DELAY = 5000; // 5 seconds

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchFromTMDB = async (url, retryCount = 0) => {
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer '+ process.env.TMDB_API_KEY
        },
        timeout: 15000, // 15 second timeout
        maxRedirects: 5,
        validateStatus: function (status) {
            return status >= 200 && status < 500; // Accept all responses except 5xx
        }
    };

    try {
        console.log(`Making TMDB request to: ${url}`);
        const response = await axios.get(url, options);
        
        // Handle rate limiting
        if (response.status === 429) {
            console.log('Rate limit hit, waiting before retry...');
            await sleep(RATE_LIMIT_DELAY);
            return fetchFromTMDB(url, retryCount + 1);
        }

        if (response.status !== 200) {
            throw new Error(`Failed to fetch data from TMDB: ${response.status}`);
        }

        return response.data;
    } catch (error) {
        console.error('TMDB API Error:', {
            message: error.message,
            code: error.code,
            url: url,
            retryCount: retryCount
        });

        // Handle specific error cases
        if (retryCount < MAX_RETRIES) {
            if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
                console.log(`Retrying request (${retryCount + 1}/${MAX_RETRIES})...`);
                await sleep(RETRY_DELAY * Math.pow(2, retryCount)); // Exponential backoff
                return fetchFromTMDB(url, retryCount + 1);
            }
            
            if (error.response?.status === 429) {
                console.log('Rate limit hit, waiting before retry...');
                await sleep(RATE_LIMIT_DELAY);
                return fetchFromTMDB(url, retryCount + 1);
            }
        }

        throw error;
    }
};