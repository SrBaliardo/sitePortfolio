(() => {
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const layer = document.createElement("div");
  layer.className = "cursor-splash-layer";
  layer.setAttribute("aria-hidden", "true");
  document.body.append(layer);

  document.addEventListener("click", (event) => {
    if (motion.matches || event.detail === 0 || event.target.closest("dialog"))
      return;

    const fragment = document.createDocumentFragment();
    const dashes = Array.from({ length: 7 }, (_, index) => {
      const dash = document.createElement("span");
      dash.className = "cursor-splash-dash";
      dash.setAttribute("aria-hidden", "true");
      dash.style.left = event.clientX + "px";
      dash.style.top = event.clientY + "px";
      dash.style.setProperty("--dash-angle", index * (360 / 7) + "deg");
      fragment.append(dash);
      return dash;
    });

    layer.append(fragment);
    window.setTimeout(() => dashes.forEach((dash) => dash.remove()), 550);
  });
})();
