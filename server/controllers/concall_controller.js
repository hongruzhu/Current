import { redis } from "../util/cache.js";

const reviseRoomUserNumber = (roomId, number) => {
  const count = redis.hincrby("room", roomId, number);
  return count;
};

const deleteRoomId = (roomId) => {
  redis.hdel("room", roomId);
}

const deleteStartTime = (roomId) => {
  redis.hdel("startTime", roomId);
}

const deleteShareScreenStatus = (roomId) => {
  redis.hdel("shareScreenStatus", roomId);
};

const deleteWhiteboardStatus = (roomId) => {
  redis.hdel("whiteboardShareName", roomId);
  redis.hdel("whiteboardSharePeerId", roomId);
};

const getStartTime = async (req, res) => {
  const { roomId } = req.query;
  const startTime = await redis.hget("startTime", roomId);
  res.send(startTime);
};

const getRoomTitle = async (req, res) => {
  const { roomId } = req.body;
  let roomTitle = await redis.hget("roomTitle", roomId);
  if (!roomTitle) roomTitle = "無";
  res.send(roomTitle);
}

const checkWhiteboardPeerId = async (roomId) => {
  const peerId = await redis.hget("whiteboardSharePeerId", roomId);
  return peerId;
}

const resetWhiteboardStatus = async (roomId) => {
  redis.hset("whiteboardShareName", roomId, null);
  redis.hset("whiteboardSharePeerId", roomId, null);
}

export {
  reviseRoomUserNumber,
  deleteRoomId,
  getStartTime,
  getRoomTitle,
  deleteStartTime,
  deleteShareScreenStatus,
  deleteWhiteboardStatus,
  checkWhiteboardPeerId,
  resetWhiteboardStatus,
};
