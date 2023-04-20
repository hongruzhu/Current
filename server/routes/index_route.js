import express from "express";
const router = express.Router();

import { wrapAsync } from "../util/util.js";
import { index } from "../controllers/index_controller.js";

router.route("/").get(wrapAsync(index));

export { router as index_route };