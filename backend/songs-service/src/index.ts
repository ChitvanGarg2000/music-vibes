import express from 'express';
import dotenv from 'dotenv';
import { songsRouter } from './songsRoutes.js';
import { redisClient } from './utils/redisCache.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/v1/songs', songsRouter);

const PORT = process.env.PORT || 6000;

await redisClient.connect();
console.log('Connected to Redis');

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
