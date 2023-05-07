import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import multer from "multer";
const { TOKEN_SECRET_KEY } = process.env;


// 驗證JWT
const authenticateJWT = (req, res, next) => {
  if (req.header("Authorization")) {
    const access_token = req.header("Authorization").replace("Bearer ", "");
    jwt.verify(access_token, TOKEN_SECRET_KEY, (err, payload) => {
      if (err) {
        res.status(403).json({ err: `Client Error (Wrong token)` });
        return;
      }
      req.payload = payload;
      next();
    });
  } else {
    res.status(401).json({ err: `Client Error (No token)` });
    return;
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
const upload = multer({ storage: storage }, { limit: { fileSize: 1000000 } });

export { authenticateJWT, wrapAsync, upload };
