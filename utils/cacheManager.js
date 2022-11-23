const redis = require('redis');
const redisClient = redis.createClient(); //'http://localhost:6379'

// cache data set and get function
async function cacheSetAndGet(key, callback) {
  const data = await redisClient.get(key);
  if (data) {
    console.log('cache found');
    return JSON.parse(data);
  } else {
    console.log('cache not found');
    const data = await callback();
    redisClient.setEx(key, 3600, JSON.stringify(data));
    return data;
  }
}

//  update cache data
function updateCacheData(key, value) {
  try {
    redisClient.setEx(key, 3600, JSON.stringify(value));
    console.log('cache set');
  } catch (error) {
    console.log(error);
  }
}

module.exports = { redisClient, cacheSetAndGet, updateCacheData };
