
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { fetchFromTMDB } from "../services/tmdb.service.js";
import { json } from "stream/consumers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const GetMovieList = async (req, res) => {
    const {query} = req.body;
    
        // Call Python script
       
        const pythonScriptPath = path.join(__dirname, "Gemini.py"); // Correct script path
        exec(`python ${pythonScriptPath} "${query}"`, async (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return res.status(500).json({ error: "Internal Server Error" });
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                return res.status(500).json({ error: "Error processing request" });
            }
            try {
            let result1 = ''
            let content = ''
            const result = JSON.parse(stdout); // json string to json object
            if("movie" in result) {
                content = 'movie'
                result1 = result['movie']
            }
            else if("tv" in result) {
                content = 'tv'
                result1 = result['tv']
            }
            else {
                result1 = result['nocontext']
                res.json({content:result1})
                return;
            }
            result1 = result1.replace(/'/g, '"'); // string to valid json string
            result1 = JSON.parse(result1); // json string to json object
            const resf = []
           
                for(let i=0;i<result1.length;i++) {
                    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/search/${content}?query=${result1[i]}&language=en-US&page=1`);
                    const movie = data.results;
                    if(movie.length===0) {
                        continue;
                    }
                    resf.push(movie);
                }
                if(resf.length===0) {
                    res.json({success:false,message:"Sorry,Error fetching movies"});
                }
                res.json({content:resf});
            }
          catch(error) {
              console.log("Error in searching movies: "+error.message);
              res.status(500).json({success:false,message:error.message});
          }
           
        });
}
        