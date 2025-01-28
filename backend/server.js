import express from 'express'
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js";
import {connectDB} from './config/db.js'

dotenv.config();
const PORT = process.env.PORT;
const app = express();
app.use(express.json()); // allow us to parse req.body
app.use('/api/v1/auth',authRoutes);
app.listen(PORT,() => {
    console.log("server started at https://localhost:5000");
    connectDB();
});
