import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import { checkRoomId } from "../service/enter_cache.js";
import { CustomError } from "./error.js";
const {
  TOKEN_SECRET_KEY,
  S3_BUCKET_NAME,
  S3_BUCKET_REGION,
  S3_ACCESS_KEY,
  S3_SECRET_KEY,
} = process.env;

const generateRoomId = (length) => {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// Check roomId
const checkRoomIdMiddle = async (req, res, next) => {
  const roomId = req.query.roomId;
  const checkRoomIdStatus = await checkRoomId(roomId);
  if (checkRoomIdStatus === 0) return res.render("wrongNumber");
  next();
};

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

// multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpg");
  },
});
const fileFilter = (req, file, cb) => {
  const fileSize = parseInt(req.headers["content-length"]);
  if (fileSize > 1000000) {
    return cb(CustomError.badRequest("檔案請小於1 MB"));
  }
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return cb(CustomError.badRequest("請上傳jpg或png圖片檔"));
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter });

// multerS3
const s3 = new S3Client({
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY,
  },
  region: S3_BUCKET_REGION,
});

const multerS3Config = multerS3({
  s3,
  bucket: S3_BUCKET_NAME,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split(".").pop();
    const filename = `${file.fieldname}-${uniqueSuffix}.${ext}`;
    cb(null, filename);
  },
});

const uploadS3 = multer({
  storage: multerS3Config,
  fileFilter,
});

let userImageUpload;
if (process.env.NODE_ENV === "production") {
  userImageUpload = uploadS3.fields([{ name: "user_image", maxCount: 1 }]);
} else {
  userImageUpload = upload.fields([{ name: "user_image", maxCount: 1 }]);
}

export {
  generateRoomId,
  authenticateJWT,
  checkRoomIdMiddle,
  wrapAsync,
  userImageUpload
};
