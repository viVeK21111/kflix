import {User} from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
    res.json({success:true,message:"user profile fetched successfully",user:req.user});
}

export const adultPreference = async(req,res) => {
    const {preference} = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { "Preferences.adult": preference },  
        );
        if(!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        } 
        res.json({ success: true, message: "Preference updated" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getadultPreference = async(req,res) => {
   
    try {
        const user = await User.findById(
            req.user._id,
        );
        const pref = user?.Preferences?.adult;
        return res.json({ success: true, pref:pref });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


export const updateFlappyHighScore = async (req, res) => {
    try {
        const { score } = req.body;
        if (typeof score !== 'number' || score < 0) {
            return res.status(400).json({ success: false, message: 'Invalid score' });
        }
        const user = await User.findById(req.user._id).select("flappy.score");
        const current = user?.flappy?.score ?? 0;
        if (score > current) {
            await User.findByIdAndUpdate(req.user._id, { "flappy.score": score });
            return res.json({ success: true, updated: true, score });
        }
        return res.json({ success: true, updated: false, score: current });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

