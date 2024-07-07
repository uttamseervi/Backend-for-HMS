import dotenv from 'dotenv';
import { app } from './app.js';
import connectDB from './db/connectDb.js';

// Load environment variables from .env file
dotenv.config({
    path: './.env'
});

// Connect to the database and then start the server
connectDB()
    .then(() => {
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`App is running at ${PORT}`));
    })
    .catch((err) => {
        console.error('MongoDB connection failed...', err);
    });
