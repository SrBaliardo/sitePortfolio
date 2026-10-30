(() => {
  document.documentElement.dataset.theme = "original";
  try {
    const theme = localStorage.getItem("jhab-theme");
    if (theme === "brisa") document.documentElement.dataset.theme = theme;
  } catch {}
})();
