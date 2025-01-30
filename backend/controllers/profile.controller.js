
export const getUserProfile = async (req, res) => {
    res.json({success:true,message:"user profile fetched successfully",user:req.user});
}