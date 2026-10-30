(() => {
  const root = document.documentElement;
  const locales = new Set(["pt-BR", "en-US"]);
  const dictionaries = new Map();
  const requests = new Map();
  const fallback = {
    "loading.interface": "Preparando sua experiência…",
    "loading.theme.original": "Entrando no tema Original…",
    "loading.theme.brisa": "Uma brisa está chegando…",
    "loading.language": "Preparando o idioma…",
    "projects.count_one": "{count} projeto público encontrado.",
    "projects.count_other": "{count} projetos públicos para explorar.",
    "projects.allLanguages": "Todas as linguagens",
    "projects.generic": "Projeto",
    "projects.fallback":
      "Explore o código, a estrutura e a proposta deste projeto no GitHub.",
    "projects.saved":
      "Exibindo a seleção salva. Explore também as novidades no GitHub.",
    "projects.fetching": "Buscando novidades no GitHub…",
    "projects.view": "Ver projeto",
    "projects.code": "Código",
    "projects.openLabel": "Abrir {title}",
    "projects.codeLabel": "Ver código de {title}",
    "projects.imageAlt": "Interface do projeto {title}",
    "about.more": "Mais sobre minha trajetória",
    "about.less": "Ver menos",
    "nav.open": "Abrir menu",
    "nav.close": "Fechar menu",
    "carousel.play": "Ativar reprodução automática",
    "carousel.pause": "Pausar reprodução automática",
    "carousel.reduced": "Reprodução automática desativada: movimento reduzido",
    "resume.iframe": "Currículo de John Baliardo em PDF",
    "preferences.error": "Não foi possível mudar o idioma. Tente novamente.",
  };
  let locale = "pt-BR";
  let localeRequest = 0;
  let feedbackTimer;

  function readStorage(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {}
  }

  const translatedAttributes = [
    "aria-label",
    "alt",
    "placeholder",
    "title",
    "content",
  ];
  document.querySelectorAll("[data-i18n], [data-i18n-rich]").forEach((node) => {
    const key = node.dataset.i18n || node.dataset.i18nRich;
    fallback[key] = (node.dataset.i18nRich ? node.innerHTML : node.textContent)
      .replace(/\s+/g, " ")
      .trim();
  });
  translatedAttributes.forEach((attribute) => {
    document
      .querySelectorAll("[data-i18n-" + attribute + "]")
      .forEach((node) => {
        fallback[node.getAttribute("data-i18n-" + attribute)] =
          node.getAttribute(attribute);
      });
  });

  function t(key, parameters = {}) {
    const value =
      dictionaries.get(locale)?.messages?.[key] ??
      dictionaries.get("pt-BR")?.messages?.[key] ??
      fallback[key] ??
      "";
    return String(value).replace(/\{(\w+)\}/g, (match, name) =>
      Object.hasOwn(parameters, name) ? String(parameters[name]) : match,
    );
  }

  function richText(node, value) {
    const fragment = document.createDocumentFragment();
    let container = fragment;
    for (const part of value.split(/(<\/?strong>|<br\s*\/?>)/gi)) {
      if (/^<strong>$/i.test(part)) {
        const strong = document.createElement("strong");
        fragment.append(strong);
        container = strong;
      } else if (/^<\/strong>$/i.test(part)) {
        container = fragment;
      } else if (/^<br\s*\/?>$/i.test(part)) {
        container.append(document.createElement("br"));
      } else {
        container.append(document.createTextNode(part));
      }
    }
    node.replaceChildren(fragment);
  }

  function description(project) {
    if (locale === "pt-BR")
      return (
        project.description ||
        dictionaries.get(locale)?.projects?.[project.name]?.description ||
        t("projects.fallback")
      );
    return (
      dictionaries.get(locale)?.projects?.[project.name]?.description ||
      t("projects.fallback")
    );
  }

  function label(node, value) {
    [...node.childNodes]
      .filter((child) => child.nodeType === Node.TEXT_NODE)
      .forEach((child) => child.remove());
    node.prepend(document.createTextNode(value + " "));
  }

  function translateProjectCards() {
    const local = new Map(
      window.PortfolioData.projects.map((project) => [project.name, project]),
    );
    document.querySelectorAll("[data-project]").forEach((card) => {
      const name = card.dataset.project;
      const project = local.get(name);
      const title = card.querySelector(".title-project").textContent;
      const translated = dictionaries.get(locale)?.projects?.[name];
      const paragraph = card.querySelector(".desc-project");
      if (!Object.hasOwn(paragraph.dataset, "portuguese"))
        paragraph.dataset.portuguese = paragraph.textContent.trim();
      paragraph.textContent = description({
        name,
        description: paragraph.dataset.portuguese,
      });
      card.querySelectorAll(".btn-card a").forEach((link) => {
        const code = link.querySelector('use[href="#icon-code"]');
        label(link, t(code ? "projects.code" : "projects.view"));
        link.setAttribute(
          "aria-label",
          t(code ? "projects.codeLabel" : "projects.openLabel", { title }),
        );
      });
      card
        .querySelector(".img-card")
        ?.setAttribute("alt", t("projects.imageAlt", { title }));
      const category = card.querySelector(".project-category");
      if (category)
        category.textContent = translated?.category || project?.category || "";
      const tags = card.querySelectorAll(".project-tags li");
      tags.forEach((tag, index) => {
        tag.textContent =
          translated?.tags?.[index] ||
          project?.tags?.[index] ||
          tag.textContent;
      });
    });
  }

  function apply() {
    root.lang = locale;
    root.dataset.locale = locale;
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const value = t(node.dataset.i18n);
      node.textContent = value;
    });
    document.querySelectorAll("[data-i18n-rich]").forEach((node) => {
      const value = t(node.dataset.i18nRich);
      if (value) richText(node, value);
    });
    translatedAttributes.forEach((attribute) => {
      document
        .querySelectorAll("[data-i18n-" + attribute + "]")
        .forEach((node) => {
          const value = t(node.getAttribute("data-i18n-" + attribute));
          if (value) node.setAttribute(attribute, value);
        });
    });
    translateProjectCards();
    document.querySelectorAll("[data-locale-option]").forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.localeOption === locale),
      );
    });
    document.querySelector(".resume-note").hidden = locale !== "en-US";
    document.querySelector('meta[property="og:locale"]').content =
      locale.replace("-", "_");
  }

  function validDictionary(data) {
    return (
      data &&
      typeof data.messages === "object" &&
      typeof data.projects === "object" &&
      [
        "meta.title",
        "nav.about",
        "hero.description",
        "projects.count_other",
        "loading.interface",
      ].every((key) => typeof data.messages[key] === "string")
    );
  }

  async function dictionary(next) {
    if (dictionaries.has(next)) return dictionaries.get(next);
    if (requests.has(next)) return requests.get(next);
    const request = (async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6500);
      const cacheKey = "jhab-dictionary-2.0-1-" + next;
      try {
        const response = await fetch(
          "./locales/" + next + ".json?v=2.0-preferences-1",
          {
            signal: controller.signal,
          },
        );
        if (!response.ok) throw new Error("Dictionary unavailable");
        const data = await response.json();
        if (!validDictionary(data)) throw new Error("Invalid dictionary");
        dictionaries.set(next, data);
        writeStorage(cacheKey, JSON.stringify(data));
        return data;
      } catch (error) {
        let saved;
        try {
          saved = JSON.parse(readStorage(cacheKey));
        } catch {}
        if (validDictionary(saved)) {
          dictionaries.set(next, saved);
          return saved;
        }
        throw error;
      } finally {
        clearTimeout(timeout);
        requests.delete(next);
      }
    })();
    requests.set(next, request);
    return request;
  }

  function feedback() {
    const node = document.getElementById("preferences-feedback");
    clearTimeout(feedbackTimer);
    node.textContent = t("preferences.error");
    node.hidden = false;
    feedbackTimer = setTimeout(() => {
      node.hidden = true;
    }, 6500);
  }

  function updateTheme() {
    const brisa = root.dataset.theme === "brisa";
    document
      .getElementById("theme-toggle")
      .setAttribute("aria-checked", String(brisa));
    document.querySelector('meta[name="theme-color"]').content = brisa
      ? "#eef3f5"
      : "#0d1117";
  }

  async function setTheme(next) {
    if (!["original", "brisa"].includes(next) || root.dataset.theme === next)
      return;
    root.dataset.theme = next;
    updateTheme();
    await window.PortfolioLoading.run("loading.theme." + next, async () => {
      writeStorage("jhab-theme", next);
      await Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);
      document.dispatchEvent(
        new CustomEvent("portfolio:themechange", { detail: { theme: next } }),
      );
    });
  }

  async function setLocale(next) {
    if (!locales.has(next)) return;
    const request = ++localeRequest;
    if (next === locale) return;
    await window.PortfolioLoading.run("loading.language", async () => {
      try {
        await dictionary(next);
        if (request !== localeRequest) return;
        locale = next;
        apply();
        writeStorage("jhab-locale", next);
        document.getElementById("preferences-feedback").hidden = true;
        document.dispatchEvent(
          new CustomEvent("portfolio:localechange", { detail: { locale } }),
        );
      } catch {
        if (request === localeRequest) feedback();
      }
    });
  }

  const ready = (async () => {
    const finish = window.PortfolioLoading.begin("loading.interface");
    try {
      const stored = readStorage("jhab-locale");
      const next = locales.has(stored) ? stored : "pt-BR";
      try {
        await dictionary(next);
        locale = next;
      } catch {
        if (next !== "pt-BR") feedback();
      }
      apply();
      updateTheme();
      document.querySelector(".header-preferences").hidden = false;
      document.querySelectorAll("[data-locale-option]").forEach((button) => {
        button.addEventListener("click", () =>
          setLocale(button.dataset.localeOption),
        );
      });
      document.getElementById("theme-toggle").addEventListener("click", () => {
        setTheme(root.dataset.theme === "brisa" ? "original" : "brisa");
      });
    } finally {
      finish();
    }
  })();

  window.PortfolioI18n = Object.freeze({
    t,
    description,
    ready,
    setLocale,
    setTheme,
    get locale() {
      return locale;
    },
  });
})();
