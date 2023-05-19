import { redis } from "../util/cache.js";

const setShareWhiteboardUser = async (roomId, name, peerId) => {
  redis.hset("whiteboardShareName", roomId, name);
  redis.hset("whiteboardSharePeerId", roomId, peerId);
}

const getShareWhiteboardUser = async (roomId) => {
  const name = await redis.hget("whiteboardShareName", roomId);
  const peerId = await redis.hget("whiteboardSharePeerId", roomId);
  return { name, peerId }
};

export { setShareWhiteboardUser, getShareWhiteboardUser };

