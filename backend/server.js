import express from 'express'
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import tvRoutes from "./routes/tv.route.js";
import profileRoutes from "./routes/profile.route.js";
import searchRoutes from './routes/search.route.js'
import chatRoutes from './routes/chat.route.js'
import contactRoutes from './routes/contact.route.js'
import cronroutes from './routes/cron.route.js'
import watchRoutes from './routes/watch.route.js'
import cors from "cors";

import {connectDB} from './config/db.js'
import cookieParser from 'cookie-parser';

dotenv.config();
const PORT = process.env.PORT;
const app = express();

app.use(express.json()); // allow us to parse req.body
app.use(cookieParser());

app.use(cors({ origin: "https://kflix-mocha.vercel.app",credentials:true })); // this allows the frontend url to send requests to the backend

app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/movies',movieRoutes);
app.use('/api/v1/tv',tvRoutes);
app.use('/api/v1/user',profileRoutes);
app.use('/api/v1/search',searchRoutes);
app.use('/api/v1/chat',chatRoutes);
app.use('/api/v1/contact',contactRoutes);
app.use('/cronjob',cronroutes)
app.use('/api/v1/watch',watchRoutes);


//app.listen(PORT,() => {
//    console.log("server started at https://localhost:5000");
//    connectDB();
//});
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

app.listen(PORT || 5000, () => { // server defualt listens on 0.0.0.0 (within the network) and also localhost on port
    console.log(`Server started on port:${PORT}`);
    connectDB();
});

