import "vite/modulepreload-polyfill";

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
    document.getElementById("main-nav")?.classList.remove("resize");
  } else {
    document.getElementById("main-nav")?.classList.add("resize");
  }
}

document
  .getElementById("main-menu-mobile-button")
  ?.addEventListener("click", function () {
    document.getElementById("main-menu-mobile")?.classList.toggle("hidden");
    document.getElementById("mobile-menu-icon")?.classList.toggle("open");
  });
