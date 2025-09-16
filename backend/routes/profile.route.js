
import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { adultPreference, getadultPreference, getUserProfile, updateFlappyHighScore } from '../controllers/profile.controller.js';

const router = express.Router();

router.get('/profile',protectRoute,getUserProfile);
router.post('/adultContent',protectRoute,adultPreference);
router.get('/getadultPreference',protectRoute,getadultPreference);
router.post('/flappy/score', protectRoute, updateFlappyHighScore);

export default router;