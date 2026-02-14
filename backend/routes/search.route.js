import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { optionalAuth } from '../middleware/optionalAuth.js';

import { searchHistory, searchMovies,searchTv,searchPeople, removeFromSearchHistory,removeFromChatHistory,ClearHistory,getPersonDetails,getPersonCredits,clearChatHistory,getPersonPopular } from '../controllers/search.controller.js';

const router = express.Router();

router.get('/movie/:query',optionalAuth,searchMovies);
router.get('/tv/:query',optionalAuth,searchTv);
router.get('/people/:query',optionalAuth,searchPeople);
router.get('/history',protectRoute,searchHistory)
router.delete('/removehistory/:id',protectRoute,removeFromSearchHistory)
router.delete('/clearhistory',protectRoute,ClearHistory)
router.get('/person/:id',getPersonDetails)
router.get('/person/credits/:id',getPersonCredits)
router.get('/person/popular',getPersonPopular);
router.delete('/removehistoryquery',protectRoute,removeFromChatHistory)
router.delete('/clearhistoryquery',protectRoute,clearChatHistory)

export default router;