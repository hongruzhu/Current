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
    await Swal.fire({
      icon: "success",
      text: "登入成功！",
    });
    const roomReady = localStorage.getItem("room-ready");
    if (roomReady) {
      localStorage.removeItem("room-ready");
      window.location.href = `./concall?roomId=${roomReady}`;
    } else {
      window.location.href = "./";
    }
  } catch (e) {
    if (e.response.data.err) {
      await Swal.fire({
        icon: "warning",
        text: e.response.data.err,
      });
      console.log(e);
      return;
    }
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
    });
    console.log(e);
  }
}

async function signInValidation(email, password) {
  if (!email) {
    await Swal.fire({
      icon: "warning",
      text: "請輸入您的 email",
    });
    return true;
  }
  if (!password) {
    await Swal.fire({
      icon: "warning",
      text: "請輸入密碼",
    });
    return true;
  }
  if (!validator.isEmail(email)) {
    await Swal.fire({
      icon: "warning",
      text: "請輸入正確的 email格式",
    });
    return true;
  }
  if (!validator.isLength(password, { min: 8, max: 12 })) {
    await Swal.fire({
      icon: "warning",
      text: "密碼長度需在8-12碼之間",
    });
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
    await Swal.fire({
      icon: "warning",
      text: "密碼至少需要大小寫字母及數字各1位",
    });
    return true;
  }
}