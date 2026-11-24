(() => {
  "use strict";

  const menuBtn = document.querySelector(".menu-btn");
  const links = document.getElementById("nav-links");

  if (menuBtn && links) {
    menuBtn.addEventListener("click", () => {
      const isOpen = links.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
      menuBtn.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    });

    links.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        links.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "Open navigation menu");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && links.classList.contains("open")) {
        links.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.focus();
      }
    });
  }

  const navAnchors = links ? [...links.querySelectorAll('a[href^="#"]')] : [];
  const sections = document.querySelectorAll("main section[id]");

  if ("IntersectionObserver" in window && navAnchors.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navAnchors.forEach((anchor) => {
            const active = anchor.getAttribute("href") === `#${entry.target.id}`;
            anchor.classList.toggle("active", active);
            if (active) anchor.setAttribute("aria-current", "location");
            else anchor.removeAttribute("aria-current");
          });
        }
      });
    }, { rootMargin: "-38% 0px -55% 0px" });

    sections.forEach((section) => spy.observe(section));
  }

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("in"));
  }

  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const image = lightbox.querySelector("img");
    const closeButton = lightbox.querySelector(".close");
    const previewButtons = document.querySelectorAll(".cert-thumb, .project-shot");

    previewButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const source = button.dataset.full;
        if (!source || !image) return;
        image.src = source;
        image.alt = button.dataset.alt || button.querySelector("img")?.alt || "Portfolio image preview";
        if (typeof lightbox.showModal === "function") lightbox.showModal();
        else window.open(source, "_blank", "noopener");
      });
    });

    closeButton?.addEventListener("click", () => lightbox.close());
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) lightbox.close();
    });
    lightbox.addEventListener("close", () => {
      image.removeAttribute("src");
      image.alt = "";
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
