const redis = require("redis");

let sessionRedisClient;

async function createSessionRedisClient() {
  if (!sessionRedisClient) {
    sessionRedisClient = redis.createClient({
      url: process.env.REDIS_SESSIONS_URL,
      retry_strategy: function (options) {
        if (options.error && options.error.code === "ECONNREFUSED") {
          return new Error("The server refused the connection");
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          return new Error("Retry time exhausted");
        }
        if (options.attempt > 10) {
          return undefined;
        }
        return Math.min(options.attempt * 100, 3000);
      },
    });

    sessionRedisClient.on("error", function (err) {
      console.error("Redis session error: ", err);
    });

    sessionRedisClient.on("connect", function () {
      console.log("Connected to Redis for sessions");
    });

    await sessionRedisClient.connect();
  }

  return sessionRedisClient;
}

module.exports = createSessionRedisClient;
