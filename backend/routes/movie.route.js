import express from 'express';
import {getTrendingMovies,getAnimePopular,getAnimeTopRated,getAnimeOnAir} from '../controllers/movie.controller.js';
import { getMovieTrailer } from '../controllers/movie.controller.js';
import { getMovieDetails } from '../controllers/movie.controller.js';
import { getSimilarMovies } from '../controllers/movie.controller.js';
import { getMoviebyCategory} from '../controllers/movie.controller.js';
import {getMovieCredits } from '../controllers/movie.controller.js'
import { protectRoute } from '../middleware/protectRoute.js';
import { addMovieWatch } from '../controllers/movie.controller.js';
import {getWatchlist} from '../controllers/movie.controller.js';
import { removeFromWatchlist } from '../controllers/movie.controller.js';
import { getKdramaOnAir } from '../controllers/movie.controller.js';
import { getKdramaPopular } from '../controllers/movie.controller.js';
import { getKdramaTopRated } from '../controllers/movie.controller.js';
import {getAnimationOnAir,getAnimationPopular,getAnimationTopRated} from '../controllers/movie.controller.js'
import { getGoatMovies } from "../controllers/movie.controller.js";

const router = express.Router();

router.get('/trending',protectRoute,getTrendingMovies)
router.get('/trailers/:id',protectRoute,getMovieTrailer)
router.get('/details/:id',protectRoute,getMovieDetails)
router.get('/similar/:id',protectRoute,getSimilarMovies)
router.get('/category/:category',protectRoute,getMoviebyCategory)
router.get('/credits/:id',protectRoute,getMovieCredits);
router.put('/addWatch/:id',protectRoute,addMovieWatch);
router.get('/getWatchlist',protectRoute,getWatchlist);
router.delete('/removeWatch/:id',protectRoute,removeFromWatchlist);
router.get('/anime/popular',protectRoute,getAnimePopular);
router.get('/anime/top-rated',protectRoute,getAnimeTopRated);
router.get('/anime/on-air',protectRoute,getAnimeOnAir);
router.get('/animation/popular',protectRoute,getAnimationPopular);
router.get('/animation/top-rated',protectRoute,getAnimationTopRated);
router.get('/animation/on-air',protectRoute,getAnimationOnAir);
router.get('/kdrama/popular',protectRoute,getKdramaPopular);
router.get('/kdrama/top-rated',protectRoute,getKdramaTopRated);
router.get('/kdrama/on-air',protectRoute,getKdramaOnAir);
router.post('/goat-movies', protectRoute, getGoatMovies);

export default router;