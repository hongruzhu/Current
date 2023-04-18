import { redis } from "../util/cache.js";

const verifyConfNumber = async (req, res) => {  
  const checkRoomId = await redis.hexists("room", req.query.roomId);
  console.log("test");
  if (checkRoomId === 1) {
    res.render("concall", {
      roomId: req.query.roomId,
    });
    return;
  }
  res.render("wrongNumber");
}



export { verifyConfNumber };