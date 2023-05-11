import { redis } from "../util/cache.js";

const reviseRoomUserNumber = (roomId, number) => {
  const count = redis.hincrby("room", roomId, number);
  return count;
};

const deleteRoomId = (roomId) => {
  redis.hdel("room", roomId);
};

const deleteStartTime = (roomId) => {
  redis.hdel("startTime", roomId);
};

const deleteShareScreenStatus = (roomId) => {
  redis.hdel("shareScreenStatus", roomId);
};

const deleteWhiteboardStatus = (roomId) => {
  redis.hdel("whiteboardShareName", roomId);
  redis.hdel("whiteboardSharePeerId", roomId);
};

const checkWhiteboardPeerId = async (roomId) => {
  const peerId = await redis.hget("whiteboardSharePeerId", roomId);
  return peerId;
};

const resetWhiteboardStatus = async (roomId) => {
  redis.hset("whiteboardShareName", roomId, null);
  redis.hset("whiteboardSharePeerId", roomId, null);
};

const getCacheStartTime = async (roomId) => {
  return await redis.hget("startTime", roomId);
}

const getCacheTitle = async (roomId) => {
  return await redis.hget("roomTitle", roomId);
};

export {
  reviseRoomUserNumber,
  deleteRoomId,
  deleteStartTime,
  deleteShareScreenStatus,
  deleteWhiteboardStatus,
  checkWhiteboardPeerId,
  resetWhiteboardStatus,
  getCacheStartTime,
  getCacheTitle
};
