import { redis } from "../util/cache.js";

const getShareScreenStatusCache = async (roomId) => {
  return await redis.hget("shareScreenStatus", roomId);
};

const setShareScreenStatus = async (roomId, peerScreenId) => {
  redis.hset("shareScreenStatus", roomId, peerScreenId);
};

export { getShareScreenStatusCache, setShareScreenStatus };
