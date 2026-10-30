window.PortfolioI18n.ready.then(() => {
  const t = window.PortfolioI18n.t;
  const details = document.getElementById("about-details");
  const button = document.getElementById("toggle");
  const label = button.querySelector("span");

  details.hidden = true;
  button.hidden = false;
  button.setAttribute("aria-expanded", "false");
  label.textContent = t("about.more");

  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    details.hidden = expanded;
    button.setAttribute("aria-expanded", String(!expanded));
    label.textContent = t(expanded ? "about.more" : "about.less");
  });
  document.addEventListener("portfolio:localechange", () => {
    label.textContent = t(
      button.getAttribute("aria-expanded") === "true"
        ? "about.less"
        : "about.more",
    );
  });
});
