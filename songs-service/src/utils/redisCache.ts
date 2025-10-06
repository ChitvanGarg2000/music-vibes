import redis from 'redis';
import dotenv from 'dotenv';

dotenv.config();

export const redisClient = redis.createClient({
    socket: {
        port: parseInt(process.env.REDIS_PORT as string, 10),
        host: process.env.REDIS_HOST as string,
    },
    username: process.env.REDIS_USERNAME as string,
    password: process.env.REDIS_PASSWORD as string,
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});
