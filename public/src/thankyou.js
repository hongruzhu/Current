const accessToken = localStorage.getItem("accessToken");
const headers = {
  Authorization: `Bearer ${accessToken}`,
};

let logInStatus;
try {
  await axios({
    method: "get",
    url: "/token",
    headers,
  });
  logInStatus = true;
} catch (e) {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  logInStatus = false;
}

if (logInStatus) {
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");
  const userPicture = localStorage.getItem("userPicture");

  if (userPicture !== "null") {
    $("#user-avatar-image").attr(
      "src",
      `https://d3u6ahecm1mhmb.cloudfront.net/uploads/${userPicture}`
    );
  }

  $("#user-profile").removeClass("hidden");
  $("#user-name").text(userName);
  $("#user-email").text(userEmail);
} else {
  $("#navbar").append(`    
    <div class="px-1 ml-auto">
      <button id="signin" type="button"
        class="focus:outline-none text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5">登入</a>
    </div>
    <div class="px-1">
      <button id="signup" type="button"
        class="text-orange-700 hover:text-white border border-orange-700 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">註冊</button>
    </div>
  `);
}
