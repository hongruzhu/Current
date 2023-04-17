import { redis } from "../util/cache.js";

const verifyConfNumber = async (req, res) => {  
  const checkRoomNumber = await redis.sismember("room", req.query.roomId);
  if (checkRoomNumber === 1) {
    res.render("concall", {
      roomId: req.query.roomId,
    });
    return;
  }
  res.render("wrongNumber");
}

export { verifyConfNumber };