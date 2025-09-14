import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';

import { searchHistory, searchMovies,searchTv,searchPeople, removeFromSearchHistory,removeFromChatHistory,ClearHistory,getPersonDetails,getPersonCredits,clearChatHistory,getPersonPopular } from '../controllers/search.controller.js';

const router = express.Router();

router.get('/movie/:query',protectRoute,searchMovies);
router.get('/tv/:query',protectRoute,searchTv);
router.get('/people/:query',protectRoute,searchPeople);
router.get('/history',protectRoute,searchHistory)
router.delete('/removehistory/:id',protectRoute,removeFromSearchHistory)
router.delete('/clearhistory',protectRoute,ClearHistory)
router.get('/person/:id',protectRoute,getPersonDetails)
router.get('/person/credits/:id',protectRoute,getPersonCredits)
router.get('/person/popular',protectRoute,getPersonPopular);
router.delete('/removehistoryquery',protectRoute,removeFromChatHistory)
router.delete('/clearhistoryquery',protectRoute,clearChatHistory)

export default router;