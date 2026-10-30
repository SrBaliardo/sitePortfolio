window.PortfolioI18n.ready.then(() => {
  const t = window.PortfolioI18n.t;
  const menu = document.getElementById("navigation");
  const menuButton = document.querySelector(".hamburger");
  const contacts = document.getElementById("about-contacts");
  const contactsButton = document.querySelector(".show-sect");
  const narrowScreen = window.matchMedia("(max-width: 560px)");
  const navigationLinks = [...menu.querySelectorAll("a")];

  function setMenu(open, restoreFocus = false) {
    menu.classList.toggle("active", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", t(open ? "nav.close" : "nav.open"));
    menu.inert = narrowScreen.matches && !open;
    menuButton
      .querySelector("use")
      .setAttribute("href", open ? "#icon-close" : "#icon-menu");
    if (restoreFocus) menuButton.focus();
  }

  menu.dataset.enhanced = "";
  menuButton.hidden = false;
  menuButton.addEventListener("click", () =>
    setMenu(menuButton.getAttribute("aria-expanded") !== "true"),
  );
  narrowScreen.addEventListener("change", () => setMenu(false));
  navigationLinks.forEach((link) =>
    link.addEventListener("click", () => setMenu(false, narrowScreen.matches)),
  );

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) setMenu(false);
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuButton.getAttribute("aria-expanded") === "true"
    )
      setMenu(false, true);
  });

  contacts.hidden = true;
  contactsButton.hidden = false;
  contactsButton.addEventListener("click", () => {
    const expanded = contactsButton.getAttribute("aria-expanded") === "true";
    contacts.hidden = expanded;
    contactsButton.setAttribute("aria-expanded", String(!expanded));
  });

  function updateCurrentSection() {
    const target = window.innerHeight * 0.35;
    const current = navigationLinks.reduce((match, link) => {
      const section = document.querySelector(link.getAttribute("href"));
      return section.getBoundingClientRect().top <= target ? link : match;
    }, null);

    navigationLinks.forEach((link) => {
      if (link === current) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  let scheduled = false;
  window.addEventListener(
    "scroll",
    () => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(() => {
        updateCurrentSection();
        scheduled = false;
      });
    },
    { passive: true },
  );

  setMenu(false);
  document.addEventListener("portfolio:localechange", () =>
    setMenu(menuButton.getAttribute("aria-expanded") === "true"),
  );
  updateCurrentSection();
});
