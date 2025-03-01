import { fetchFromTMDB } from "../services/tmdb.service.js";
import {User} from "../models/user.model.js";

export const searchMovies = async(req,res) => {
    const {query} = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/search/movie?query=${query}&language=en-US&page=1`);
        const movie = data.results;
        if(movie.length===0) {
            res.json({success:false,message:"No movie found"});
            return;
        }
        res.json({success:true,content:movie});
        console.log("movie search success");

        await User.findByIdAndUpdate(req.user._id,{
            $push:{
                searchHistory:{
            type:'movie',
            id:movie[0].id,
            image: movie[0].poster_path,
            title: movie[0].title,
            date: new Date(),
            }
    }});
    }
    catch(error) {
        console.log("Error in searching movies: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }   
}
export const searchTv = async(req,res) => {
    const {query} = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/search/tv?query=${query}&language=en-US&page=1`);
        const tv = data.results;
        if(tv.length === 0) {
            return res.json({success:false,message:"No tv show found"});
        }
        res.json({success:true,content:tv});
        await User.findByIdAndUpdate(req.user._id,{
            $push:{searchHistory:{
            type:'tv',
            id:tv[0].id,
            image: tv[0].backdrop_path,
            name: tv[0].original_name,
            date: new Date(),
        }}});
    }
    catch(error) {
        console.log("Error in searching tv show: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }   
}
export const searchPeople = async(req,res) => {
    const {query} = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/search/person?query=${query}&language=en-US&page=1`);
        const person = data.results;
        if(person.length===0) {
            return res.json({success:false,message:"No person found"});
        }
        res.json({success:true,content:person});
        console.log("person search success");
        await User.findByIdAndUpdate(req.user._id,{
            $push:{searchHistory:{
            type:'person',
            id: person[0].id,
            image: person[0].profile_path,
            name: person[0].name,
            date: new Date(),
        }}});
    }
    catch(error) {
        console.log("Error in searching person: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }   
}
export const getPersonDetails = async(req,res) => {
    const {id} = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/person/${id}?language=en-US&page=1`);
        if(data.length===0) {
            return res.json({success:false,message:"No person found"});
        }
        res.json({success:true,content:data});
        console.log("person details success");
       
    }
    catch(error) {
        console.log("Error in searching person: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }   
}

export const getPersonCredits = async(req,res) => {
    const {id} = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/person/${id}/movie_credits?language=en-US&page=1`);
        if(data.length===0) {
            return res.json({success:false,message:"No person found"});
        }
        res.json({success:true,content:data});
        console.log("person credits success");
       
    }
    catch(error) {
        console.log("Error in searching person: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }   
}

export const searchHistory = async(req,res) => {
    try {
        res.json({success:true,searchHistory:req.user.searchHistory});
    }
    catch(error) {
        res.status(500).json({success:false,message:error.message});
    }
}

export const removeFromSearchHistory = async(req,res) => {
    let {id} = req.params;
    id = parseInt(id);
    try {
        await User.findByIdAndUpdate(req.user._id,{
            $pull:{
                searchHistory:{id:id}
            }
        });
        res.json({success:true,message:"search history removed successfully"});
    }
    catch(error) {
        res.status(500).json({success:false,message:error.message});
    }
};

export const ClearHistory = async(req,res) => {
    try {
        await User.findByIdAndUpdate(req.user._id,{
          searchHistory:[],
        });
        res.json({success:true,message:"search history cleared successfully"});
    }
    catch(error) {
        res.status(500).json({success:false,message:error.message});
    }
};