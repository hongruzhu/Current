localStorage.removeItem("room-ready");

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
  localStorage.clear();
  logInStatus = false;
}

if (logInStatus) {
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");
  const userPicture = localStorage.getItem("userPicture");
  $("#user-profile").removeClass("hidden");
  $("#user-name").text(userName);
  $("#user-email").text(userEmail);

  if (userPicture !== "null") {
    $("#user-avatar-image").attr(
      "src",
      `https://d3u6ahecm1mhmb.cloudfront.net/${userPicture}`
    );
  }

  $("#signout").click(() => {
    localStorage.clear();
  });
} else {
  $("#navbar").append(`    
    <div class="px-1 ml-auto">
      <a id="signin" type="button" href="/signin"
        class="focus:outline-none text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5">登入</a>
    </div>
    <div class="px-1">
      <a id="signout" type="button" href="/signup"
        class="text-orange-700 hover:text-white border border-orange-700 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">註冊</a>
    </div>
  `);
}

$("#get-roomid").click(async () => {
  if (!logInStatus) {
    await Swal.fire({
      icon: "warning",
      text: "請先登入，未有帳號請先註冊！",
    });
    window.location.href = "/signin";
    return;
  }
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  try {
    const result = await axios({
      method: "get",
      url: "/room",
      headers,
    });
    window.location.href = result.request.responseURL;
  } catch (e) {
    console.log(e);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
    });
  }
});

$("#signin").on("click", () => {
  localStorage.removeItem("room-ready");
});

$("#signon").on("click", () => {
  localStorage.removeItem("room-ready");
});

// 控制輪播圖
new Swiper(".mySwiper", {
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
