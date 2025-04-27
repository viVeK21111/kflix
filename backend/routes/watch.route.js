import express from 'express';
import { addWatchHistoryMovie,addWatchHistoryTv,removeMovieHistory,removeTvHistory,clearWatchHistory } from '../controllers/watch.controller.js';   
import { protectRoute } from '../middleware/protectRoute.js';


const router = express.Router();
router.post('/addWatchMovie',protectRoute,addWatchHistoryMovie);
router.post('/addWatchTv/:id/:season/:sname/:tepisodes',protectRoute,addWatchHistoryTv);
router.get('/removeMovieWatch/:id/:date',protectRoute,removeMovieHistory);
router.get('/removeTvWatch/:id/:date/:season/:episode',protectRoute,removeTvHistory);
router.get('/clearWatchHistory',protectRoute,clearWatchHistory);

export default router;