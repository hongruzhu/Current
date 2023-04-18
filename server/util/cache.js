import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const { CACHE_HOST, CACHE_PORT, CACHE_USER, CACHE_PASSWORD } = process.env;

const redis = new Redis({
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

export { redis };