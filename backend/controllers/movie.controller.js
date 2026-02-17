
import { fetchFromTMDB } from "../services/tmdb.service.js"
import {User} from "../models/user.model.js";

export const getTrendingMovies = async (req, res) => {
    try {
    const data = await fetchFromTMDB('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1');
    const movies = data.results //[Math.floor(Math.random() * data.results?.length)];
    res.json({success:true,content:movies});
    }
     catch(error) {
        console.log("Error in getting trending movies: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }
}

export const getAnimePopular = async (req,res) => {
    try {
        const data1 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_keywords=210024&sort_by=popularity.desc`);
        const data2 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_keywords=210024&sort_by=popularity.desc&page=2`);
        const data3 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_keywords=210024&sort_by=popularity.desc&page=3`);
        const data4 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_keywords=210024&sort_by=popularity.desc&page=4`);
        const data = [...data1.results, ...data2.results,...data3.results,...data4.results];
        res.json({success:true,content:data});
    }
    catch(error) {
        console.log("Error in getting anime movie trending: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }
}

export const getAnimationPopular = async (req,res) => {
    try {
        const data1 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_genres=16&with_original_language=en&region=US&sort_by=popularity.desc`);
        const data2 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_genres=16&with_original_language=en&region=US&sort_by=popularity.desc&page=2`);
        const data3 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_genres=16&with_original_language=en&region=US&sort_by=popularity.desc&page=3`);
        const data4 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_genres=16&with_original_language=en&region=US&sort_by=popularity.desc&page=4`);
        const data = [...data1.results, ...data2.results,...data3.results,...data4.results];
        res.json({success:true,content:data});
    }
    catch(error) {
        console.log("Error in getting anime movie trending: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }
}


export const getKdramaPopular = async (req,res) => {
    try {
        const data1 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_origin_country=KR&with_original_language=ko&with_genres=18&sort_by=popularity.desc&vote_count.gte=70`);
        const data2 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_origin_country=KR&with_original_language=ko&with_genres=18&sort_by=popularity.desc&vote_count.gte=70&page=2`);
        const data3 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_origin_country=KR&with_original_language=ko&with_genres=18&sort_by=popularity.desc&vote_count.gte=70&page=3`);
        const data4 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_origin_country=KR&with_original_language=ko&with_genres=18&sort_by=popularity.desc&vote_count.gte=70&page=4`);
        const data = [...data1.results, ...data2.results,...data3.results,...data4.results];
        res.json({success:true,content:data});
    }
    catch(error) {
        console.log("Error in getting anime movie trending: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }
}


export const getAnimeTopRated = async (req,res) => {
    try {
        const data1 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_keywords=210024&sort_by=vote_average.desc&vote_count.gte=200`);
        const data2 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_keywords=210024&sort_by=vote_average.desc&page=2&vote_count.gte=200`);
        const data3 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_keywords=210024&sort_by=vote_average.desc&page=3&vote_count.gte=200`);
        const data4 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_keywords=210024&sort_by=vote_average.desc&page=4&vote_count.gte=200`);
        const data = [...data1.results, ...data2.results,...data3.results,...data4.results];
        res.json({success:true,content:data});
    }
    catch(error) {
        console.log("Error in getting anime movie top rated: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }
}

export const getAnimationTopRated = async (req,res) => {
    try {
        const data1 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_genres=16&with_original_language=en&region=US&sort_by=vote_average.desc&vote_count.gte=200`);
        const data2 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_genres=16&with_original_language=en&region=US&sort_by=vote_average.desc&page=2&vote_count.gte=200`);
        const data3 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_genres=16&with_original_language=en&region=US&sort_by=vote_average.desc&page=3&vote_count.gte=200`);
        const data4 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_genres=16&with_original_language=en&region=US&sort_by=vote_average.desc&page=4&vote_count.gte=200`);
        const data = [...data1.results, ...data2.results,...data3.results,...data4.results];
        res.json({success:true,content:data});
    }
    catch(error) {
        console.log("Error in getting anime movie top rated: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }
}


export const getKdramaTopRated = async (req,res) => {
    try {
        const data1 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_origin_country=KR&with_original_language=ko&with_genres=18&vote_count.gte=100&sort_by=vote_average.desc`);
        const data2 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_origin_country=KR&with_original_language=ko&with_genres=18&vote_count.gte=100&sort_by=vote_average.desc&page=2`);
        const data3 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_origin_country=KR&with_original_language=ko&with_genres=18&vote_count.gte=100&sort_by=vote_average.desc&page=3`);
        const data4 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_origin_country=KR&with_original_language=ko&with_genres=18&vote_count.gte=100&sort_by=vote_average.desc&page=4`);
        const data = [...data1.results, ...data2.results,...data3.results,...data4.results];
        res.json({success:true,content:data});
    }
    catch(error) {
        console.log("Error in getting anime movie top rated: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }
}



export const getAnimeOnAir = async (req,res) => {
    try {
        const TODAY = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
        const data1 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?&with_genres=16&with_origin_country=JP&primary_release_date.lte=${TODAY}&sort_by=primary_release_date.desc`);
        const data2 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?&with_genres=16&with_origin_country=JP&primary_release_date.lte=${TODAY}&sort_by=primary_release_date.desc&page=2`);
        const data3 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?&with_genres=16&with_origin_country=JP&primary_release_date.lte=${TODAY}&sort_by=primary_release_date.desc&page=3`);
        const data4 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?&with_genres=16&with_origin_country=JP&primary_release_date.lte=${TODAY}&sort_by=primary_release_date.desc&page=4`);
        const data = [...data1.results,...data2.results,...data3.results,...data4.results]
        res.json({ success: true, content: data });
    } catch (error) {
        console.log("Error in getting anime movie trending: " + error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getAnimationOnAir = async (req,res) => {
    try {
        const TODAY = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
        const data1 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_genres=16&with_original_language=en&region=US&primary_release_date.lte=${TODAY}&sort_by=primary_release_date.desc`);
        const data2 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_genres=16&with_original_language=en&region=US&primary_release_date.lte=${TODAY}&sort_by=primary_release_date.desc&page=2`);
        const data3 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_genres=16&with_original_language=en&region=US&primary_release_date.lte=${TODAY}&sort_by=primary_release_date.desc&page=3`);
        const data4 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_genres=16&with_original_language=en&region=US&primary_release_date.lte=${TODAY}&sort_by=primary_release_date.desc&page=4`);
        const data = [...data1.results,...data2.results,...data3.results,...data4.results]
        res.json({ success: true, content: data });
    } catch (error) {
        console.log("Error in getting anime movie trending: " + error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getKdramaOnAir = async (req,res) => {
    try {
        const TODAY = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
        const data1 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_origin_country=KR&with_original_language=ko&with_genres=18&primary_release_date.lte=${TODAY}&sort_by=primary_release_date.desc`);
        const data2 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_origin_country=KR&with_original_language=ko&with_genres=18&primary_release_date.lte=${TODAY}&sort_by=primary_release_date.desc&page=2`);
        const data3 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_origin_country=KR&with_original_language=ko&with_genres=18&primary_release_date.lte=${TODAY}&sort_by=primary_release_date.desc&page=3`);
        const data4 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_origin_country=KR&with_original_language=ko&with_genres=18&primary_release_date.lte=${TODAY}&sort_by=primary_release_date.desc&page=4`);
        const data = [...data1.results,...data2.results,...data3.results,...data4.results]
        res.json({ success: true, content: data });
    } catch (error) {
        console.log("Error in getting anime movie trending: " + error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};



export const getMovieTrailer = async (req, res) => {
    const {id} = req.params;
    try{
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`);
        const trailer = data.results;
        res.json({success:true,content:trailer});
        //console.log("trailer fetched successfully");
    }
    catch(error) {
        console.log("Error in getting movie trailer: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }
}
export const getMovieDetails = async (req, res) => {
    const {id} = req.params;
    try{
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}?language=en-US`);
        res.json({success:true,content:data});
    }
    catch(error) {
        console.log("Error in getting movie details: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }
}
export const addMovieWatch = async (req, res) => {
    const {id} = req.params;
    try{
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}?language=en-US`);
        const user = await User.findById(req.user._id);

        const isMovieExists = user.watchList.some(x => x.id === data.id);

        if (isMovieExists) {
            return res.json({ success: false, message: "Already exists in watchlist" });
        }
        await User.findByIdAndUpdate(req.user._id,{
                    $push:{
                    watchList:{
                    type:'movie',
                    id:data.id,
                    image: data.poster_path,
                    title: data.title,
                    }
                }});
        return res.json({success:true,message:"movie added to watchlist"});
    }
    catch(error) {
        console.log("Error in adding movie to watchlist: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }
}
export const getWatchlist = async(req,res) => { 
    try {
        res.json({success:true,content:req.user.watchList});
    }
    catch(error) {
        console.log("Error in getting watchlist: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }
}
export const removeFromWatchlist = async(req,res) => {
    let {id} = req.params;
    id = parseInt(id);
    try {
        await User.findByIdAndUpdate(req.user._id,{
            $pull:{
                watchList:{id:id}
            }
        });
        res.json({success:true,message:"Removed successfully"});
    }
    catch(error) {
        res.status(500).json({success:false,message:error.message});
    }
};
export const getSimilarMovies = async(req,res) => {
    const {id} = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`);
        const movies = data.results;
        movies.sort((a, b) => b.popularity - a.popularity);
        res.json({success:true,content:movies});
    }
    catch(error) {
        console.log("Error in getting similar movies: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }   
}
export const getMoviebyCategory = async(req,res) => {
    const {category} = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`);
        const movies = data.results;
        res.json({success:true,content:movies});
    }
    catch(error) {
        console.log("Error in getting movies by category: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }   
}
export const getRandomMovie = async(req,res) => {
    try {
        // Step 1: random page (TMDB max 500 pages)
        const randomPage = Math.floor(Math.random() * 500) + 1;
    
        const data = await fetchFromTMDB(
          `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&page=${randomPage}&include_adult=false`
        );
    
        const movies = data.results;
    
        if (!movies || movies.length === 0) {
          return res.status(404).json({ success: false });
        }
    
        // Step 2: pick random movie from page
        const randomMovie =
          movies[Math.floor(Math.random() * movies.length)];
    
        res.json({ success: true, content: randomMovie });
    
      } catch (error) {
        console.error("Random movie error:", error.message);
        res.status(500).json({ success: false });
      }
    };

export const getMovieCredits = async(req,res) => {
    const {id} = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`);
        res.json({success:true,content:data});
    }
    catch(error) {
        console.log("Error in getting movies by category: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }   
}

export const getCollection = async(req,res) => {
    const {id} = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/collection/${id}?language=en-US`);
        res.json({success:true,content:data});
    }
    catch(error) {
        console.log("Error in getting collection: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }   
}

export const getGoatMovies = async (req, res) => {
	const { movies } = req.body; // Array of {title, year} objects
	
	try {
		if (!movies || !Array.isArray(movies) || movies.length === 0) {
			return res.status(400).json({ 
				success: false, 
				message: "Invalid movies data" 
			});
		}

		console.log(`Fetching ${movies.length} GOAT movies from TMDB...`);

		// Fetch all movies in parallel
		const moviePromises = movies.map(async (movie) => {
			try {
				const data = await fetchFromTMDB(
					`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(movie.title)}&primary_release_year=${movie.year}&language=en-US&page=1`
				);
				
				// Return the first result if found
				if (data.results && data.results.length > 0) {
					return data.results[0];
				}
				
				// If no exact year match, try without year
				const fallbackData = await fetchFromTMDB(
					`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(movie.title)}&language=en-US&page=1`
				);
				
				return fallbackData.results && fallbackData.results.length > 0 
					? fallbackData.results[0] 
					: null;
			} catch (error) {
				console.error(`Error fetching ${movie.title}:`, error.message);
				return null;
			}
		});

		const results = await Promise.all(moviePromises);
		
		// Filter out null results
		const validMovies = results.filter(movie => movie !== null);

		console.log(`Successfully fetched ${validMovies.length}/${movies.length} movies`);

		res.status(200).json({ 
			success: true, 
			content: validMovies,
			total: validMovies.length
		});

	} catch (error) {
		console.error("Error in getGoatMovies:", error.message);
		res.status(500).json({ 
			success: false, 
			message: "Internal server error" 
		});
	}
}
