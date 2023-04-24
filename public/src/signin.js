$("#signin").on("click", async () => {
  signIn()
});

$(document).on("keypress", async (e) => {
  if (e.which === 13) signIn();
});

async function signIn() {
  const email = $("input[name='email']").val();
  const password = $("input[name='password']").val();

  const state = await signInValidation(email, password);
  if (state) return;

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const data = {
    email,
    password,
  };
  try {
    const result = await axios({
      method: "post",
      url: "./signin",
      headers,
      data,
    });
    localStorage.setItem("accessToken", result.data.accessToken);
    localStorage.setItem("userId", result.data.user.id);
    localStorage.setItem("userName", result.data.user.name);
    localStorage.setItem("userEmail", result.data.user.email);
    alert("登入成功！");
    const roomReady = localStorage.getItem("room-ready");
    if (roomReady) {
      localStorage.removeItem("room-ready");
      window.location.href = `./concall?roomId=${roomReady}`;
    } else {
      window.location.href = "./";
    }
  } catch (e) {
    if (e.response.data.err) {
      alert(e.response.data.err);
      console.log(e);
      return;
    }
    alert("Something Wrong!");
    console.log(e);
  }
}

async function signInValidation(email, password) {
  if (!email) {
    alert("Please enter your email");
    return true;
  }
  if (!password) {
    alert("Please enter your password");
    return true;
  }
  if (!validator.isEmail(email)) {
    alert("Please enter correct email format");
    return true;
  }
  if (!validator.isLength(password, { min: 8, max: 12 })) {
    alert("Password length should be between 8 to 12");
    return true;
  }
  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
  ) {
    alert(
      "Password should have at least 1 lowercase, 1 number, and 1 uppercase."
    );
    return true;
  }
}