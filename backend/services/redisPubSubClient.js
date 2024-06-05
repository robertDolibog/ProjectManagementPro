const redis = require("redis");

let pubSubRedisClient;

async function createPubSubRedisClient() {
  if (!pubSubRedisClient) {
    pubSubRedisClient = redis.createClient({
      url: process.env.REDIS_PUBSUB_URL,
    });

    pubSubRedisClient.on("error", function (err) {
      console.error("Redis pub/sub error: ", err);
    });

    pubSubRedisClient.on("connect", function () {
      console.log("Connected to Redis for pub/sub");
    });

    await pubSubRedisClient.connect();
  }

  return pubSubRedisClient;
}

module.exports = createPubSubRedisClient;
