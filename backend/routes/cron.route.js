import express from 'express';
import { cronjob } from '../controllers/cron.controller.js';
const router = express.Router();

router.get('/run',cronjob)

export default router;