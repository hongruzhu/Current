import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const { CACHE_HOST, CACHE_PORT, CACHE_USER, CACHE_PASSWORD } = process.env;

let redis;
if (process.env.NODE_ENV === "production") {
  redis = new Redis({
    host: CACHE_HOST,
    port: CACHE_PORT,
    retryStrategy: function (times) {
      // 檢查最大重試次數
      if (times >= 10) {
        // 返回一個錯誤，觸發MaxRetriesPerRequestError
        return new Error(
          "Redis returned too many errors, MaxRetriesPerRequestError"
        );
      }
      // 等待時間遞增，最多等2000ms
      return Math.min(times * 50, 2000);
    },
    username: CACHE_USER,
    password: CACHE_PASSWORD,
    tls: {}
  });
} else {
  redis = new Redis({
    host: CACHE_HOST,
    port: CACHE_PORT,
    retryStrategy: function (times) {
      // 檢查最大重試次數
      if (times >= 10) {
        // 返回一個錯誤，觸發MaxRetriesPerRequestError
        return new Error(
          "Redis returned too many errors, MaxRetriesPerRequestError"
        );
      }
      // 等待時間遞增，最多等2000ms
      return Math.min(times * 50, 2000);
    },
    username: CACHE_USER,
    password: CACHE_PASSWORD
  });
}

redis.on("ready", () => {
  console.info("redis is ready");
});

const redisPub = redis.duplicate();
const redisSub = redis.duplicate();

redisPub.on("ready", () => {
  console.info("redisPub is ready");
});
redisSub.on("ready", () => {
  console.info("redisSub is ready");
});

redisPub.on("error", (err) => {
  console.error(err);
});
redisSub.on("error", (err) => {
  console.error(err);
});


export { redis, redisPub, redisSub };