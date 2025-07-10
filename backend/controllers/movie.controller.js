
import { fetchFromTMDB } from "../services/tmdb.service.js"
import {User} from "../models/user.model.js";

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
