const btnToTop = document.querySelector(".btn-top");

function toTop(event) {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.addEventListener("scroll", () => {
  if (window.scrollY < 300) {
    btnToTop.style.display = "none";
  } else {
    btnToTop.style.display = "block";
  }
});

btnToTop.addEventListener("click", toTop);
btnToTop.addEventListener("touchstart", toTop);
