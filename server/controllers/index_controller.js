import { redis } from "../util/cache.js";

const index = async (req, res) => {
  res.render("index");
};

const addConfNumber = async (req, res) => {
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
  let checkRoomNumber;
  let state = true;

  while (state) {
    roomId = generateRandomString(10);
    checkRoomNumber = await redis.sismember("room", roomId);
    if (checkRoomNumber === 0) {
      state = false;
    }
  }

  redis.sadd("room", roomId);
  res.redirect(`./concall?roomId=${roomId}`);
};

export { index, addConfNumber };