import { redis } from "../util/cache.js";

const index = async (req, res) => {
  res.render("index");
};

const thankyou = async (req, res) => {
  res.render("thankyou");
}

const checkAccessToken = async (req, res) => {
  res.send("Access token check successfully.");
}

export { index, thankyou, checkAccessToken };