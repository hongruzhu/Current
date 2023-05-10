const index = async (req, res) => {
  res.render("index");
};

const thankyou = async (req, res) => {
  res.render("thankyou");
};

const checkAccessToken = async (req, res) => {
  // FIXME:API的格式要一致，我都亂寫一通
  res.send("Access token check successfully.");
}

export { index, thankyou, checkAccessToken };