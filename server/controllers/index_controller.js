import { redis } from "../util/cache.js";

const index = async (req, res) => {
  res.render("index");
};

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

export { index, getRoomId };