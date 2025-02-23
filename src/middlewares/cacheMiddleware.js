import redis from 'redis';
import { promisify } from 'util';
import { config } from '../config/env.js';

const client = redis.createClient({ url: config.REDIS_URL });
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

export const cacheMiddleware = async (req, res, next) => {
    const cacheKey = req.originalUrl;
    const cachedData = await getAsync(cacheKey);

    if (cachedData) {
        return res.json(JSON.parse(cachedData));
    }

    res.sendResponse = res.json;
    res.json = async (body) => {
        await setAsync(cacheKey, JSON.stringify(body), 'EX', 3600); // Cache for 1 hour
        res.sendResponse(body);
    };

    next();
};
