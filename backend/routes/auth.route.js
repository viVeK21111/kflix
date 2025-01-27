import express from 'express';
import {signup,logout,signin} from '../controllers/auth.controller.js'

const router = express.Router();

router.post('/signup',signup);
router.post('/signin',signin);
router.post('/logout',logout);

export default router;