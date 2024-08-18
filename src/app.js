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


import userRoutes from "../api/routes/user.routes.js"
import reviewRouter from "../api/routes/review.routes.js"
import contactRoutes from "../api/routes/contact.routes.js"
import roomRoutes from "../api/routes/room.routes.js"
import departmentRoutes from "../api/routes/department.routes.js"
import employeeRoutes from "../api/routes/employee.routes.js"
import adminRoutes from "../api/routes/admin.routes.js"
import paymentRoutes from "../api/routes/payment.routes.js"




app.use("/api/v1/users", userRoutes)
app.use("/api/v1/contact", contactRoutes)
app.use("/api/v1/review", reviewRouter)
app.use("/api/v1/admin", adminRoutes)
app.use("/api/v1/department", departmentRoutes)
app.use("/api/v1/employee", employeeRoutes)
app.use("/api/v1/payment", paymentRoutes)
app.use("/api/v1/rooms", roomRoutes)



export { app }