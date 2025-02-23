import redis from 'redis';
import { config } from './env.js';

const client = redis.createClient({
    url: config.REDIS_URL
});

client.on('error', (err) => {
    console.error('Redis Error:', err);
});

client.on('connect', () => {
    console.log('Connected to Redis');
});

await client.connect(); // Ensure Redis is connected

const cache = {
    get: async (key) => {
        try {
            const data = await client.get(key);
            return data ? JSON.parse(data) : null;
        } catch (err) {
            console.error('Redis GET Error:', err);
            return null;
        }
    },

    set: async (key, value, expiration = 3600) => {
        try {
            await client.setEx(key, expiration, JSON.stringify(value));
        } catch (err) {
            console.error('Redis SET Error:', err);
        }
    },

    delete: async (key) => {
        try {
            await client.del(key);
        } catch (err) {
            console.error('Redis DEL Error:', err);
        }
    }
};

export default cache;
