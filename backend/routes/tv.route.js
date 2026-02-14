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
import { getKdramaOnAir } from '../controllers/tv.controller.js';
import { getKdramaPopular } from '../controllers/tv.controller.js';
import { getKdramaTopRated } from '../controllers/tv.controller.js';
import { getAnimationTopRated,getAnimationPopular,getAnimationOnAir } from '../controllers/tv.controller.js';

const router = express.Router();

router.get('/trending',getTrendingTv)
router.get('/trailers/:id',getTvTrailer)
router.get('/details/:id',getTvDetails)
router.get('/similar/:id',getSimilarTv)
router.get('/category/:category',getTvbyCategory)
router.put('/addWatch/:id',protectRoute,addTvWatch);
router.post('/episodes',getTvEpisodes)
router.post('/addEpisode',protectRoute,addEpisode)
router.get('/credits/:id',getTvCredits);
router.delete('/removeWatchE/:id/:season/:episode',protectRoute ,removeEpisode);
router.get('/anime/popular',getAnimePopular);
router.get('/anime/top-rated',getAnimeTopRated);
router.get('/anime/on-air',getAnimeOnAir);
router.get('/animation/popular',getAnimationPopular);
router.get('/animation/top-rated',getAnimationTopRated);
router.get('/animation/on-air',getAnimationOnAir);
router.get('/kdrama/popular',getKdramaPopular);
router.get('/kdrama/top-rated',getKdramaTopRated);
router.get('/kdrama/on-air',getKdramaOnAir);


export default router;