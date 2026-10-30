(() => {
  const overlay = document.getElementById("app-loader");
  const content = document.getElementById("site-content");
  const message = document.getElementById("loading-message");
  const pending = new Set();
  let started = 0;
  let previousFocus;
  let hideTimer;

  function text(key) {
    return window.PortfolioI18n?.t(key) || message.textContent;
  }

  function begin(key = "loading.interface") {
    const token = Symbol(key);
    window.clearTimeout(hideTimer);
    if (overlay.hidden) {
      started = performance.now();
      previousFocus = document.activeElement;
    }
    pending.add(token);
    message.dataset.i18n = key;
    message.textContent = text(key);
    overlay.hidden = false;
    content.inert = true;
    content.setAttribute("aria-busy", "true");
    document.querySelector(".skip-link").inert = true;
    document.body.classList.add("is-loading");
    let finished = false;

    return () => {
      if (finished) return;
      finished = true;
      pending.delete(token);
      if (pending.size) return;
      const minimum = matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : 320;
      hideTimer = window.setTimeout(
        () => {
          if (pending.size) return;
          overlay.hidden = true;
          content.inert = false;
          content.removeAttribute("aria-busy");
          document.querySelector(".skip-link").inert = false;
          document.body.classList.remove("is-loading");
          if (
            previousFocus instanceof HTMLElement &&
            previousFocus.isConnected &&
            previousFocus !== document.body
          ) {
            previousFocus.focus({ preventScroll: true });
          }
        },
        Math.max(0, minimum - (performance.now() - started)),
      );
    };
  }

  async function run(key, task) {
    const finish = begin(key);
    try {
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );
      return await task();
    } finally {
      finish();
    }
  }

  function inline(element, active) {
    if (element) element.hidden = !active;
  }

  function watchImage(image) {
    const preview = image.closest(".project-preview");
    if (!preview || (image.complete && image.naturalWidth)) return;
    preview.classList.add("image-loading");
    const finish = () => preview.classList.remove("image-loading");
    image.addEventListener("load", finish, { once: true });
    image.addEventListener("error", finish, { once: true });
    if (image.complete) finish();
  }

  window.PortfolioLoading = Object.freeze({ begin, run, inline, watchImage });
  document.querySelectorAll(".img-card").forEach(watchImage);
})();
