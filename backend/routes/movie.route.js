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
import { getCollection } from '../controllers/movie.controller.js';

const router = express.Router();

router.get('/trending',getTrendingMovies)
router.get('/trailers/:id',getMovieTrailer)
router.get('/details/:id',getMovieDetails)
router.get('/similar/:id',getSimilarMovies)
router.get('/category/:category',getMoviebyCategory)
router.get('/credits/:id',getMovieCredits);
router.put('/addWatch/:id',protectRoute,addMovieWatch);
router.get('/getWatchlist',protectRoute,getWatchlist);
router.delete('/removeWatch/:id',protectRoute,removeFromWatchlist);
router.get('/anime/popular',getAnimePopular);
router.get('/anime/top-rated',getAnimeTopRated);
router.get('/anime/on-air',getAnimeOnAir);
router.get('/animation/popular',getAnimationPopular);
router.get('/animation/top-rated',getAnimationTopRated);
router.get('/animation/on-air',getAnimationOnAir);
router.get('/kdrama/popular',getKdramaPopular);
router.get('/kdrama/top-rated',getKdramaTopRated);
router.get('/kdrama/on-air',getKdramaOnAir);
router.post('/goat-movies', getGoatMovies);
router.get('/collection/:id', getCollection);

export default router;