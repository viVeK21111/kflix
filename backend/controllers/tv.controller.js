
import { fetchFromTMDB } from "../services/tmdb.service.js"
import {User} from "../models/user.model.js";

export const getTrendingTv = async (req, res) => {
    try {
    const data = await fetchFromTMDB('https://api.themoviedb.org/3/tv/popular?language=en-US&page=1');
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
        const data1 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/tv?with_keywords=210024&sort_by=popularity.desc`);
        const data2 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/tv?with_keywords=210024&sort_by=popularity.desc&page=2`);
        const data3 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/tv?with_keywords=210024&sort_by=popularity.desc&page=3`);
        const data = [...data1.results, ...data2.results,...data3.results];
        res.json({success:true,content:data});
    }
    catch(error) {
        console.log("Error in getting anime trending: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }
}

export const getAnimationPopular = async (req,res) => {
    try {
        const data1 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/tv?with_genres=16&with_origin_country=US&sort_by=popularity.desc`);
        const data2 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/tv?with_genres=16&with_origin_country=US&sort_by=popularity.desc&page=2`);
        const data3 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/tv?with_genres=16&with_origin_country=US&sort_by=popularity.desc&page=3`);
        const data = [...data1.results, ...data2.results,...data3.results];
        res.json({success:true,content:data});
    }
    catch(error) {
        console.log("Error in getting anime trending: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }
}

export const getKdramaPopular = async (req,res) => {
    try {
        const data1 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/tv?with_origin_country=KR&with_original_language=ko&with_genres=18&sort_by=popularity.desc`);
        const data2 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/tv?with_origin_country=KR&with_original_language=ko&with_genres=18&sort_by=popularity.desc&page=2`);
        const data3 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/tv?with_origin_country=KR&with_original_language=ko&with_genres=18&sort_by=popularity.desc&page=3`);
        const data = [...data1.results, ...data2.results,...data3.results];
        res.json({success:true,content:data});
    }
    catch(error) {
        console.log("Error in getting anime trending: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }
}



export const getAnimeTopRated = async (req,res) => {
    try {
        const data1 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/tv?with_keywords=210024&sort_by=vote_average.desc&vote_count.gte=200`);
        const data2 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/tv?with_keywords=210024&sort_by=vote_average.desc&page=2&vote_count.gte=200`);
        const data3 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/tv?with_keywords=210024&sort_by=vote_average.desc&page=3&vote_count.gte=200`);
        const data = [...data1.results, ...data2.results,...data3.results];
        res.json({success:true,content:data});
    }
    catch(error) {
        console.log("Error in getting anime top rated: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }
}

export const getAnimationTopRated = async (req,res) => {
    try {
        const data1 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/tv?with_genres=16&with_origin_country=US&sort_by=vote_average.desc&vote_count.gte=200`);
        const data2 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/tv?with_genres=16&with_origin_country=US&sort_by=vote_average.desc&page=2&vote_count.gte=200`);
        const data3 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/tv?with_genres=16&with_origin_country=US&sort_by=vote_average.desc&page=3&vote_count.gte=200`);
        const data = [...data1.results, ...data2.results,...data3.results];
        res.json({success:true,content:data});
    }
    catch(error) {
        console.log("Error in getting anime top rated: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }
}

export const getKdramaTopRated = async (req,res) => {
    try {
        const data1 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/tv?with_origin_country=KR&with_original_language=ko&with_genres=18&vote_count.gte=100&sort_by=vote_average.desc`);
        const data2 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/tv?with_origin_country=KR&with_original_language=ko&with_genres=18&vote_count.gte=100&sort_by=vote_average.desc&page=2`);
        const data3 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/tv?with_origin_country=KR&with_original_language=ko&with_genres=18&vote_count.gte=100&sort_by=vote_average.desc&page=3`);
        const data = [...data1.results, ...data2.results,...data3.results];
        res.json({success:true,content:data});
    }
    catch(error) {
        console.log("Error in getting anime top rated: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }
}


export const getAnimeOnAir = async (req,res) => {
    try {
        const TODAY = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
        const data1 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/tv?with_keywords=210024&first_air_date.lte=${TODAY}&sort_by=first_air_date.desc`);
        const data2 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/tv?with_keywords=210024&first_air_date.lte=${TODAY}&sort_by=first_air_date.desc&page=2`);
        const data3 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/tv?with_keywords=210024&first_air_date.lte=${TODAY}&sort_by=first_air_date.desc&page=3`);

        const data = [...data1.results,...data2.results,data3.results]
        res.json({ success: true, content: data });
    } catch (error) {
        console.log("Error in getting anime on air: " + error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAnimationOnAir = async (req,res) => {
    try {
        const TODAY = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
        const data1 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/tv?with_genres=16&with_origin_country=US&first_air_date.lte=${TODAY}&sort_by=first_air_date.desc`);
        const data2 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/tv?with_genres=16&with_origin_country=US&first_air_date.lte=${TODAY}&sort_by=first_air_date.desc&page=2`);
        const data3 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/tv?with_genres=16&with_origin_country=US&first_air_date.lte=${TODAY}&sort_by=first_air_date.desc&page=3`);

        const data = [...data1.results,...data2.results,data3.results]
        res.json({ success: true, content: data });
    } catch (error) {
        console.log("Error in getting anime on air: " + error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getKdramaOnAir = async (req,res) => {
    try {
        const TODAY = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
        const data1 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/tv?with_origin_country=KR&with_original_language=ko&with_genres=18&first_air_date.lte=${TODAY}&sort_by=first_air_date.desc`);
        const data2 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/tv?with_origin_country=KR&with_original_language=ko&with_genres=18&first_air_date.lte=${TODAY}&sort_by=first_air_date.desc&page=2`);
        const data3 = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/tv?with_origin_country=KR&with_original_language=ko&with_genres=18&first_air_date.lte=${TODAY}&sort_by=first_air_date.desc&page=3`);

        const data = [...data1.results,...data2.results,data3.results]
        res.json({ success: true, content: data });
    } catch (error) {
        console.log("Error in getting anime on air: " + error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};




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
        movies.sort((a, b) => b.popularity - a.popularity);
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

