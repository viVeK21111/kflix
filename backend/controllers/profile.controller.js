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
