import { redis } from "../util/cache.js";

const setShareWhiteboardUser = async (roomId, name, peerId) => {
  redis.hset("whiteboardShareName", roomId, name);
  redis.hset("whiteboardSharePeerId", roomId, peerId);
}

export { setShareWhiteboardUser };

