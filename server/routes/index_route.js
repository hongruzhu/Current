import express from "express";
const router = express.Router();

import { wrapAsync } from "../util/util.js";
import { index, addConfNumber } from "../controllers/index_controller.js";

router.route("/").get(wrapAsync(index));
router.route("/getConfNumber").get(wrapAsync(addConfNumber));

export { router as index_route };