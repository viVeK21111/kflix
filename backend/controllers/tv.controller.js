
import { fetchFromTMDB } from "../services/tmdb.service.js"

export const getTrendingTv = async (req, res) => {
    try {
    const data = await fetchFromTMDB('https://api.themoviedb.org/3/tv/popular?language=en-US&page=1');
     const movie = data.results[Math.floor(Math.random() * data.results?.length)];
    res.json({success:true,content:movie});
    }
     catch(error) {
        console.log("Error in getting trending movies: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }
}
export const getTvTrailer = async (req, res) => {
    const {id} = req.params;
    try{
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`);
        const trailer = data.results;
        res.json({success:true,content:trailer});
        console.log("trailer fetched successfully");
    }
    catch {
        console.log("Error in getting movie trailer: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }
}
export const getTvDetails = async (req, res) => {
    const {id} = req.params;
    try{
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}?language=en-US`);
        res.json({success:true,content:data});
    }
    catch {
        console.log("Error in getting movie details: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }
}
export const getSimilarTv = async(req,res) => {
    const {id} = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=1`);
        const movies = data.results;
        res.json({success:true,content:movies});
    }
    catch(error) {
        console.log("Error in getting similar movies: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }   
}
export const getTvbyCategory = async(req,res) => {
    const {category} = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${category}?language=en-US&page=1`);
        const movies = data.results;
        res.json({success:true,content:movies});
    }
    catch(error) {
        console.log("Error in getting movies by category: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }   
}