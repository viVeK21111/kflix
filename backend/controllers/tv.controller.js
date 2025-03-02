
import { fetchFromTMDB } from "../services/tmdb.service.js"
import {User} from "../models/user.model.js";

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
    catch(error) {
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
    catch(error) {
        console.log("Error in getting tv details: "+error.message);
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
        console.log("Error in getting similar tv: "+error.message);
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
        console.log("Error in getting tv by category: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }   
}
export const addTvWatch = async (req, res) => {
    const {id} = req.params;
    try{
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}?language=en-US`);
        const user = await User.findById(req.user._id);

        const isMovieExists = user.watchList.some(x => x.id === data.id);

        if (isMovieExists) {
            return res.json({ success: false, message: "Already exists in watchlist" });
        }
        await User.findByIdAndUpdate(req.user._id,{
                    $push:{
                    watchList:{
                    type:'tv',
                    id:data.id,
                    image: data.poster_path,
                    title: data.name,
                    }
                }});
        return res.json({success:true,message:"tvshow added to watchlist"});
    }
    catch(error) {
        console.log("Error in adding tv to watchlist: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }
}
