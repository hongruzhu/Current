import {
  setConfDb,
  saveConfHostDb,
  saveConfStartDb,
  saveConfGuestsDb,
} from "../models/enter_model.js";
import { getConfId } from "../models/concall_model.js";
import {
  setRoomId,
  checkRoomId,
  saveRoomTitleCache,
  saveRoomStartCache,
} from "../service/enter_cache.js";
import { getTitleCache } from "../service/concall_cache.js";
import { CustomError } from "../util/error.js";

const getRoomId = async (req, res) => {
  let roomId;
  let checkRoomIdStatus;
  let state = true;

  while (state) {
    roomId = generateRoomId(10);
    checkRoomIdStatus = await checkRoomId(roomId);

    if (checkRoomIdStatus === 0) {
      state = false;
    }
  }
  await setRoomId(roomId);
  res.redirect(`/room/create?roomId=${roomId}`);
};

const createRoomPage = async (req, res) => {
  res.render("createRoom", {
    roomId: req.query.roomId,
  });
};

const createRoom = async (req, res) => {
  const roomId = req.query.roomId;
  const title = req.body.title;
  // 儲存會議名稱到redis，方便之後加進來的user抓取
  await saveRoomTitleCache(roomId, title);
  // 存會議資料到database
  const confId = await setConfDb(title, roomId);
  const role = "host";
  const { id, name, email } = req.payload;
  await saveConfHostDb(id, confId, role, name, email);
  res.json({ data: `/concall?roomId=${roomId}&confId=${confId}` });
};

const enterRoom = async (req, res) => {
  let { name, userId, email } = req.body;
  if (!name) throw CustomError.badRequest("請輸入姓名");
  if (userId === "") userId = null;
  if (email === "") email = null;
  const roomId = req.query.roomId;
  // 存參與者進資料庫
  const confId = await getConfId(roomId);
  await saveConfGuestsDb(userId, confId, "guest", name, email);
  res.render("concall", {
    roomId: req.query.roomId,
  });
};

const verifyRoomId = async (req, res) => {
  const { roomId, confId } = req.query;
  const checkRoomIdStatus = await checkRoomId(roomId);
  if (checkRoomIdStatus === 0) return res.render("wrongNumber");
  if (confId) {
    const startTime = Date.now();
    // 存會議開始時間
    await saveRoomStartCache(roomId, startTime);
    await saveConfStartDb(confId, startTime);
    return res.render("concall", { roomId });
  }
  // 抓取會議名稱
  // let title = await getTitle(roomId);
  let title = await getTitleCache(roomId);
  if (title === "") {
    title = "無";
  }
  res.render("enterRoom", { roomId, title });
};

export { getRoomId, createRoomPage, createRoom, verifyRoomId, enterRoom };

function generateRoomId(length) {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
