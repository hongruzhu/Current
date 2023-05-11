$("#signup").on("click", async () => {
  signUp();
});

$(document).on("keypress", async (e) => {
  if (e.which === 13) signUp();
});

async function signUp() {
  const name = $("input[name='name']").val();
  const email = $("input[name='email']").val();
  const password = $("input[name='password']").val();
  const password_confirmed = $("input[name='password_confirmed']").val();

  const state = await signUpValidation(
    name,
    email,
    password,
    password_confirmed
  );
  if (state) return;

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const data = {
    name,
    email,
    password,
    password_confirmed,
  };
  try {
    const result = await axios({
      method: "post",
      url: "/signup",
      headers,
      data,
    });
    localStorage.setItem("accessToken", result.data.data.accessToken);
    localStorage.setItem("userId", result.data.data.user.id);
    localStorage.setItem("userName", result.data.data.user.name);
    localStorage.setItem("userEmail", result.data.data.user.email);
    localStorage.setItem("userPicture", result.data.data.user.picture);
    await Swal.fire({
      icon: "success",
      text: "註冊成功！",
    });
    const roomReady = localStorage.getItem("room-ready");
    if (roomReady) {
      localStorage.removeItem("room-ready");
      window.location.href = `/concall?roomId=${roomReady}`;
    } else {
      window.location.href = "/";
    }
  } catch (e) {
    console.log(e);
    if (e.response.data.err) {
      await Swal.fire({
        icon: "warning",
        text: e.response.data.err,
      });
      return;
    }
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
    });
  }
}

async function signUpValidation(name, email, password, password_confirmed) {
  if (!name) {
    await Swal.fire({
      icon: "warning",
      text: "請輸入您的姓名",
    });
    return true;
  }
  if (!email) {
    await Swal.fire({
      icon: "warning",
      text: "請輸入您的 email",
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
  if (!password) {
    await Swal.fire({
      icon: "warning",
      text: "請輸入密碼",
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
  if (!password_confirmed) {
    await Swal.fire({
      icon: "warning",
      text: "請確認您的密碼",
    });
    return true;
  }
  if (password !== password_confirmed) {
    await Swal.fire({
      icon: "warning",
      text: "確認密碼失敗，請重新確認密碼",
    });
    return true;
  }
}
