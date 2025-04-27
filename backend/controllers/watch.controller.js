import {User} from "../models/user.model.js";

export const addWatchHistoryMovie = async (req, res) => {
    const {id} = req.body;
    const {poster_path} = req.body;
    const {backdrop_path} = req.body;
    const {title} = req.body;
    const user = await User.findById(req.user._id);
    try{
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
    
        // check if id exists with today's date
        const alreadyExistsToday = user.watchHistory.some((item) => {
          if (item.id !== id) return false;
          
          const itemDate = new Date(item.date);
          itemDate.setHours(0, 0, 0, 0); 
    
          return itemDate.getTime() === today.getTime(); 
        });
    
       if(!alreadyExistsToday) {
        await User.findByIdAndUpdate(req.user._id,{
            $push:{
                watchHistory:{
            type:'movie',
            id:id,
            image: poster_path || backdrop_path,
            name: title,
            date: new Date(),
            }
        }});
       }
      return;
        
    }
    catch(error) {
        console.log("Error adding watchHistory: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }
}
export const addWatchHistoryTv = async (req, res) => {
   let {id} = req.params;
   const {sname} = req.params;
   let {tepisodes} = req.params;
   const {episode_number} = req.body;
   let {season} = req.params;
   const {still_path} = req.body;
   const {name} = req.body;
   id = parseInt(id);
   tepisodes = parseInt(tepisodes);
   season = parseInt(season);
   const user = await User.findById(req.user._id);
   
    try{

        const today = new Date();
        today.setHours(0, 0, 0, 0); 
    
        // check if id exists with today's date
        const alreadyExistsToday = user.watchHistory.some((item) => {
          if (item.id !== id) return false;
          
          const itemDate = new Date(item.date);
          itemDate.setHours(0, 0, 0, 0); 
    
          return itemDate.getTime() === today.getTime() && item.episode === episode_number && item.season === season; 
        });
        
         if(!alreadyExistsToday) {
            await User.findByIdAndUpdate(req.user._id,{
                $push:{
                    watchHistory:{
                type:'tv',
                id:id,
                image: still_path,
                name:sname,
                title: name,
                episode:episode_number,
                season:season,
                tepisodes:tepisodes,
                date: new Date(),
                }
            }});
         }
         return;
        
    }
    catch(error) {
        console.log("Error adding WatchHistory: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }
}
export const removeMovieHistory = async(req,res) => {
    let {id} = req.params;
    let {date} = req.params;
    date = new Date(date);
    id = parseInt(id);
    try {
        await User.findByIdAndUpdate(req.user._id,{
            $pull:{
                watchHistory:{
                    id:id,
                    date:date
                }
            }
        });
        res.json({success:true,message:"watch history removed successfully"});
    }
    catch(error) {
        res.status(500).json({success:false,message:error.message});
    }
};
export const removeTvHistory = async(req,res) => {
    let {id} = req.params;
    let {date} = req.params;
    let {season} = req.params;
    let {episode} = req.params;
    date = new Date(date);
    id = parseInt(id);
    season = parseInt(season);
    episode = parseInt(episode);
    try {
        await User.findByIdAndUpdate(req.user._id,{
            $pull:{
                watchHistory:{
                    id:id,
                    season:season,
                    episode:episode,
                    date:date
                }
            }
        });
        res.json({success:true,message:"watch history removed successfully"});
    }
    catch(error) {
        res.status(500).json({success:false,message:error.message});
    }
};
export const clearWatchHistory = async(req,res) => {
  
    try {
        await User.findByIdAndUpdate(req.user._id,{
                watchHistory:[],
        
        });
        res.json({success:true,message:"watch history cleared successfully"});
    }
    catch(error) {
        res.status(500).json({success:false,message:error.message});
    }
};