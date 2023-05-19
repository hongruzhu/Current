import express from "express";
const router = express.Router();
import { wrapAsync } from "../util/util.js";
import { getRecordingPage } from "../controllers/recording_controller.js";

router.route("/recording").get(wrapAsync(getRecordingPage));

export { router as recording_route };
