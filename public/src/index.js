const accessToken = localStorage.getItem("accessToken");

if (accessToken) {
  $("#navbar").append(`
    <div class="px-2">
      <a id="signout" type="button" href="./"
        class="text-orange-700 hover:text-white border border-orange-700 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-orange-500 dark:focus:ring-orange-800">登出</a>
    </div>
    <a class="bg-[url('../images/user.png')] w-[50px] h-[50px] ml-auto bg-contain" href=""></a>
  `);
  $("#signout").click(() => {
    localStorage.removeItem("accessToken");
  })
} else {
  $("#navbar").append(`    
    <div class="px-1">
      <a type="button" href="./signin"
        class="text-orange-700 hover:text-white border border-orange-700 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-orange-500 dark:focus:ring-orange-800">登入</a>
    </div>
    <div class="px-1">
      <a type="button" href="./signup"
        class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">註冊</a>
    </div>
  `);
}

$("#get-roomid").click(() => {
  if (!accessToken) {
    alert("請先登入，未有帳號請先註冊！")
    window.location.href= "./signin";
    return;
  }
  window.location.href = "./getRoomId";
})
