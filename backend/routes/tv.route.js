import express from 'express';
import {getTrendingTv} from '../controllers/tv.controller.js';
import { getTvTrailer } from '../controllers/tv.controller.js';
import { getTvDetails } from '../controllers/tv.controller.js';
import { getSimilarTv } from '../controllers/tv.controller.js';
import { getTvbyCategory } from '../controllers/tv.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';


const router = express.Router();

router.get('/trending',protectRoute,getTrendingTv)
router.get('/trailers/:id',protectRoute,getTvTrailer)
router.get('/details/:id',protectRoute,getTvDetails)
router.get('/similar/:id',protectRoute,getSimilarTv)
router.get('/category/:category',protectRoute,getTvbyCategory)
export default router;