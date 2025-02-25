import express from 'express'
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import tvRoutes from "./routes/tv.route.js";
import profileRoutes from "./routes/profile.route.js";
import searchRoutes from './routes/search.route.js'
import chatRoutes from './routes/chat.route.js'
import cors from "cors";

import {connectDB} from './config/db.js'
import cookieParser from 'cookie-parser';

dotenv.config();
const PORT = process.env.PORT;
const app = express();

//app.use(cors({ origin: "https://kflix-zeta.vercel.app/",credentails:true })); // this allows the frontend url to send requests to the backend
//app.use(cors({ origin: "http://192.168.1.9:5173",credentails:true })); 

app.use(express.json()); // allow us to parse req.body
app.use(cookieParser());

app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/movies',movieRoutes);
app.use('/api/v1/tv',tvRoutes);
app.use('/api/v1/user',profileRoutes);
app.use('/api/v1/search',searchRoutes);
app.use('/api/v1/chat',chatRoutes);

//app.listen(PORT,() => {
//    console.log("server started at https://localhost:5000");
//    connectDB();
//});

app.listen(PORT, () => { // server defualt listens on 0.0.0.0 (within the network)
    console.log(`Server started at local ipv4 :${PORT}`);
    connectDB();
});

