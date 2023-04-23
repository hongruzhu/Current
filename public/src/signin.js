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
    localStorage.setItem("userName", result.data.user.name);
    localStorage.setItem("userEmail", result.data.user.email);
    alert("登入成功！");
    window.location.href = document.referrer;
  } catch (e) {
    alert(e.response.data.err);
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