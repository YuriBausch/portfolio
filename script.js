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

// Base path for assets (set to "../" on the English page in /en/)
const ASSET_BASE = window.ASSET_BASE || "";
const asset = (p) => ASSET_BASE + p;
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

// ---- Theme toggle (salle de montage / feuille de service) ------------
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
}

// ---- Intro : amorce 3-2-1 (une fois par session) ---------------------
const leader = document.getElementById("leader");
function rollCamera() { document.body.classList.add("is-rolling"); }
if (leader) {
  let seen = false;
  try { seen = sessionStorage.getItem("leader") === "1"; } catch (e) {}
  if (seen || reduceMotion) {
    leader.remove();
    rollCamera();
  } else {
    const num = leader.querySelector(".leader__num");
    const sweep = leader.querySelector(".leader__sweep");
    let n = 3;
    let start = performance.now();
    let raf;
    const finish = () => {
      cancelAnimationFrame(raf);
      leader.classList.add("done");
      try { sessionStorage.setItem("leader", "1"); } catch (e) {}
      setTimeout(rollCamera, 150);
      setTimeout(() => leader.remove(), 700);
    };
    const tick = (t) => {
      const p = (t - start) / 600; // 0.6 s par chiffre
      if (p >= 1) {
        n -= 1;
        if (n === 0) return finish();
        num.textContent = n;
        start = t;
      }
      sweep.style.setProperty("--a", `${Math.min(1, p) * 360}deg`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    leader.addEventListener("click", finish);
    document.addEventListener("keydown", function skip() {
      if (document.body.contains(leader)) finish();
      document.removeEventListener("keydown", skip);
    });
  }
} else {
  rollCamera();
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

// ---- Timeline de montage (nav du bas) --------------------------------
// Toute la page = un film de 3 minutes ; le scroll déplace la tête de lecture.
const FILM_SECONDS = 180;
const edit = document.getElementById("edit");
if (edit) {
  const v1 = edit.querySelector(".edit__v1");
  const a1 = edit.querySelector(".edit__a1");
  const head = edit.querySelector(".edit__head");
  const tracks = edit.querySelector(".edit__tracks");
  const readout = document.getElementById("editTc");
  const sections = [...document.querySelectorAll("[data-clip]")];

  // clips V1
  const clips = sections.map((sec, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "edit__clip";
    b.innerHTML = `<b>${pad2(i)}</b><span>${sec.dataset.clip}</span>`;
    b.setAttribute("aria-label", sec.dataset.clip);
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      sec.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    });
    v1.appendChild(b);
    return b;
  });

  // forme d'onde A1 (pseudo-aléatoire, stable)
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 160; i++) {
    const bar = document.createElement("i");
    bar.style.height = `${20 + Math.round(rnd() * 70 * (0.6 + 0.4 * Math.sin(i / 9)))}%`;
    frag.appendChild(bar);
  }
  a1.appendChild(frag);

  const layout = () => {
    sections.forEach((sec, i) => { clips[i].style.flex = `${sec.offsetHeight} 1 0`; });
  };

  const maxScroll = () => document.documentElement.scrollHeight - innerHeight;
  const update = () => {
    const p = Math.min(1, Math.max(0, scrollY / Math.max(1, maxScroll())));
    const w = tracks.clientWidth - 2 * parseFloat(getComputedStyle(tracks).paddingLeft);
    head.style.transform = `translateX(${p * w}px)`;
    if (readout) readout.textContent = toTC(p * FILM_SECONDS);

    // clip actif = section qui contient le milieu de l'écran
    const mid = scrollY + innerHeight * 0.45;
    let active = 0;
    sections.forEach((sec, i) => { if (sec.offsetTop <= mid) active = i; });
    clips.forEach((c, i) => c.classList.toggle("active", i === active));
    document.querySelectorAll(".nav__links a").forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === `#${sections[active].id}`);
    });
  };

  // scrubbing : clic / glisser sur la timeline
  let scrubbing = false;
  const scrubTo = (clientX) => {
    const r = tracks.getBoundingClientRect();
    const padL = parseFloat(getComputedStyle(tracks).paddingLeft);
    const p = Math.min(1, Math.max(0, (clientX - r.left - padL) / (r.width - 2 * padL)));
    window.scrollTo({ top: p * maxScroll(), behavior: "auto" });
  };
  tracks.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".edit__clip")) return;
    scrubbing = true;
    document.documentElement.style.scrollBehavior = "auto";
    tracks.setPointerCapture(e.pointerId);
    scrubTo(e.clientX);
  });
  tracks.addEventListener("pointermove", (e) => { if (scrubbing) scrubTo(e.clientX); });
  const stop = () => { scrubbing = false; document.documentElement.style.scrollBehavior = ""; };
  tracks.addEventListener("pointerup", stop);
  tracks.addEventListener("pointercancel", stop);

  layout();
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", () => { layout(); update(); });
  window.addEventListener("load", () => { layout(); update(); });
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
