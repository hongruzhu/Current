import { redis } from "../util/cache.js";

const index = async (req, res) => {
  res.render("index");
};

export { index };