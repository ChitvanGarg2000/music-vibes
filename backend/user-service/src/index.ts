import express from 'express';
import dotenv from 'dotenv';
import connectDB from './utils/connectDB.js';
import userRouter from './userRoutes.js';

const app = express();

app.use(express.json());

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use('/api/v1/user', userRouter);

app.listen(PORT, () => {
    console.log("Successfully running at Port", 5000);
    connectDB();
});

// Routing

