import express from 'express';
import {signup,logout,signin} from '../controllers/auth.controller.js'
import {protectRoute} from '../middleware/protectRoute.js'
import { authCheck,changePassword,deleteAccount } from '../controllers/auth.controller.js'; 

const router = express.Router();

router.post('/signup',signup);
router.post('/signin',signin);
router.post('/logout',logout);
router.get('/authcheck',protectRoute,authCheck);
router.post('/changePassword',protectRoute,changePassword);
router.get('/deleteUser',protectRoute,deleteAccount);

export default router;