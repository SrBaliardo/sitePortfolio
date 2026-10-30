(() => {
  const dialog = document.getElementById("resume-dialog");
  const closeButton = document.getElementById("close-resume");
  let trigger;

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
      iframe.title = "Currículo de John Baliardo em PDF";
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
    dialog.querySelector(".resume-pdf")?.remove();
    document.body.classList.remove("modal-open");
    trigger?.focus({ preventScroll: true });
  });
})();
