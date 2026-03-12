/* ==========================================
   portfolio-script-enhanced.js
   2025 PREMIUM CLEAN VERSION
========================================== */

(() => {
  "use strict";

  /* =========================
     HELPERS
  ========================= */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouchDevice =
    window.matchMedia("(pointer: coarse)").matches ||
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;

  const isMobileViewport = () => window.innerWidth <= 768;

  /* =========================
     GLOBAL CONSTELLATION CANVAS
  ========================= */
  (() => {
    const canvas = $("#netCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);

    let width = 0;
    let height = 0;

    const pointCount = isMobileViewport() ? 18 : 30;
    const linkDistance = (isMobileViewport() ? 100 : 130) * dpr;
    const speed = prefersReducedMotion ? 0 : 0.02;

    const points = Array.from({ length: pointCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed
    }));

    function resize() {
      width = canvas.width = Math.floor(window.innerWidth * dpr);
      height = canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    }

    function updatePoints() {
      if (prefersReducedMotion) return;

      for (const p of points) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i];
          const b = points[j];

          const ax = a.x * width;
          const ay = a.y * height;
          const bx = b.x * width;
          const by = b.y * height;

          const dist = Math.hypot(ax - bx, ay - by);

          if (dist < linkDistance) {
            const alpha = (1 - dist / linkDistance) * 0.18;
            ctx.strokeStyle = `rgba(6,182,212,${alpha})`;
            ctx.lineWidth = 1 * dpr;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.stroke();
          }
        }
      }

      for (const p of points) {
        const x = p.x * width;
        const y = p.y * height;
        ctx.fillStyle = "rgba(186,230,253,0.25)";
        ctx.beginPath();
        ctx.arc(x, y, 1.9 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function animate() {
      updatePoints();
      draw();
      requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener("resize", resize);

    if (prefersReducedMotion) draw();
    else animate();
  })();

  /* =========================
     THEME TOGGLE
  ========================= */
  (() => {
    let toggle = $("#themeToggle");

    if (!toggle) {
      toggle = document.createElement("button");
      toggle.id = "themeToggle";
      toggle.className = "theme-toggle";
      toggle.type = "button";
      toggle.setAttribute("aria-label", "Toggle theme");
      document.body.appendChild(toggle);
    }

    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);

    function renderIcon(theme) {
      toggle.innerHTML = theme === "light"
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
    }

    renderIcon(savedTheme);

    toggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";

      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      renderIcon(next);
    });
  })();

  /* =========================
     CUSTOM CURSOR
  ========================= */
  (() => {
    const cursor = $(".cursor");
    const glow = $(".cursor-glow");

    if (isTouchDevice || !cursor || !glow) {
      if (cursor) cursor.style.display = "none";
      if (glow) glow.style.display = "none";
      document.body.style.cursor = "auto";
      return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    });

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.15;
      glowY += (mouseY - glowY) * 0.15;
      glow.style.left = `${glowX}px`;
      glow.style.top = `${glowY}px`;
      requestAnimationFrame(animateGlow);
    }

    animateGlow();

    const hoverTargets = $$("a, button, .btn, .flip-card, .info-card, .cert-card, .filter-btn, .social-icon, .skill-card, .contact-card");

    hoverTargets.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.style.transform = "translate(-50%,-50%) scale(2)";
        glow.classList.add("cursor-hover");
      });

      el.addEventListener("mouseleave", () => {
        cursor.style.transform = "translate(-50%,-50%) scale(1)";
        glow.classList.remove("cursor-hover");
      });
    });
  })();

  /* =========================
     MAGNETIC HOVER
  ========================= */
  (() => {
    if (isTouchDevice || prefersReducedMotion) return;

    const targets = $$(".btn, .project-link, .social-icon");

    targets.forEach((el) => {
      el.addEventListener("mousemove", function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        this.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
      });

      el.addEventListener("mouseleave", function () {
        this.style.transform = "";
      });
    });
  })();

  /* =========================
     NAVBAR + MOBILE MENU
  ========================= */
  (() => {
    const navbar = $("#navbar");
    const navToggle = $(".nav-toggle");
    const navMenu = $(".nav-menu");
    const navLinks = $$(".nav-link");

    function handleScroll() {
      if (!navbar) return;
      navbar.classList.toggle("scrolled", window.scrollY > 80);
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    if (navToggle && navMenu) {
      navToggle.addEventListener("click", () => {
        navToggle.classList.toggle("active");
        navMenu.classList.toggle("active");
      });

      navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          navToggle.classList.remove("active");
          navMenu.classList.remove("active");
        });
      });
    }
  })();

  /* =========================
     ACTIVE SECTION HIGHLIGHT
  ========================= */
  (() => {
    const navLinks = $$(".nav-link");
    const sections = $$("section[id]");

    function updateActiveLink() {
      const scrollY = window.pageYOffset;

      sections.forEach((section) => {
        const top = section.offsetTop - 130;
        const height = section.offsetHeight;
        const id = section.getAttribute("id");

        if (scrollY >= top && scrollY < top + height) {
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
          });
        }
      });
    }

    window.addEventListener("scroll", updateActiveLink);
    window.addEventListener("resize", updateActiveLink);
    updateActiveLink();
  })();

  /* =========================
     TYPING EFFECT
  ========================= */
  (() => {
    const typedText = $("#typed-text");
    if (!typedText) return;

    const phrases = [
      "an Undergraduate Data Science Student",
      "a Data & AI Enthusiast",
      "a Machine Learning Explorer",
      "a Data Visualization Creator",
      "an Analytics Problem Solver",
      "an Aspiring AI Engineer"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      const current = phrases[phraseIndex];

      typedText.textContent = deleting
        ? current.slice(0, charIndex - 1)
        : current.slice(0, charIndex + 1);

      charIndex += deleting ? -1 : 1;

      let speed = deleting ? 55 : 95;

      if (!deleting && charIndex === current.length) {
        deleting = true;
        speed = 1200;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        speed = 250;
      }

      setTimeout(tick, speed);
    }

    tick();
  })();

  /* =========================
     REVEAL ON SCROLL
  ========================= */
  (() => {
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -100px 0px"
    });

    const targets = $$("section, .info-card, .cert-card, .flip-card, .skill-card, .filter-btn, .timeline-content");

    targets.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(26px)";
      el.style.transition = "opacity .7s ease, transform .7s ease";
      observer.observe(el);
    });
  })();

  /* =========================
     SKILLS CARD INTERACTION
  ========================= */
  (() => {
    const cards = $$(".skill-card");
    if (!cards.length) return;

    if (isTouchDevice) {
      cards.forEach((card) => {
        card.addEventListener("click", () => card.classList.toggle("active-glow"));
      });
      return;
    }

    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;

        const rotateY = ((x - cx) / cx) * 8;
        const rotateX = -((y - cy) / cy) * 8;

        card.style.transform =
          `translateY(-8px) perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });

      card.addEventListener("click", () => {
        card.classList.toggle("active-glow");
      });
    });
  })();

  /* =========================
     PROJECT FILTERS
  ========================= */
  (() => {
    const buttons = $$(".filter-btn");
    const cards = $$(".flip-card");
    if (!buttons.length || !cards.length) return;

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = (button.dataset.filter || "all").toLowerCase();

        buttons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        cards.forEach((card) => {
          const category = (card.dataset.category || "").toLowerCase();
          card.style.display = filter === "all" || category === filter ? "" : "none";
        });
      });
    });
  })();

  /* =========================
     MOBILE TAP TO FLIP
  ========================= */
  (() => {
    if (!isTouchDevice) return;

    $$(".flip-card").forEach((card) => {
      card.addEventListener("click", () => {
        card.classList.toggle("tap-flip");
      });
    });
  })();

  /* =========================
     SMOOTH SCROLL
  ========================= */
  (() => {
    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href || href === "#") return;

        const target = $(href);
        if (!target) return;

        e.preventDefault();

        window.scrollTo({
          top: target.offsetTop - 100,
          behavior: "smooth"
        });
      });
    });
  })();

  /* =========================
     CONTACT FORM
  ========================= */
  (() => {
    const form = $("#contact-form");
    const status = $("#form-status");

    if (!form || !status) return;

    const encodeForm = (formData) =>
      new URLSearchParams([...formData.entries()]).toString();

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonMarkup = submitButton ? submitButton.innerHTML : "";
      const formData = new FormData(form);

      status.textContent = "Sending message...";
      status.className = "form-status";
      status.style.display = "block";

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
      }

      try {
        const response = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: encodeForm(formData)
        });

        if (!response.ok) throw new Error(`Form submission failed with ${response.status}`);

        status.textContent = "Message sent successfully. I'll get back to you soon.";
        status.className = "form-status success";
        form.reset();
      } catch (error) {
        console.error(error);
        status.textContent = "This form only works on your deployed site. Use the Gmail button if you're testing locally.";
        status.className = "form-status error";
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = originalButtonMarkup;
        }

        setTimeout(() => {
          status.style.display = "none";
          status.className = "form-status";
        }, 4500);
      }
    });
  })();

  /* =========================
     SECTION SHIMMER TRIGGER
  ========================= */
  (() => {
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.remove("section-visible");
        void entry.target.offsetWidth;
        entry.target.classList.add("section-visible");
      });
    }, { threshold: 0.06 });

    $$("section[id]").forEach((section) => observer.observe(section));
  })();

  /* =========================
     SCROLL PROGRESS BAR
  ========================= */
  (() => {
    const bar = document.createElement("div");
    bar.style.cssText = `
      position:fixed;
      top:0;
      left:0;
      width:0%;
      height:4px;
      background:linear-gradient(90deg,#06B6D4,#3B82F6,#818CF8);
      z-index:10000;
      transition:width .2s ease;
      box-shadow:0 0 10px rgba(6,182,212,.4);
    `;
    document.body.appendChild(bar);

    function updateProgress() {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = `${progress}%`;
    }

    window.addEventListener("scroll", updateProgress);
    updateProgress();
  })();

  /* =========================
     PAGE FADE IN
  ========================= */
  window.addEventListener("load", () => {
    document.body.style.opacity = "0";

    setTimeout(() => {
      document.body.style.transition = "opacity .6s ease";
      document.body.style.opacity = "1";
    }, 80);
  });

  /* =========================
     TAB TITLE CHANGE
  ========================= */
  document.addEventListener("visibilitychange", () => {
    document.title = document.hidden
      ? "👋 Come back!"
      : "Chathumi Navodya | Data Science Portfolio";
  });

})();