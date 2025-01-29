import express from 'express';
import {getTrendingMovies} from '../controllers/movie.controller.js';
import { getMovieTrailer } from '../controllers/movie.controller.js';
import { getMovieDetails } from '../controllers/movie.controller.js';

const router = express.Router();

router.get('/trending',getTrendingMovies)
router.get('/trailers/:id',getMovieTrailer)
router.get('/details/:id',getMovieDetails)
export default router;