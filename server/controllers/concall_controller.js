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

const getStartTime = async (req, res) => {
  const { roomId } = req.query;
  const startTime = await redis.hget("startTime", roomId);
  res.send(startTime);
};

export { reviseRoomUserNumber, deleteRoomId, getStartTime, deleteStartTime };
