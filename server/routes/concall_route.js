import express from "express";
const router = express.Router();

import { wrapAsync } from "../util/util.js";
import { verifyConfNumber } from "../controllers/concall_controller.js";

router.route("/concall").get(wrapAsync(verifyConfNumber));

export { router as concall_route };
