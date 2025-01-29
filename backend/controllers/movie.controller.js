
import { fetchFromTMDB } from "../services/tmdb.service.js"

export const getTrendingMovies = async (req, res) => {
    try {
    const data = await fetchFromTMDB('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1');
     const movie = data.results[Math.floor(Math.random() * data.results?.length)];
    res.json({success:true,content:movie});
    }
     catch(error) {
        console.log("Error in getting trending movies: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }
}
export const getMovieTrailer = async (req, res) => {
    const {id} = req.params;
    try{
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`);
        const trailer = data.results;
        res.json({success:true,trailers:trailer});
        console.log("trailer fetched successfully");
    }
    catch {
        console.log("Error in getting movie trailer: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }
}
export const getMovieDetails = async (req, res) => {
    const {id} = req.params;
    try{
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}?language=en-US`);
        res.json({success:true,details:data});
    }
    catch {
        console.log("Error in getting movie details: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }
}
export const getSimilarMovies = async(req,res) => {
    const {id} = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`);
        const movies = data.results;
        res.json({success:true,similarmovies:movies});
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
        res.json({success:true,moviesbycategory:movies});
    }
    catch(error) {
        console.log("Error in getting movies by category: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }   
}