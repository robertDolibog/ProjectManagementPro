const ConnectRedis = require("connect-redis").default;
const createSessionRedisClient = require("./redisSessionClient");

async function createRedisStore() {
  const redisClient = await createSessionRedisClient();
  const RedisStore = new ConnectRedis({ client: redisClient });
  return RedisStore;
}

module.exports = createRedisStore;
