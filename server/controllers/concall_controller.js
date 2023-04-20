import { redis } from "../util/cache.js";

const getRoomId = async (req, res) => {
  function generateRandomString(length) {
    let result = "";
    const characters = "abcdefghijklmnopqrstuvwxyz";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  let roomId;
  let checkRoomId;
  let state = true;

  while (state) {
    roomId = generateRandomString(10);
    checkRoomId = await redis.hexists("room", roomId);
    if (checkRoomId === 0) {
      state = false;
    }
  }

  redis.hset("room", roomId, 0);
  res.redirect(`./concall?roomId=${roomId}`);
};

const verifyConfNumber = async (req, res) => {
  const checkRoomId = await redis.hexists("room", req.query.roomId);
  if (checkRoomId === 1) {
    res.render("concall", {
      roomId: req.query.roomId,
    });
    return;
  }
  res.render("wrongNumber");
};

export { getRoomId, verifyConfNumber };