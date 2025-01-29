import express from 'express';
import {getTrendingMovies} from '../controllers/movie.controller.js';
import { getMovieTrailer } from '../controllers/movie.controller.js';
import { getMovieDetails } from '../controllers/movie.controller.js';
import { getSimilarMovies } from '../controllers/movie.controller.js';
import { getMoviebyCategory } from '../controllers/movie.controller.js';
const router = express.Router();

router.get('/trending',getTrendingMovies)
router.get('/trailers/:id',getMovieTrailer)
router.get('/details/:id',getMovieDetails)
router.get('/similar/:id',getSimilarMovies)
router.get('/category/:category',getMoviebyCategory)
export default router;