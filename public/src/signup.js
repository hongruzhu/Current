$("#signup").on("click", async () => {
  signUp();
})

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
      url: "./signup",
      headers,
      data,
    });
    localStorage.setItem("accessToken", result.data.accessToken);
    localStorage.setItem("userName", result.data.user.name);
    localStorage.setItem("userEmail", result.data.user.email);
    alert("註冊成功！");
    window.location.href = "./";
  } catch (e) {
    if (e.response.data.err) {
      alert(e.response.data.err);
      return;
    }
    alert("Something Wrong!")
    console.log(e);
  }
}

async function signUpValidation(name, email, password, password_confirmed) {
  if (!name) {
    alert("Please enter your name");
    return true;
  }
  if (!email) {
    alert("Please enter your email");
    return true;
  }
  if (!password) {
    alert("Please enter your password");
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
  if (!password_confirmed) {
    alert("Please confirm your password");
    return true;
  }
  if (!validator.isEmail(email)) {
    alert("Please enter correct email format");
    return true;
  }
  if ( password !== password_confirmed) {
    alert("Confirm password unsuccessfully. Please check again.");
    return true;
  }
}