import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

// importing the routes
import userRoutes from "./routes/user.routes.js"
import reviewRouter from "./routes/review.routes.js"
import contactRoutes from "./routes/contact.routes.js"

app.use("/api/v1/users", userRoutes)
app.use("/api/v1/contact", contactRoutes)
app.use("/api/v1/review", reviewRouter)



export { app }