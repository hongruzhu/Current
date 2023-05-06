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

// 抓取會議紀錄
try {
  const result = await axios({
    method: "post",
    url: `./getRecord`,
    headers
  });
  const data = result.data.data

  for (let i = 0; i < data.length; i++) {
    const date = new Date(data[i].start_time);
    const year = date.getFullYear(); // 年份
    const month = date.getMonth() + 1; // 月份 (從0開始)
    const day = date.getDate(); // 日期
    const hours = date.getHours(); // 小時
    const minutes = date.getMinutes(); // 分鐘

    const startTime = `${year}/${month.toString().padStart(2, "0")}/${day
      .toString()
      .padStart(2, "0")} ${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    const guests = data[i].guests.join(', ')
    $("#user-record").append(`
      <tr class="bg-white border-b break-words">
        <th scope="row" class="px-6 py-4 font-medium text-gray-900">${data[i].title}</th>
        <td class="px-6 py-4">${startTime}</td>
        <td class="px-6 py-4">${data[i].host}</td>
        <td class="px-6 py-4">${guests}</td>
      </tr>
    `);
  }

} catch (e) {
  if (e.response.data.err) {
    alert(e.response.data.err);
    console.log(e);
  } else {
    alert("Something Wrong!");
    console.log(e);
  }
}

