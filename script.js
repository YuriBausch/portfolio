/* ========================================================================
   YURI BAUSCH — Portfolio 2026 — interactions
   ===================================================================== */

// ---- Gallery data (per project) -------------------------------------
const GALLERIES = {
  "project-1": [
    { src: "assets/gallery/nc_techforgood_greentech.webp", alt: "Appel à projet Tech for Good — Greentech" },
    { src: "assets/gallery/nc_post_01.webp", alt: "Post campagne Tech for Good" },
    { src: "assets/gallery/nc_post_02.webp", alt: "Post campagne Tech for Good" },
    { src: "assets/gallery/nc_post_03.webp", alt: "Post campagne Tech for Good" },
    { src: "assets/gallery/nc_post_04.webp", alt: "Post campagne — résultats du concours" },
    { src: "assets/gallery/nc_post_05.webp", alt: "Post pour une autre campagne" },
    { src: "assets/gallery/nc_post_06.webp", alt: "Post pour une autre campagne", mod: "wide" },
  ],
  "project-2": [
    { src: "assets/gallery/llu_afterwork.webp", alt: "Le Lieu Utile — événement Afterwork" },
    { src: "assets/gallery/llu_feed_01.webp", alt: "Concept de feed — Le Lieu Utile" },
    { src: "assets/gallery/llu_feed_02.webp", alt: "Concept de feed — Le Lieu Utile" },
    { src: "assets/gallery/llu_feed_03.webp", alt: "Concept de feed — Le Lieu Utile" },
  ],
  "project-3": [
    { src: "assets/gallery/anatomy_heart.webp", alt: "anatomy. — cœur fleuri, visuel signature", mod: "tall" },
    { src: "assets/gallery/anatomy_flower_01.webp", alt: "anatomy. — design de fleur", mod: "tall" },
    { src: "assets/gallery/anatomy_flower_02.webp", alt: "anatomy. — design de fleur", mod: "tall" },
    { src: "assets/gallery/anatomy_flower_03.webp", alt: "anatomy. — design de fleur" },
    { src: "assets/gallery/anatomy_flowers_spread.webp", alt: "anatomy. — déclinaisons florales", mod: "wide" },
    { src: "assets/gallery/anatomy_mockup_01.webp", alt: "anatomy. — mockup vêtement", mod: "tall" },
    { src: "assets/gallery/anatomy_mockup_02.webp", alt: "anatomy. — mockup vêtement", mod: "wide" },
    { src: "assets/gallery/anatomy_mockup_03.webp", alt: "anatomy. — mockup vêtement", mod: "wide" },
  ],
  "project-4": [
    { src: "assets/gallery/slh_fashionweek.webp", alt: "Saint Laurent HOMME — Fashion Week Paris", mod: "tall" },
    { src: "assets/gallery/slh_regie.webp", alt: "Régie installée à la Bourse du Commerce", mod: "wide" },
    { src: "assets/gallery/slh_schema.webp", alt: "Schéma de la régie réalisé en pré-production", mod: "wide" },
  ],
};

// ---- Build galleries -------------------------------------------------
const flatImages = []; // for lightbox navigation, grouped per gallery
Object.entries(GALLERIES).forEach(([id, imgs]) => {
  const article = document.getElementById(id);
  if (!article) return;
  const grid = article.querySelector(".gallery");
  if (!grid) return;
  imgs.forEach((img, i) => {
    const fig = document.createElement("figure");
    fig.className = "gallery__item" + (img.mod ? ` gallery__item--${img.mod}` : "");
    fig.dataset.gallery = id;
    fig.dataset.index = i;
    const el = document.createElement("img");
    el.src = img.src;
    el.alt = img.alt;
    el.loading = "lazy";
    fig.appendChild(el);
    grid.appendChild(fig);
    fig.addEventListener("click", () => openLightbox(id, i));
  });
});

// ---- Lightbox --------------------------------------------------------
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
let current = { gallery: null, index: 0 };

function openLightbox(gallery, index) {
  current = { gallery, index };
  renderLightbox();
  lb.classList.add("open");
  lb.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function renderLightbox() {
  const img = GALLERIES[current.gallery][current.index];
  lbImg.src = img.src;
  lbImg.alt = img.alt;
}
function closeLightbox() {
  lb.classList.remove("open");
  lb.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
function step(dir) {
  const list = GALLERIES[current.gallery];
  current.index = (current.index + dir + list.length) % list.length;
  renderLightbox();
}

document.getElementById("lbClose").addEventListener("click", closeLightbox);
document.getElementById("lbPrev").addEventListener("click", (e) => { e.stopPropagation(); step(-1); });
document.getElementById("lbNext").addEventListener("click", (e) => { e.stopPropagation(); step(1); });
lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
document.addEventListener("keydown", (e) => {
  if (!lb.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});

// ---- Theme toggle (clair / sombre) -----------------------------------
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
}

// ---- Nav: scrolled state + mobile menu -------------------------------
const nav = document.getElementById("nav");
const burger = document.getElementById("burger");
const links = document.querySelector(".nav__links");

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
});
burger.addEventListener("click", () => links.classList.toggle("open"));
links.addEventListener("click", (e) => {
  if (e.target.tagName === "A") links.classList.remove("open");
});

// ---- Reveal on scroll ------------------------------------------------
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// ---- Scroll progress bar ---------------------------------------------
const progress = document.getElementById("scrollProgress");
if (progress) {
  const updateProgress = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    progress.style.width = `${Math.min(100, scrolled * 100)}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
}

// ---- Active nav link on scroll ---------------------------------------
const navMap = new Map();
document.querySelectorAll('.nav__links a[href^="#"]').forEach((a) => {
  const id = a.getAttribute("href").slice(1);
  if (id) navMap.set(id, a);
});
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navMap.forEach((a) => a.classList.remove("active"));
        const link = navMap.get(entry.target.id);
        if (link) link.classList.add("active");
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
navMap.forEach((_, id) => {
  const sec = document.getElementById(id);
  if (sec) spy.observe(sec);
});

// ---- Contact form (Web3Forms AJAX) -----------------------------------
const form = document.getElementById("contactForm");
if (form) {
  const status = document.getElementById("formStatus");
  const submit = form.querySelector(".contact__submit");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const key = form.querySelector('input[name="access_key"]').value;

    if (!key || key === "VOTRE_CLE_WEB3FORMS") {
      status.textContent =
        "⚠️ Formulaire non configuré : ajoutez votre clé Web3Forms (voir README).";
      status.className = "contact__status err";
      return;
    }

    status.textContent = "Envoi en cours…";
    status.className = "contact__status";
    submit.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      const data = await res.json();
      if (data.success) {
        status.textContent = "✅ Merci ! Votre message a bien été envoyé.";
        status.className = "contact__status ok";
        form.reset();
      } else {
        throw new Error(data.message || "Erreur");
      }
    } catch (err) {
      status.textContent =
        "❌ Oups, l'envoi a échoué. Réessayez ou écrivez-moi directement par email.";
      status.className = "contact__status err";
    } finally {
      submit.disabled = false;
    }
  });
}
