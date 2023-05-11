import { redis } from "../util/cache.js";

const setRoomId = async (roomId) => {
  redis.hset("room", roomId, 0);
};

const checkRoomId = async (roomId) => {
  return await redis.hexists("room", roomId);
}

const saveRoomTitleCache = async (roomId, title) => {
  redis.hset("roomTitle", roomId, title);
}

const saveRoomStartCache = async (roomId, startTime) => {
  redis.hset("startTime", roomId, startTime);
};

export { setRoomId, checkRoomId, saveRoomTitleCache, saveRoomStartCache };