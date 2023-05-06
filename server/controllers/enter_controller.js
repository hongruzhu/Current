import { redis } from "../util/cache.js";
import {
  setConf,
  setConfHost,
  setConfStart,
  getTitle,
  setConfGuests
} from "../models/enter_model.js";
import { getConfId } from "../models/concall_model.js";

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

const createRoomPage = async (req, res) => {
  res.render("createRoom", {
    roomId: req.query.roomId,
  });
};

const createRoom = async (req, res) => {
  const roomId = req.query.roomId;
  const title = req.body.title;
  const checkRoomId = await redis.hexists("room", roomId);
  if (checkRoomId === 0) {
    res.render("wrongNumber");
    return;
  }
  // 儲存會議名稱到redis，方便之後加進來的user抓取
  redis.hset("roomTitle", roomId, title);
  // 存會議資料到database
  const confId = await setConf(title, roomId);
  const role = "host";
  const user_id = req.payload.id;
  const name = req.payload.name;
  const email = req.payload.email;
  await setConfHost(user_id, confId, role, name, email);
  res.send(`./concall?roomId=${roomId}&confId=${confId}`);
};

const enterRoom = async (req, res) => {
  let { name, userId, email } = req.body;
  if (userId === "") userId = null;
  if (email === "") email = null;
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
  // 存參與者進資料庫
  const confId = await getConfId(roomId);
  await setConfGuests(userId, confId, "guest", name, email);
  res.render("concall", {
    roomId: req.query.roomId,
  });
};

const verifyRoomId = async (req, res) => {
  const { roomId, confId } = req.query;
  const checkRoomId = await redis.hexists("room", roomId);
  if (checkRoomId === 0) {
    res.render("wrongNumber");
    return;
  }
  if (confId) {
    const startTime = Date.now();
    redis.hset("startTime", roomId, startTime);
    // 存會議開始時間
    await setConfStart(confId, startTime);
    res.render("concall", { roomId });
    return;
  }
  // 抓取會議名稱
  const title = await getTitle(roomId);
  res.render("enterRoom", { roomId, title });
};

export { getRoomId, createRoomPage, createRoom, verifyRoomId, enterRoom };
