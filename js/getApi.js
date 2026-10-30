(() => {
  const data = window.PortfolioData;
  const list = document.getElementById("project-list");
  const status = document.getElementById("projects-feedback");
  const search = document.getElementById("project-search");
  const language = document.getElementById("project-language");
  const empty = document.getElementById("empty-projects");
  const cacheKey = "jhab-portfolio-projects-v1";
  const cacheLifetime = 30 * 60 * 1000;
  const localProjects = new Map(
    data.projects.map((project) => [project.name, project]),
  );
  let projects = data.projects;
  let sourceMessage = "";
  let searchTimer;

  function safeUrl(value, fallback = null) {
    if (typeof value !== "string" || !value.trim()) return fallback;
    try {
      const url = new URL(value);
      return ["https:", "http:"].includes(url.protocol) &&
        !url.username &&
        !url.password
        ? url.href
        : fallback;
    } catch {
      return fallback;
    }
  }

  function normalizeText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR");
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function icon(name) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    svg.classList.add("icon");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    use.setAttribute("href", "#icon-" + name);
    svg.append(use);
    return svg;
  }

  function projectLink(url, label, accessibleLabel, iconName) {
    const link = element("a", "", label);
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", accessibleLabel);
    link.append(icon(iconName));
    return link;
  }

  function createCard(project, index) {
    const title = project.title || project.name.replace(/[-_]/g, " ");
    const card = element("article", "project-card");
    card.dataset.project = project.name;
    const preview = element("div", "project-preview");
    const placeholder = element("div", "project-placeholder", title);
    placeholder.setAttribute("aria-hidden", "true");

    if (project.preview) {
      const image = element("img", "img-card");
      image.alt = "Interface do projeto " + title;
      image.width = 800;
      image.height = 500;
      image.loading = "lazy";
      image.decoding = "async";
      image.draggable = false;
      image.addEventListener("error", () => image.replaceWith(placeholder), {
        once: true,
      });
      image.src = project.preview;
      preview.append(image);
    } else {
      preview.append(placeholder);
    }

    const content = element("div", "card-content");
    const meta = element("div", "project-meta");
    const languageLabel = element(
      "span",
      "language",
      project.language || "Projeto",
    );
    languageLabel.dataset.language = project.language || "";
    const number = element(
      "span",
      "project-index",
      String(index + 1).padStart(2, "0"),
    );
    number.setAttribute("aria-hidden", "true");
    meta.append(languageLabel, number);
    const links = element("div", "btn-card");
    const homepage = safeUrl(project.homepage);
    if (homepage)
      links.append(
        projectLink(homepage, "Ver projeto ", "Abrir " + title, "external"),
      );
    const repository = safeUrl(
      project.html_url,
      "https://github.com/SrBaliardo/" + encodeURIComponent(project.name),
    );
    links.append(
      projectLink(repository, "Código ", "Ver código de " + title, "code"),
    );
    content.append(
      meta,
      element("h4", "title-project", title),
      element(
        "p",
        "desc-project",
        project.description ||
          "Explore o código, a estrutura e a proposta deste projeto no GitHub.",
      ),
      links,
    );
    card.append(preview, content);
    return card;
  }

  function updateLanguages() {
    const selected = language.value;
    language.replaceChildren(new Option("Todas as linguagens", ""));
    const languages = [
      ...new Set(
        projects
          .filter((project) => !data.featured.includes(project.name))
          .map((project) => project.language)
          .filter(Boolean),
      ),
    ].sort();
    languages.forEach((name) => language.add(new Option(name, name)));
    language.value = languages.includes(selected) ? selected : "";
  }

  function render(resetScroll = true) {
    const query = normalizeText(search.value.trim());
    const filtered = projects.filter((project) => {
      if (data.featured.includes(project.name)) return false;
      if (language.value && project.language !== language.value) return false;
      return normalizeText(
        [
          project.name,
          project.title,
          project.description,
          project.language,
        ].join(" "),
      ).includes(query);
    });
    const focusedLink = list.contains(document.activeElement)
      ? document.activeElement
      : null;
    const focusedProject =
      focusedLink?.closest("[data-project]")?.dataset.project;
    const focusedLabel = focusedLink?.getAttribute("aria-label");
    const previousScroll = list.scrollLeft;
    const fragment = document.createDocumentFragment();
    filtered.forEach((project, index) =>
      fragment.append(createCard(project, index)),
    );
    list.replaceChildren(fragment);
    list.hidden = filtered.length === 0;
    empty.hidden = filtered.length !== 0;
    list.scrollLeft = resetScroll ? 0 : previousScroll;
    status.textContent =
      filtered.length +
      (filtered.length === 1
        ? " projeto encontrado."
        : " projetos para explorar.") +
      (sourceMessage ? " " + sourceMessage : "");

    if (focusedProject && focusedLabel) {
      const replacement = [...list.querySelectorAll("a")].find(
        (link) =>
          link.closest("[data-project]").dataset.project === focusedProject &&
          link.getAttribute("aria-label") === focusedLabel,
      );
      (replacement || list).focus({ preventScroll: true });
    }

    list.dispatchEvent(new CustomEvent("projectsupdated"));
  }

  function cleanRepository(item) {
    if (
      !item ||
      typeof item.name !== "string" ||
      item.fork ||
      item.name.toLowerCase() === "srbaliardo"
    )
      return null;
    const local = localProjects.get(item.name);
    return {
      name: item.name,
      title: local?.title,
      description:
        typeof item.description === "string"
          ? item.description
          : local?.description,
      homepage: safeUrl(item.homepage),
      html_url: safeUrl(
        item.html_url,
        "https://github.com/SrBaliardo/" + encodeURIComponent(item.name),
      ),
      language: typeof item.language === "string" ? item.language : null,
      preview: local?.preview || null,
      updated_at: item.updated_at,
    };
  }

  function useRepositories(items, message = "") {
    const next = items.map(cleanRepository).filter(Boolean);
    if (!next.length) return false;
    const names = new Set();
    projects = next.filter((project) => {
      if (names.has(project.name)) return false;
      names.add(project.name);
      return true;
    });
    sourceMessage = message;
    updateLanguages();
    render(false);
    return true;
  }

  function readCache() {
    try {
      const saved = JSON.parse(localStorage.getItem(cacheKey));
      if (
        !saved ||
        !Array.isArray(saved.projects) ||
        saved.projects.length > 2000 ||
        typeof saved.time !== "number"
      )
        return null;
      return saved;
    } catch {
      return null;
    }
  }

  async function refreshProjects() {
    const cache = readCache();
    if (cache && useRepositories(cache.projects)) {
      if (
        Date.now() - cache.time >= 0 &&
        Date.now() - cache.time < cacheLifetime
      )
        return;
    }

    status.textContent = "Projetos disponíveis. Buscando novidades…";
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);

    try {
      const repositories = [];
      let page = 1;
      while (true) {
        const response = await fetch(
          "https://api.github.com/users/SrBaliardo/repos?per_page=100&sort=updated&page=" +
            page,
          {
            signal: controller.signal,
            headers: { Accept: "application/vnd.github+json" },
          },
        );
        if (!response.ok) throw new Error("GitHub indisponível");
        const items = await response.json();
        if (!Array.isArray(items)) throw new Error("Resposta inválida");
        repositories.push(...items);
        if (!response.headers.get("Link")?.includes('rel="next"')) break;
        page += 1;
        if (page > 20) throw new Error("Limite de páginas excedido");
      }

      if (!useRepositories(repositories))
        throw new Error("Nenhum projeto disponível");

      try {
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ time: Date.now(), projects: repositories }),
        );
      } catch {}
    } catch {
      sourceMessage =
        "Exibindo a seleção salva. Explore também as novidades no GitHub.";
      render(false);
    } finally {
      window.clearTimeout(timeout);
    }
  }

  document.querySelector(".project-filters").hidden = false;
  search.addEventListener("input", () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(render, 150);
  });
  language.addEventListener("change", () => render());
  document.getElementById("clear-filters").addEventListener("click", () => {
    window.clearTimeout(searchTimer);
    search.value = "";
    language.value = "";
    render();
    search.focus();
  });

  updateLanguages();
  refreshProjects();
})();
