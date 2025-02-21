import express from 'express';
import {getTrendingMovies} from '../controllers/movie.controller.js';
import { getMovieTrailer } from '../controllers/movie.controller.js';
import { getMovieDetails } from '../controllers/movie.controller.js';
import { getSimilarMovies } from '../controllers/movie.controller.js';
import { getMoviebyCategory} from '../controllers/movie.controller.js';
import {getMovieCredits } from '../controllers/movie.controller.js'
import { protectRoute } from '../middleware/protectRoute.js';
const router = express.Router();

router.get('/trending',protectRoute,getTrendingMovies)
router.get('/trailers/:id',protectRoute,getMovieTrailer)
router.get('/details/:id',protectRoute,getMovieDetails)
router.get('/similar/:id',protectRoute,getSimilarMovies)
router.get('/category/:category',protectRoute,getMoviebyCategory)
router.get('/credits/:id',protectRoute,getMovieCredits);
export default router;