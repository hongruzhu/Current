import dotenv from "dotenv";
dotenv.config();
import {
  getUserAllConf,
  getConfData,
  getConfMembers,
  setUserImage,
} from "../models/profile_model.js";
const { NODE_ENV } = process.env;

const getProfilePage = async (req, res) => {
  res.render("profile");
};

const getRecord = async (req, res) => {
  const userId = req.payload.id;
  const userEmail = req.payload.email;
  const result = await getUserAllConf(userId);
  const userConf = result.filter((item, index, self) => {
    return (
      index === self.findIndex((t) => t.conferences_id === item.conferences_id)
    );
  });
  const data = await Promise.all(
    userConf.map(async (item) => {
      const confId = item.conferences_id;
      const confData = await getConfData(confId);
      const confMembers = await getConfMembers(confId);
      const hostData = confMembers.filter((item) => item.role === "host")[0];
      let host;
      if (hostData.email === userEmail) {
        host = `${hostData.name} (你)`;
      } else {
        host = `${hostData.name} <${hostData.email}>`;
      }
      const guestsData = confMembers.filter((item) => item.role === "guest");
      const guests = guestsData.map((item) => {
        if (item.email) {
          if (item.email === userEmail) return `${item.name} (你)`;
          return `${item.name} <${item.email}>`;
        }
        return `${item.name} (未註冊)`;
      });
      const result = {
        conf_id: confId,
        title: confData.title,
        start_time: confData.start,
        host,
        guests,
      };
      return result;
    })
  );
  res.json({ data });
};

const userImage = async (req, res) => {
  const userId = req.payload.id;

  console.log(req.files.user_image[0]);

  let image;
  if (NODE_ENV === "production") {
    image = req.files.user_image[0].key;
  } else {
    image = req.files.user_image[0].filename;
  }
  // 存進資料庫
  await setUserImage(userId, image);
  res.json({ data: image });
};

export { getProfilePage, getRecord, userImage };
