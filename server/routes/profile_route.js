import express from "express";
const router = express.Router();
import { wrapAsync, authenticateJWT, userImageUpload } from "../util/util.js";
import {
  getProfilePage,
  getRecord,
  userImage,
} from "../controllers/profile_controller.js";

router.route("/profile").get(wrapAsync(getProfilePage));
router.route("/profile/record").post(authenticateJWT, wrapAsync(getRecord));
router
  .route("/profile/image")
  .post(authenticateJWT, userImageUpload, wrapAsync(userImage));

export { router as profile_route };
