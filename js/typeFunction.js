window.PortfolioI18n.ready.then(() => {
  const text = document.querySelector(".function");
  const cursor = document.querySelector(".typing-cursor");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const words = ["Front End", "Web"];
  let wordIndex = 0;
  let deleting = true;
  let timer;

  function tick() {
    if (motion.matches || document.hidden) return;
    const word = words[wordIndex];
    const length = text.textContent.length + (deleting ? -1 : 1);
    text.textContent = word.slice(0, Math.max(0, length));

    if (deleting && length <= 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      timer = window.setTimeout(tick, 250);
    } else if (!deleting && text.textContent === word) {
      deleting = true;
      timer = window.setTimeout(tick, 2400);
    } else {
      timer = window.setTimeout(tick, deleting ? 65 : 110);
    }
  }

  function synchronize() {
    window.clearTimeout(timer);
    cursor.hidden = motion.matches;
    if (motion.matches) {
      text.textContent = words[0];
      wordIndex = 0;
      deleting = true;
    } else if (!document.hidden) {
      timer = window.setTimeout(tick, 1800);
    }
  }

  motion.addEventListener("change", synchronize);
  document.addEventListener("visibilitychange", synchronize);
  synchronize();
});
