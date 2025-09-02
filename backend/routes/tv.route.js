import express from 'express';
import {getTrendingTv, getTvEpisodes} from '../controllers/tv.controller.js';
import { getTvTrailer } from '../controllers/tv.controller.js';
import { getTvDetails } from '../controllers/tv.controller.js';
import { getSimilarTv } from '../controllers/tv.controller.js';
import { getTvbyCategory } from '../controllers/tv.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';
import { addTvWatch } from '../controllers/tv.controller.js';
import {addEpisode} from '../controllers/tv.controller.js';
import {removeEpisode} from '../controllers/tv.controller.js';
import {getTvCredits} from '../controllers/tv.controller.js';
import {getAnimePopular} from '../controllers/tv.controller.js';
import {getAnimeTopRated} from '../controllers/tv.controller.js';
import {getAnimeOnAir} from '../controllers/tv.controller.js';

const router = express.Router();

router.get('/trending',protectRoute,getTrendingTv)
router.get('/trailers/:id',protectRoute,getTvTrailer)
router.get('/details/:id',protectRoute,getTvDetails)
router.get('/similar/:id',protectRoute,getSimilarTv)
router.get('/category/:category',protectRoute,getTvbyCategory)
router.put('/addWatch/:id',protectRoute,addTvWatch);
router.post('/episodes',protectRoute,getTvEpisodes)
router.post('/addEpisode',protectRoute,addEpisode)
router.get('/credits/:id',protectRoute,getTvCredits);
router.delete('/removeWatchE/:id/:season/:episode',protectRoute ,removeEpisode);
router.get('/anime/popular',protectRoute,getAnimePopular);
router.get('/anime/top-rated',protectRoute,getAnimeTopRated);
router.get('/anime/on-air',protectRoute,getAnimeOnAir);

export default router;