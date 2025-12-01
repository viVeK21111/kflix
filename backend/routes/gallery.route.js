import express from "express";
import { User } from "../models/user.model.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// Get all gallery images (public)
router.get("/all", async (req, res) => {
	try {
		const users = await User.find({}, 'galleryImages');
		
		// Flatten all gallery images from all users
		const allImages = users.reduce((acc, user) => {
			return [...acc, ...user.galleryImages];
		}, []);
		
		// Sort by uploadedAt descending (newest first)
		allImages.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
		
		res.status(200).json({ success: true, images: allImages });
	} catch (error) {
		console.error("Error fetching gallery images:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
});

// Get user's own gallery images
router.get("/my-images", protectRoute, async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		
		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}
		
		res.status(200).json({ 
			success: true, 
			images: user.galleryImages 
		});
	} catch (error) {
		console.error("Error fetching user gallery images:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
});

// Upload new image (add image link)
router.post("/upload", protectRoute, async (req, res) => {
	try {
		const { imageUrl } = req.body;
		
		if (!imageUrl || !imageUrl.trim()) {
			return res.status(400).json({ 
				success: false, 
				message: "Image URL is required" 
			});
		}
		
		const user = await User.findById(req.user._id);
        console.log('user upload',user);

		
		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}
		
		const newImage = {
			imageUrl: imageUrl.trim(),
			uploadedAt: new Date(),
			uploaderEmail: user.email,
			uploaderUsername: user.username
		};
		
		// Use $push to avoid validation issues with password field
		await User.findByIdAndUpdate(
			req.user._id,
			{ $push: { galleryImages: newImage } },
			{ runValidators: false }
		);
		
		res.status(201).json({ 
			success: true, 
			message: "Image uploaded successfully",
			image: newImage
		});
	} catch (error) {
		console.error("Error uploading image:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
});

// Delete image
router.delete("/:imageId", protectRoute, async (req, res) => {
	try {
		const { imageId } = req.params;
		const user = await User.findById(req.user._id);
		
		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}
		
		// Find the image
		const imageIndex = user.galleryImages.findIndex(
			img => img._id.toString() === imageId
		);
		
		if (imageIndex === -1) {
			return res.status(404).json({ 
				success: false, 
				message: "Image not found" 
			});
		}
		
		// Check if the user owns this image
		if (user.galleryImages[imageIndex].uploaderEmail !== user.email) {
			return res.status(403).json({ 
				success: false, 
				message: "Unauthorized to delete this image" 
			});
		}
		
		// Remove the image using $pull to avoid validation issues
		await User.findByIdAndUpdate(
			req.user._id,
			{ $pull: { galleryImages: { _id: imageId } } },
			{ runValidators: false }
		);
		
		res.status(200).json({ 
			success: true, 
			message: "Image deleted successfully" 
		});
	} catch (error) {
		console.error("Error deleting image:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
});

export default router;