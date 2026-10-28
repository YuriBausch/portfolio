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

// ---- Décor : salle de projection (sombre) / plateau studio (clair) ----
// Le décor est fixe derrière la page ; le CSS montre l'un ou l'autre selon le thème.
const root = document.documentElement;
const isDark = () => root.getAttribute("data-theme") !== "light";
const scene = document.createElement("div");
scene.className = "scene";
scene.setAttribute("aria-hidden", "true");
scene.innerHTML =
  '<div class="scene__beam"><i></i></div><canvas class="scene__dust"></canvas>' +
  '<span class="scene__soft scene__soft--l"></span><span class="scene__soft scene__soft--r"></span>' +
  '<span class="scene__mark scene__mark--a"></span><span class="scene__mark scene__mark--b"></span>';
document.body.prepend(scene);

// Poussière dans le faisceau du projecteur (même trapèze que .scene__beam i)
const BEAM = [[0, 0], [0.16, 0], [1, 0.58], [1, 1], [0.62, 1]];
const inBeam = (x, y) => {
  let inside = false;
  for (let i = 0, j = BEAM.length - 1; i < BEAM.length; j = i++) {
    const [xi, yi] = BEAM[i], [xj, yj] = BEAM[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
const dust = scene.querySelector(".scene__dust");
const dctx = dust.getContext("2d");
let motes = [];
let dustRaf = 0;
const sizeDust = () => {
  const dpr = Math.min(2, devicePixelRatio || 1);
  dust.width = innerWidth * dpr;
  dust.height = innerHeight * dpr;
  dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const n = Math.round(Math.min(110, (innerWidth * innerHeight) / 14000));
  motes = Array.from({ length: n }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() < 0.12 ? 3 + Math.random() * 5 : 0.5 + Math.random() * 1.5,
    vx: (Math.random() - 0.3) * 0.00012, vy: (Math.random() - 0.6) * 0.0001,
    p: Math.random() * Math.PI * 2,
  }));
};
const drawDust = (t) => {
  dctx.clearRect(0, 0, innerWidth, innerHeight);
  for (const m of motes) {
    if (!reduceMotion) {
      m.x += m.vx; m.y += m.vy;
      if (m.x < -0.02) m.x = 1.02; if (m.x > 1.02) m.x = -0.02;
      if (m.y < -0.02) m.y = 1.02; if (m.y > 1.02) m.y = -0.02;
    }
    if (!inBeam(m.x, m.y)) continue;
    const far = Math.hypot(m.x, m.y) / 1.41; // plus loin du projecteur = plus diffus
    const a = (0.55 - far * 0.35) * (0.6 + 0.4 * Math.sin(t / 900 + m.p));
    const x = m.x * innerWidth, y = m.y * innerHeight;
    if (m.r > 3) {
      // particule hors du plan de netteté : un disque flou très léger
      const g = dctx.createRadialGradient(x, y, 0, x, y, m.r);
      g.addColorStop(0, `rgba(255, 238, 214, ${Math.max(0, a * 0.35)})`);
      g.addColorStop(1, "rgba(255, 238, 214, 0)");
      dctx.fillStyle = g;
    } else {
      dctx.fillStyle = `rgba(255, 238, 214, ${Math.max(0, a)})`;
    }
    dctx.beginPath();
    dctx.arc(x, y, m.r, 0, Math.PI * 2);
    dctx.fill();
  }
};
const loopDust = (t) => { drawDust(t); dustRaf = requestAnimationFrame(loopDust); };
const syncDust = () => {
  cancelAnimationFrame(dustRaf);
  if (!isDark() || document.hidden) return;
  if (reduceMotion) drawDust(0);
  else dustRaf = requestAnimationFrame(loopDust);
};
sizeDust();
syncDust();
addEventListener("resize", () => { sizeDust(); syncDust(); });
document.addEventListener("visibilitychange", syncDust);

// ---- Décor détaillé du hero ------------------------------------------
// Salle : rangées de fauteuils, panneau de sortie, balisage de l'allée.
// Plateau : deux pieds de lumière, une perche son qui entre dans le cadre, des câbles.
const hero = document.querySelector(".hero");
if (hero) {
  const en = root.lang === "en";

  // fauteuils : rangée du fond plus petite, rangée de devant plus grande, allée vers la droite
  const row = (w, gap, top, base, skip) => {
    let d = "", rim = "";
    for (let x = -30; x < 1640; x += w + gap) {
      if (x > skip[0] && x < skip[1]) continue;
      const r = w / 2;
      d += `M${x} ${base}V${top + r * 0.7}Q${x} ${top} ${x + r} ${top}Q${x + w} ${top} ${x + w} ${top + r * 0.7}V${base}Z`;
      rim += `M${x + 4} ${top + r * 0.5}Q${x + 4} ${top + 3} ${x + r} ${top + 3}Q${x + w - 4} ${top + 3} ${x + w - 4} ${top + r * 0.5}`;
    }
    return [d, rim];
  };
  const [backD, backRim] = row(64, 8, 72, 170, [1040, 1150]);
  const [frontD, frontRim] = row(108, 12, 118, 240, [1010, 1180]);
  const aisle = [150, 172, 194, 216].map((y, i) =>
    `<circle cx="${1093 + i * 3}" cy="${y}" r="3" fill="#ffb347"/>`).join("");

  const stand = `
    <svg class="set__stand" viewBox="0 0 320 720" preserveAspectRatio="xMidYMax meet">
      <defs><radialGradient id="softGlow"><stop offset="0" stop-color="#fffdf5" stop-opacity=".95"/><stop offset="1" stop-color="#fffdf5" stop-opacity="0"/></radialGradient></defs>
      <ellipse cx="150" cy="712" rx="120" ry="8" fill="rgba(60,45,25,.18)"/>
      <path d="M150 600 L58 712 M150 600 L242 712 M150 600 L150 712" stroke="#2b2925" stroke-width="7" stroke-linecap="round"/>
      <path d="M150 604 V250" stroke="#2b2925" stroke-width="9" stroke-linecap="round"/>
      <path d="M150 250 V230" stroke="#4a4640" stroke-width="13"/>
      <g transform="rotate(24 150 222)">
        <path d="M150 196 L282 120 L282 330 L150 252 Z" fill="#1f1d1a"/>
        <path d="M150 196 L282 120 M150 252 L282 330" stroke="#3b3833" stroke-width="2"/>
        <ellipse cx="330" cy="225" rx="110" ry="170" fill="url(#softGlow)"/>
        <rect x="278" y="118" width="12" height="214" rx="2" fill="#fffdf6"/>
      </g>
    </svg>`;

  const set = document.createElement("div");
  set.className = "set";
  set.setAttribute("aria-hidden", "true");
  set.innerHTML = `
    <div class="set__dark">
      <span class="set__exit">${en ? "EXIT" : "SORTIE"}<i></i></span>
      <svg class="set__seats" viewBox="0 0 1600 240" preserveAspectRatio="xMidYMax slice">
        <defs><linearGradient id="rimLight" x1="0" x2="1">
          <stop offset="0" stop-color="#ffecd0" stop-opacity=".05"/>
          <stop offset="1" stop-color="#ffecd0" stop-opacity=".32"/>
        </linearGradient></defs>
        <path d="${backD}" fill="#0d0d0f"/>
        <path d="${backRim}" fill="none" stroke="url(#rimLight)" stroke-width="2"/>
        ${aisle}
        <path d="${frontD}" fill="#050506"/>
        <path d="${frontRim}" fill="none" stroke="url(#rimLight)" stroke-width="2.5"/>
      </svg>
    </div>
    <div class="set__light">
      <div class="set__stand-wrap set__stand-wrap--l">${stand}</div>
      <div class="set__stand-wrap set__stand-wrap--r">${stand.replace('id="softGlow"', 'id="softGlow2"').replace("url(#softGlow)", "url(#softGlow2)")}</div>
      <svg class="set__boom" viewBox="0 0 620 240">
        <defs><filter id="fur"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2"/><feDisplacementMap in="SourceGraphic" scale="9"/></filter></defs>
        <path d="M640 6 L196 150" stroke="#2b2925" stroke-width="7" stroke-linecap="round"/>
        <path d="M640 3 L196 147" stroke="#6b665d" stroke-width="1.5" opacity=".6"/>
        <circle cx="196" cy="150" r="13" fill="none" stroke="#2b2925" stroke-width="4"/>
        <g transform="rotate(-18 150 170)">
          <ellipse cx="128" cy="172" rx="78" ry="25" fill="#6e655a" filter="url(#fur)"/>
          <ellipse cx="120" cy="164" rx="52" ry="9" fill="#8b8174" opacity=".55" filter="url(#fur)"/>
        </g>
      </svg>
      <svg class="set__cables" viewBox="0 0 1600 120" preserveAspectRatio="xMidYMax slice">
        <path d="M-20 92 C220 60 340 118 560 96 S900 70 1040 104 S1380 120 1620 84" fill="none" stroke="#1f1d1a" stroke-width="6" stroke-linecap="round"/>
        <path d="M-20 108 C180 118 420 84 620 112 S980 124 1200 100" fill="none" stroke="#3a3631" stroke-width="4" stroke-linecap="round"/>
        <rect x="1188" y="92" width="34" height="16" rx="3" fill="#2b2925"/>
        <rect x="1222" y="97" width="8" height="6" fill="#c9a24a"/>
      </svg>
    </div>`;
  hero.prepend(set);
}

// ---- Changement de thème : les projecteurs ---------------------------
// sombre -> clair : le projecteur s'éteint, puis le plateau s'allume en trois « clac »
// clair -> sombre : le plateau coupe au noir, puis la lampe du projecteur démarre
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
    syncDust();
  };
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const run = (el, frames, ms, easing = "linear") =>
    el.animate(frames, { duration: ms, easing, fill: "forwards" }).finished;

  themeToggle.addEventListener("click", async () => {
    if (busy) return;
    const next = isDark() ? "light" : "dark";
    if (reduceMotion) return apply(next);
    busy = true;
    if (next === "light") {
      await Promise.all(banks.map((b) => run(b, [{ opacity: 0 }, { opacity: 1 }], 220, "ease-in")));
      apply(next);
      await wait(260);
      await Promise.all(banks.map((b, i) => wait(i * 230).then(() => run(b, [
        { opacity: 1, background: "#000" },
        { opacity: 1, background: "#fffaf0", offset: 0.12 },
        { opacity: 0, background: "#fffaf0" },
      ], 560, "ease-out"))));
    } else {
      await Promise.all(banks.map((b) => run(b, [{ opacity: 0 }, { opacity: 1 }], 70)));
      apply(next);
      await wait(380);
      scene.classList.add("is-warming");
      await Promise.all(banks.map((b) => run(b, [
        { opacity: 1 }, { opacity: 0.55, offset: 0.2 }, { opacity: 1, offset: 0.3 },
        { opacity: 0.25, offset: 0.55 }, { opacity: 0.7, offset: 0.65 }, { opacity: 0 },
      ], 720)));
      setTimeout(() => scene.classList.remove("is-warming"), 900);
    }
    banks.forEach((b) => b.getAnimations().forEach((a) => a.cancel()));
    busy = false;
  });
}

// ---- Ouverture : les bandes noires du hero s'écartent ----------------
document.body.classList.add("is-rolling");

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
