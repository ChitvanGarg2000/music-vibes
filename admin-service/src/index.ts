import express from 'express'
import dotenv from 'dotenv'
import { initDB } from './config/initDB.js';
import { adminRouter } from './adminRoutes.js';
import {v2 as cloudinary} from 'cloudinary';
import { redisClient } from './config/redisCache.js';

const app = express();

dotenv.config();

app.use(express.json())
app.use('/api/v1/admin', adminRouter);

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME as string,
    api_key: process.env.CLOUD_KEY as string,
    api_secret: process.env.CLOUD_SECRET as string,
})

const PORT = process.env.PORT || 7000;

await redisClient.connect();
console.log('Connected to Redis');

initDB().then(() => {
    app.listen(PORT, () => {
        console.log('Server running at PORT 7000')
    })
})