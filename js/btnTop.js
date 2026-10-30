(() => {
  const button = document.querySelector(".btn-top");
  const year = document.getElementById("copyright-year");
  let scheduled = false;

  function update() {
    button.hidden = window.scrollY < 500;
    scheduled = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(update);
    },
    { passive: true },
  );

  year.textContent = new Date().getFullYear();
  update();
})();
