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
import roomRoutes from "./routes/room.routes.js"
import departmentRoutes from "./routes/department.routes.js"
import employeeRoutes from "./routes/employee.routes.js"
import adminRoutes from "./routes/admin.routes.js"

// import adminRoutes from "./routes"

// using these routes
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/contact", contactRoutes)
app.use("/api/v1/review", reviewRouter)
app.use("/api/v1/admin", adminRoutes)
app.use("/api/v1/department", departmentRoutes)
app.use("/api/v1/employee", employeeRoutes)

// testing is pending from here 
app.use("/api/v1/rooms", roomRoutes)



export { app }