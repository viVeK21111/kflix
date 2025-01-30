
import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { getUserProfile } from '../controllers/profile.controller.js';

const router = express.Router();

router.get('/profile',protectRoute,getUserProfile);
export default router;