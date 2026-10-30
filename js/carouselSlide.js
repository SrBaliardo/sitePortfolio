window.PortfolioI18n.ready.then(() => {
  const t = window.PortfolioI18n.t;
  const carousel = document.getElementById("project-list");
  const controls = document.querySelector(".carousel-controls");
  const previous = document.getElementById("left");
  const next = document.getElementById("right");
  const play = document.getElementById("autoplay");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let automatic = false;
  let visible = false;
  let hovered = false;
  let timer;
  let drag;
  let suppressClick = false;

  function step(direction) {
    const cards = carousel.querySelectorAll(".project-card");
    if (cards.length < 2) return;
    const distance = cards[1].offsetLeft - cards[0].offsetLeft;
    const maximum = carousel.scrollWidth - carousel.clientWidth;
    const current = carousel.scrollLeft;
    const target =
      direction > 0
        ? current >= maximum - 3
          ? 0
          : Math.min(maximum, current + distance)
        : current <= 3
          ? maximum
          : Math.max(0, current - distance);
    carousel.scrollTo({
      left: target,
      behavior: motion.matches ? "instant" : "smooth",
    });
  }

  function synchronize() {
    window.clearInterval(timer);
    play.disabled = motion.matches;
    play.setAttribute("aria-pressed", String(automatic));
    play.setAttribute(
      "aria-label",
      motion.matches
        ? t("carousel.reduced")
        : automatic
          ? t("carousel.pause")
          : t("carousel.play"),
    );
    play
      .querySelector("use")
      .setAttribute("href", automatic ? "#icon-pause" : "#icon-play");
    if (
      automatic &&
      visible &&
      !hovered &&
      !document.hidden &&
      !motion.matches &&
      !carousel.contains(document.activeElement) &&
      !drag
    ) {
      timer = window.setInterval(() => step(1), 5000);
    }
  }

  function stopAutomatic() {
    automatic = false;
    synchronize();
  }

  function updateControls() {
    const scrollable =
      !carousel.hidden && carousel.scrollWidth > carousel.clientWidth + 3;
    previous.disabled = !scrollable;
    next.disabled = !scrollable;
    play.hidden = !scrollable;
    stopAutomatic();
  }

  controls.hidden = false;
  previous.addEventListener("click", () => {
    stopAutomatic();
    step(-1);
  });
  next.addEventListener("click", () => {
    stopAutomatic();
    step(1);
  });
  play.addEventListener("click", () => {
    automatic = !automatic;
    synchronize();
  });

  carousel.addEventListener("keydown", (event) => {
    if (
      event.target !== carousel ||
      !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
    )
      return;
    event.preventDefault();
    stopAutomatic();
    if (event.key === "Home")
      carousel.scrollTo({
        left: 0,
        behavior: motion.matches ? "instant" : "smooth",
      });
    else if (event.key === "End")
      carousel.scrollTo({
        left: carousel.scrollWidth,
        behavior: motion.matches ? "instant" : "smooth",
      });
    else step(event.key === "ArrowRight" ? 1 : -1);
  });

  carousel.addEventListener("pointerdown", (event) => {
    if (
      event.pointerType !== "mouse" ||
      event.button !== 0 ||
      event.target.closest("a, button")
    )
      return;
    stopAutomatic();
    suppressClick = false;
    drag = {
      id: event.pointerId,
      start: event.clientX,
      scroll: carousel.scrollLeft,
    };
    carousel.setPointerCapture(event.pointerId);
  });

  carousel.addEventListener("pointermove", (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    const distance = event.clientX - drag.start;
    if (Math.abs(distance) < 6 && !suppressClick) return;
    suppressClick = true;
    carousel.classList.add("dragging");
    carousel.scrollLeft = drag.scroll - distance;
  });

  function finishDrag() {
    if (!drag) return;
    drag = null;
    carousel.classList.remove("dragging");
    synchronize();
  }

  carousel.addEventListener("pointerup", finishDrag);
  carousel.addEventListener("pointercancel", finishDrag);
  carousel.addEventListener("lostpointercapture", finishDrag);
  carousel.addEventListener(
    "click",
    (event) => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    },
    true,
  );

  carousel.addEventListener("mouseenter", () => {
    hovered = true;
    synchronize();
  });
  carousel.addEventListener("mouseleave", () => {
    hovered = false;
    synchronize();
  });
  carousel.addEventListener("focusin", synchronize);
  carousel.addEventListener("focusout", () =>
    window.setTimeout(synchronize, 0),
  );
  carousel.addEventListener("projectsupdated", updateControls);
  document.addEventListener("visibilitychange", synchronize);
  motion.addEventListener("change", stopAutomatic);
  document.addEventListener("portfolio:localechange", synchronize);
  document.addEventListener("portfolio:themechange", stopAutomatic);

  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      synchronize();
    },
    { threshold: 0.2 },
  );
  observer.observe(carousel);
  new ResizeObserver(updateControls).observe(carousel);
  updateControls();
});
