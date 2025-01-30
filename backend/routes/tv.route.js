import express from 'express';
import {getTrendingTv} from '../controllers/tv.controller.js';
import { getTvTrailer } from '../controllers/tv.controller.js';
import { getTvDetails } from '../controllers/tv.controller.js';
import { getSimilarTv } from '../controllers/tv.controller.js';
import { getTvbyCategory } from '../controllers/tv.controller.js';

const router = express.Router();

router.get('/trending',getTrendingTv)
router.get('/trailers/:id',getTvTrailer)
router.get('/details/:id',getTvDetails)
router.get('/similar/:id',getSimilarTv)
router.get('/category/:category',getTvbyCategory)
export default router;