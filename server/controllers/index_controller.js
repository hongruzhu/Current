const index = async (req, res) => {
  res.render("index");
};

const addConfNumber = async (req, res) => {
  function generateRandomString(length) {
    let result = "";
    const characters = "abcdefghijklmnopqrstuvwxyz";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  const roomId = generateRandomString(10);
  res.redirect(`./concall?roomId=${roomId}`);
};

export { index, addConfNumber };