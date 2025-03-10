import express from 'express';
import { saveContactUs } from '../controllers/contact.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';
const router = express.Router();

router.post('/savemessage',protectRoute,saveContactUs)

export default router;