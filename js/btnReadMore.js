(() => {
  const details = document.getElementById("about-details");
  const button = document.getElementById("toggle");
  const label = button.querySelector("span");

  details.hidden = true;
  button.hidden = false;
  button.setAttribute("aria-expanded", "false");
  label.textContent = "Mais sobre minha trajetória";

  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    details.hidden = expanded;
    button.setAttribute("aria-expanded", String(!expanded));
    label.textContent = expanded ? "Mais sobre minha trajetória" : "Ver menos";
  });
})();
