const backToHomeBtn = document.getElementById("back-to-home-btn");
const goToPageBtn = document.getElementById("go-to-page-btn");
const changeBackgroundBtn = document.getElementById("change-background-btn");

if (backToHomeBtn) {
  backToHomeBtn.addEventListener("click", function () {
    window.location.href = "index.html";
  });
}

if (goToPageBtn) {
  goToPageBtn.addEventListener("click", function () {
    window.location.href = "page.html";
  });
}

if (changeBackgroundBtn) {
  changeBackgroundBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
  });
}
