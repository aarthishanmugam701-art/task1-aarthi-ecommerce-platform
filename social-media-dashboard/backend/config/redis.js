const redis = require('redis');

let redisClient = null;

const getRedisClient = async () => {
  if (!redisClient) {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    redisClient.on('error', (err) => console.error('Redis Client Error', err));
    await redisClient.connect();
    console.log('Redis Client Connected');
  }
  return redisClient;
};

module.exports = { getRedisClient };
