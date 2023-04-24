import { redis } from "../util/cache.js";

const reviseRoomUserNumber = (roomId, number) => {
  const count = redis.hincrby("room", roomId, number);
  return count;
};

const deleteRoomId = (roomId) => {
  redis.hdel("room", roomId);
}

export { reviseRoomUserNumber, deleteRoomId };
