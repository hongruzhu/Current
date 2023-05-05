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
  $("#navbar").append(`
    <div class="px-2 ml-auto">
      <a id="signout" type="button" href="./"
        class="text-orange-700 hover:text-white border border-orange-700 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-orange-500 dark:focus:ring-orange-800">登出</a>
    </div>
    <a class="bg-[url('../images/user.png')] w-[50px] h-[50px] bg-contain" href=""></a>
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
        class="text-orange-700 hover:text-white border border-orange-700 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-orange-500 dark:focus:ring-orange-800">登入</a>
    </div>
    <div class="px-1">
      <a id="signout" type="button" href="./signup"
        class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">註冊</a>
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
  // autoplay: {
  //   delay: 3500,
  //   disableOnInteraction: false,
  // },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});