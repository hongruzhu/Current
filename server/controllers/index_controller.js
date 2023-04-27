import { redis } from "../util/cache.js";

const index = async (req, res) => {
  res.render("index");
};

const checkAccessToken = async (req, res) => {
  res.send("Access token check successfully.");
}

export { index, checkAccessToken };