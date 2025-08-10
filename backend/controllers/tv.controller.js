
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
export const getTvCredits = async(req,res) => {
    const {id} = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/credits?language=en-US`);
        res.json({success:true,content:data});
    }
    catch(error) {
        console.log("Error in getting movies by category: "+error.message);
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
export const getTvEpisodes = async(req,res) => {
    const {Id,Season} = req.body;
    
    try{
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${Id}/season/${Season}?language=en-US`);
        res.json({success:true,content:data});
    }
    catch(error) {
        console.log("Error in getting tv Episodes: "+error.message);
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

export const addEpisode = async (req, res) => {
    let {id,season,episode,name,totalEpisodes,poster_path,title} = req.body;
    id = parseInt(id);
    season = parseInt(season);
    episode = parseInt(episode);
    totalEpisodes = parseInt(totalEpisodes);
    const user = await User.findById(req.user._id);
    try{

         const isEpisodeExists = user.watchList.some(x => (x.id === id && x.season === season && x.episode === episode));

        if (isEpisodeExists) {
            return res.json({ success: false, message: "Already exists in watchlist" });
        }
        
        await User.findByIdAndUpdate(req.user._id,{
                    $push:{
                    watchList:{
                    type:'tv',
                    id:id,
                    image:poster_path,
                    title: title,
                    season:season,
                    episode:episode,
                    name:name,
                    totalEpisodes:totalEpisodes
                    }
                }});
        return res.json({success:true,message:"Episode added to watchlist"});
    }
    catch(error) {
        console.log("Error in adding tv to watchlist: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }
}
export const removeEpisode = async (req, res) => {
    let {id,season,episode} = req.params;
    id = parseInt(id);
    season = parseInt(season);
    episode = parseInt(episode);
    try{
        
        await User.findByIdAndUpdate(req.user._id,{
                    $pull:{
                    watchList:{
                    type:'tv',
                    id:id,
                    season:season,
                    episode:episode,
                    }
                }});
        return res.json({success:true,message:"episode removed from watchlist"});
    }
    catch(error) {
        console.log("Error in adding tv to watchlist: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }
}