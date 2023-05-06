const accessToken = localStorage.getItem("accessToken");
const headers = {
  Authorization: `Bearer ${accessToken}`,
};

let logInStatus;
try {
  const result = await axios({
    method: "get",
    url: "./checkAccessToken",
    headers,
  });
  console.log(result.data);
  logInStatus = true;
} catch(e) {
  console.log(e.response.data);
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  logInStatus = false;
}


if (logInStatus) {
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");
  $("#navbar").append(`
    <div id="user-profile" class="flex justify-center items-center gap-4 px-2 ml-auto">
      <div class="font-medium text-balck text-right">
        <div class="text-base text-black">${userName}</div>
        <div class="text-base text-gray-500">歡迎使用 Current</div>
      </div>
      <button class="avatar" type="button" data-dropdown-toggle="userDropdown" data-dropdown-placement="bottom-end">
        <div class="w-[45px] h-[45px] rounded-full ring ring-primary ring-yellow-600 ring-offset-base-100 ring-offset-2">
          <img src="../images/user.png" />
        </div>
      </button>
    </div>
    <!-- Dropdown menu -->
    <div id="userDropdown"
      class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-52">
      <div class="px-4 py-3 text-base text-gray-900">
        <div>您的 Email</div>
        <div class="font-medium truncate">${userEmail}</div>
      </div>
      <ul class="py-2 text-base text-gray-700" aria-labelledby="avatarButton">
        <li>
          <a href="/" class="block px-4 py-2 hover:bg-gray-100">個人資訊</a>
        </li>
        <li>
          <a id="signout" href="/" class="block px-4 py-2 hover:bg-gray-100">登出</a>
        </li>
      </ul>
    </div>
  `);
  $("#signout").click(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
  });
} else {
  $("#navbar").append(`    
    <div class="px-1 ml-auto">
      <a id="signin" type="button" href="./signin"
        class="focus:outline-none text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5">登入</a>
    </div>
    <div class="px-1">
      <a id="signout" type="button" href="./signup"
        class="text-orange-700 hover:text-white border border-orange-700 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">註冊</a>
    </div>
  `);
}

$("#get-roomid").click(async () => {
  if (!logInStatus) {
    alert("請先登入，未有帳號請先註冊！");
    window.location.href = "./signin";
    return;
  }
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  try {
    const result = await axios({
      method: "get",
      url: "./getRoomId",
      headers,
    });
    window.location.href = result.request.responseURL;
  } catch (e) {
    alert("something worong")
    console.log(e);
  }
});

$("#signin").on("click", () => {
  localStorage.removeItem("room-ready");
});

$("#signon").on("click", () => {
  localStorage.removeItem("room-ready");
});

// 控制輪播圖
let swiper = new Swiper(".mySwiper", {
  spaceBetween: 30,
  centeredSlides: true,
  autoplay: {
    delay: 3500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});