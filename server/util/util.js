import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import multer from "multer";
import { checkRoomId } from "../service/enter_cache.js";
import { CustomError } from "./error.js";
const { TOKEN_SECRET_KEY } = process.env;

// Check roomId
const checkRoomIdMiddle = async (req, res, next) => {
  const roomId = req.query.roomId;
  const checkRoomIdStatus = await checkRoomId(roomId);
  if (checkRoomIdStatus === 0) return res.render("wrongNumber");
  next();
}

// 驗證JWT
const authenticateJWT = (req, res, next) => {
  if (req.header("Authorization")) {
    const accessToken = req.header("Authorization").replace("Bearer ", "");
    jwt.verify(accessToken, TOKEN_SECRET_KEY, (err, payload) => {
      if (err) throw CustomError.forbidden("Client Error (Wrong token)");
      req.payload = payload;
      return next();
    });
  } else {
    throw CustomError.unauthorized("Client Error (No token)");
  }
};

// reference: https://thecodebarbarian.com/80-20-guide-to-express-error-handling
const wrapAsync = (fn) => {
  return function (req, res, next) {
    // Make sure to `.catch()` any errors and pass them along to the `next()`
    // middleware in the chain, in this case the error handler.
    fn(req, res, next).catch(next);
  };
};

// multer抓取圖片後，儲存路徑及命名規則
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpg");
  },
});
const upload = multer({ storage: storage, limits: { fileSize: 1000000 } });

export { authenticateJWT, checkRoomIdMiddle, wrapAsync, upload };
