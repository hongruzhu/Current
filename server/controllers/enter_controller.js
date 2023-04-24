import { redis } from "../util/cache.js";
import { setConCall } from "../models/enter_model.js";

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
  res.redirect(`./createRoom?roomId=${roomId}`);
};

const createRoomPage = async (req,res) => {
  res.render("createRoom", {
    roomId: req.query.roomId,
  });
}

const verifyRoomId = async (req, res) => {
  const checkRoomId = await redis.hexists("room", req.query.roomId);
  if (checkRoomId === 0) {
    res.render("wrongNumber");
    return;
  }
  res.render("enterRoom", {
    roomId: req.query.roomId,
  });
};

const createRoom = async (req, res) => {
  // TODO:存會議資料
  // console.log(req.body, req.payload);
  const roomId = req.query.roomId;
  const title = req.body.title;
  const checkRoomId = await redis.hexists("room", roomId);
  if (checkRoomId === 0) {
    res.render("wrongNumber");
    return;
  }
  res.redirect(`./concall?roomId=${roomId}`);
};

const enterRoom = async (req, res) => {
  const { name } = req.body;
  const roomId = req.query.roomId;
  if (!name) {
    res.status(400).json({ err: "請輸入姓名" });
    return;
  }
  const checkRoomId = await redis.hexists("room", roomId);
  if (checkRoomId === 0) {
    res.render("wrongNumber");
    return;
  }
  
  res.render("concall", {
    roomId: req.query.roomId,
  });
}

export { getRoomId, createRoomPage, createRoom, verifyRoomId, enterRoom };