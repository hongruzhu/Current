const accessToken = localStorage.getItem("accessToken");
const headers = {
  Authorization: `Bearer ${accessToken}`,
};

try {
  const result = await axios({
    method: "get",
    url: "./checkAccessToken",
    headers,
  });
  console.log(result.data);
} catch (e) {
  console.log(e.response.data);
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  alert("請先登入");
  window.location.href = "./";
}

const userName = localStorage.getItem("userName");
const userEmail = localStorage.getItem("userEmail");
$("#user-profile").removeClass("hidden");
$("#user-name").text(userName);
$("#user-email").text(userEmail);
$("#user-profile-name").text(userName);
$("#user-profile-email").text(userEmail);

const urlParams = new URLSearchParams(window.location.search);
const profileStatus = urlParams.get("page");

if (profileStatus === "profile") {
  $("#user-content-profile").removeClass("hidden");
  $("#user-content-record").addClass("hidden");
}
if (profileStatus === "record") {
  $("#user-content-record").removeClass("hidden");
  $("#user-content-profile").addClass("hidden");
}

$("#user-profile-btn").click(() => {
  $("#user-content-profile").removeClass("hidden");
  $("#user-content-record").addClass("hidden");
})

$("#user-record-btn").click(() => {
  $("#user-content-record").removeClass("hidden");
  $("#user-content-profile").addClass("hidden");
});

$("#signout").click(() => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
});

