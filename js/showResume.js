window.PortfolioI18n.ready.then(() => {
  const t = window.PortfolioI18n.t;
  const dialog = document.getElementById("resume-dialog");
  const closeButton = document.getElementById("close-resume");
  let trigger;
  let loadingTimeout;
  const loading = document.querySelector(".resume-loading");

  function finishLoading() {
    clearTimeout(loadingTimeout);
    window.PortfolioLoading.inline(loading, false);
  }

  document.querySelectorAll("[data-resume]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (
        typeof dialog.showModal !== "function" ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      event.preventDefault();
      trigger = link;

      const iframe = document.createElement("iframe");
      iframe.className = "resume-pdf";
      iframe.title = t("resume.iframe");
      window.PortfolioLoading.inline(loading, true);
      iframe.addEventListener("load", finishLoading, { once: true });
      iframe.addEventListener("error", finishLoading, { once: true });
      loadingTimeout = setTimeout(finishLoading, 10000);
      iframe.src = "./resume.pdf";
      dialog.append(iframe);
      dialog.showModal();
      document.body.classList.add("modal-open");
      closeButton.focus();
    });
  });

  closeButton.addEventListener("click", () => dialog.close());

  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      dialog.close();
  });

  dialog.addEventListener("close", () => {
    finishLoading();
    dialog.querySelector(".resume-pdf")?.remove();
    document.body.classList.remove("modal-open");
    trigger?.focus({ preventScroll: true });
  });
  document.addEventListener("portfolio:localechange", () => {
    dialog
      .querySelector(".resume-pdf")
      ?.setAttribute("title", t("resume.iframe"));
  });
});
