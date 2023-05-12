import express from "express";
const router = express.Router();
import { wrapAsync, authenticateJWT, upload } from "../util/util.js";
import {
  getProfilePage,
  getRecord,
  userImage,
} from "../controllers/profile_controller.js";

const userImageUpload = upload.fields([{ name: "user_image", maxCount: 1 }]);

router.route("/profile").get(wrapAsync(getProfilePage));
router.route("/profile/record").post(authenticateJWT, wrapAsync(getRecord));
router
  .route("/profile/image")
  .post(authenticateJWT, userImageUpload, wrapAsync(userImage));

export { router as profile_route };
