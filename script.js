/* ========================================================================
   YURI BAUSCH — Portfolio 2026 — interactions « salle de montage »
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

// Assets resolve relative to this script, so the /en/ page works too
const ASSET_BASE = new URL(".", document.currentScript.src);
const asset = (p) => new URL(p, ASSET_BASE).href;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Timecode HH:MM:SS:FF at 24 fps
const FPS = 24;
const pad2 = (n) => String(n).padStart(2, "0");
function toTC(seconds) {
  const totalFrames = Math.max(0, Math.floor(seconds * FPS));
  const f = totalFrames % FPS;
  const s = Math.floor(totalFrames / FPS);
  return `${pad2(Math.floor(s / 3600))}:${pad2(Math.floor(s / 60) % 60)}:${pad2(s % 60)}:${pad2(f)}`;
}

// ---- Build galleries (planches contact) ------------------------------
Object.entries(GALLERIES).forEach(([id, imgs]) => {
  const article = document.getElementById(id);
  if (!article) return;
  const grid = article.querySelector(".gallery");
  if (!grid) return;

  // marquage de bord façon pellicule
  const edge = document.createElement("div");
  edge.className = "gallery__edge";
  edge.setAttribute("aria-hidden", "true");
  const roll = id.replace("project-", "");
  edge.innerHTML = `<span>YB 2026 ▸ ROLL ${pad2(+roll)}</span><span>PORTRA 400</span><span>◂ ${imgs.length} FRAMES ▸</span>`;
  grid.appendChild(edge);

  imgs.forEach((img, i) => {
    const fig = document.createElement("figure");
    fig.className = "gallery__item" + (img.mod ? ` gallery__item--${img.mod}` : "");
    fig.tabIndex = 0;
    fig.setAttribute("role", "button");
    fig.setAttribute("aria-label", img.alt);
    const el = document.createElement("img");
    el.src = asset(img.src);
    el.alt = img.alt;
    el.loading = "lazy";
    el.decoding = "async";
    fig.appendChild(el);
    grid.appendChild(fig);
    fig.addEventListener("click", () => openLightbox(id, i));
    fig.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(id, i); }
    });
  });
});

// ---- Carton « Fin » façon Godard : une couleur par lettre --------------
document.querySelectorAll(".fin__fr").forEach((el) => {
  const text = el.textContent;
  el.classList.add("godard");
  el.innerHTML = `<span class="visually-hidden">${text}</span>` +
    [...text].map((c) => (c === " " ? " " : `<i aria-hidden="true">${c}</i>`)).join("");
});

// ---- Photo de profil : visuel de remplacement si absente -------------
const photo = document.querySelector(".about__frame img");
if (photo) {
  const fallback = () => { photo.src = asset("assets/photo-placeholder.svg"); };
  if (photo.complete && photo.naturalWidth === 0) fallback();
  else photo.addEventListener("error", fallback, { once: true });
}

// ---- Lightbox (moniteur) ---------------------------------------------
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbCount = document.getElementById("lbCount");
let current = { gallery: null, index: 0 };
let lastFocus = null;

function openLightbox(gallery, index) {
  current = { gallery, index };
  lastFocus = document.activeElement;
  renderLightbox();
  lb.classList.add("open");
  lb.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.getElementById("lbClose").focus();
}
function renderLightbox() {
  const list = GALLERIES[current.gallery];
  const img = list[current.index];
  lbImg.src = asset(img.src);
  lbImg.alt = img.alt;
  if (lbCount) {
    const roll = pad2(+current.gallery.replace("project-", ""));
    lbCount.textContent = `ROLL ${roll} · FRAME ${pad2(current.index + 1)}A / ${pad2(list.length)}`;
  }
}
function closeLightbox() {
  lb.classList.remove("open");
  lb.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lastFocus) lastFocus.focus();
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

// ---- Changement de thème : on tourne la page ------------------------
// Trois bandes de la couleur du nouveau thème descendent, puis repartent.
const root = document.documentElement;
const isDark = () => root.getAttribute("data-theme") !== "light";
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  const fx = document.createElement("div");
  fx.className = "lights";
  fx.setAttribute("aria-hidden", "true");
  fx.innerHTML = "<i></i><i></i><i></i>";
  document.body.appendChild(fx);
  const banks = [...fx.children];
  let busy = false;

  const apply = (next) => {
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  };
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const sweep = (from, to, color) => Promise.all(banks.map((b, i) => wait(i * 80).then(() =>
    b.animate(
      [{ transform: from, opacity: 1, background: color }, { transform: to, opacity: 1, background: color }],
      { duration: 360, easing: "cubic-bezier(.7, 0, .3, 1)", fill: "forwards" }
    ).finished)));

  themeToggle.addEventListener("click", async () => {
    if (busy) return;
    const next = isDark() ? "light" : "dark";
    if (reduceMotion) return apply(next);
    busy = true;
    const color = next === "light" ? "#f2c900" : "#0b0b0c";
    await sweep("translateY(-100%)", "translateY(0)", color);
    apply(next);
    await sweep("translateY(0)", "translateY(100%)", color);
    banks.forEach((b) => b.getAnimations().forEach((a) => a.cancel()));
    busy = false;
  });
}

// ---- Timecode du viseur (temps réel) ---------------------------------
const tcEl = document.getElementById("tc");
if (tcEl) {
  const t0 = performance.now();
  const run = () => {
    tcEl.textContent = toTC((performance.now() - t0) / 1000);
    requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}

// ---- Nav: scrolled state ---------------------------------------------
const nav = document.getElementById("nav");
const onNavScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
window.addEventListener("scroll", onNavScroll, { passive: true });
onNavScroll();

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

// ---- Barre de progression + lien actif de la nav ----------------------
const edit = document.getElementById("edit");
if (edit) {
  const fill = edit.querySelector(".edit__fill");
  const sections = [...document.querySelectorAll("[data-clip]")];
  const navLinks = document.querySelectorAll(".nav__links a");

  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    fill.style.transform = `scaleX(${Math.min(1, Math.max(0, scrollY / Math.max(1, max)))})`;

    // section active = celle qui contient le milieu de l'écran
    // (page projet : pas de sections, « Projets » reste actif)
    if (!sections.length) {
      navLinks.forEach((a) => a.classList.toggle("active", a.hash === "#projects"));
      return;
    }
    const mid = scrollY + innerHeight * 0.45;
    let active = 0;
    sections.forEach((sec, i) => { if (sec.offsetTop <= mid) active = i; });
    navLinks.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === `#${sections[active].id}`);
    });
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

// ---- Contact form (Web3Forms AJAX) -----------------------------------
const form = document.getElementById("contactForm");
if (form) {
  const status = document.getElementById("formStatus");
  const submit = form.querySelector(".contact__submit");
  const en = document.documentElement.lang === "en";
  const MSG = en
    ? {
        noKey: "⚠️ Form not configured: add your Web3Forms key (see README).",
        sending: "Sending…",
        ok: "✅ Thanks! Your message has been sent.",
        err: "❌ Oops, sending failed. Please try again or email me directly.",
      }
    : {
        noKey: "⚠️ Formulaire non configuré : ajoutez votre clé Web3Forms (voir README).",
        sending: "Envoi en cours…",
        ok: "✅ Merci ! Votre message a bien été envoyé.",
        err: "❌ Oups, l'envoi a échoué. Réessayez ou écrivez-moi directement par email.",
      };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const key = form.querySelector('input[name="access_key"]').value;

    if (!key || key === "VOTRE_CLE_WEB3FORMS") {
      status.textContent = MSG.noKey;
      status.className = "contact__status err";
      return;
    }

    status.textContent = MSG.sending;
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
        status.textContent = MSG.ok;
        status.className = "contact__status ok";
        form.reset();
      } else {
        throw new Error(data.message || "Erreur");
      }
    } catch (err) {
      status.textContent = MSG.err;
      status.className = "contact__status err";
    } finally {
      submit.disabled = false;
    }
  });
}
