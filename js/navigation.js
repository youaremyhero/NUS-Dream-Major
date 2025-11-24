export function syncHeaderOffsetVariable() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const root = document.documentElement;
  const updateHeight = () => {
    const nextHeight = header.getBoundingClientRect().height || 0;
    root.style.setProperty("--header-h", `${nextHeight}px`);
  };

  updateHeight();

  const resizeObserver = new ResizeObserver(updateHeight);
  resizeObserver.observe(header);
  window.addEventListener("resize", updateHeight, { passive: true });
}

export function setupNavigationInteractions() {
  const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  const navSelect = document.querySelector('.site-nav-select select');
  if (!navLinks.length && !navSelect) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scrollBehavior = prefersReducedMotion ? "auto" : "smooth";

  const scrollSectionIntoView = (section) => {
    if (!section) return;

    const anchor =
      section.querySelector(".landing-section__inner") ||
      section.querySelector(".landing-quiz-card") ||
      section;

    const rect = anchor.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    const header = document.querySelector(".site-header");
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const anchorHeight = Math.min(rect.height, viewportHeight * 0.85);
    const centerOffset = Math.max((viewportHeight - anchorHeight) / 2, 0);
    const rawTop = rect.top + window.scrollY - centerOffset - headerHeight / 2;
    const maxScroll = Math.max(document.documentElement.scrollHeight - viewportHeight, 0);
    const targetTop = Math.min(Math.max(rawTop, 0), maxScroll);

    window.scrollTo({ top: targetTop, behavior: scrollBehavior });
  };

  const sectionMap = navLinks
    .map(link => {
      const targetId = link.getAttribute("href");
      if (!targetId) return null;
      const target = document.querySelector(targetId);
      return target ? { link, target } : null;
    })
    .filter(Boolean);

  const findLinkByHash = hash => navLinks.find(link => link.getAttribute("href") === hash);

  const setActive = activeLink => {
    navLinks.forEach(link => {
      const isActive = link === activeLink;
      link.classList.toggle("is-active", isActive);
      if (isActive && navSelect) {
        navSelect.value = link.getAttribute("href") || "";
      }
    });
  };

  navLinks.forEach(link => {
    link.addEventListener("click", evt => {
      const hash = link.getAttribute("href");
      if (!hash || !hash.startsWith("#")) return;
      const target = document.querySelector(hash);
      if (!target) return;
      evt.preventDefault();
      scrollSectionIntoView(target);
      setActive(link);
    });
  });

  if (navSelect) {
    navSelect.addEventListener("change", evt => {
      const hash = evt.target?.value;
      if (!hash || !hash.startsWith("#")) return;
      const target = document.querySelector(hash);
      if (!target) return;
      evt.preventDefault();
      scrollSectionIntoView(target);
      const matchingLink = findLinkByHash(hash);
      if (matchingLink) {
        setActive(matchingLink);
      }
    });
  }

  if (sectionMap.length) {
    const observer = new IntersectionObserver(
      entries => {
        entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
          .forEach(entry => {
            const item = sectionMap.find(({ target }) => target === entry.target);
            if (item) {
              setActive(item.link);
            }
          });
      },
      {
        rootMargin: "-55% 0px -40% 0px",
        threshold: [0.25, 0.5, 0.75]
      }
    );

    sectionMap.forEach(({ target }) => observer.observe(target));
  }

  setActive(navLinks[0]);
}

export function elevateHeaderOnScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const toggle = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  toggle();
  window.addEventListener("scroll", toggle, { passive: true });
}
