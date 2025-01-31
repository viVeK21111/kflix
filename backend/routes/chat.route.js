import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { GetMovieList} from '../controllers/chat.controller.js';

const router = express.Router();

router.post('/movie/llm',protectRoute,GetMovieList);


export default router;