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
  '<span class="scene__booth"></span><div class="scene__beam"><i></i></div><canvas class="scene__dust"></canvas>' +
  '<span class="scene__soft scene__soft--l"></span><span class="scene__soft scene__soft--r"></span>';
document.body.prepend(scene);

// Poussière dans le faisceau du projecteur (même trapèze que .scene__beam i)
const BEAM = [[0, 0.1], [0.03, 0.09], [1, 0.5], [1, 1], [0.6, 1], [0, 0.18]];
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

// ---- Décor du hero : deux illustrations --------------------------------
// Salle de projection : trois rangées de fauteuils en perspective, des spectateurs,
//   le balisage de l'allée et la lueur bleutée de l'écran (hors champ, à droite).
// Plateau studio : sol cyclo, une boîte à lumière sur pied C-stand, un projecteur
//   fresnel sur trépied qui éclaire le sol, un câble et des marques au sol.
const hero = document.querySelector(".hero");
if (hero) {
  // une rangée de fauteuils (avec accoudoirs), réduite selon la distance
  const seatRow = (y, s, offset) => {
    let out = "";
    for (let x = offset; x < 1700; x += 112 * s) {
      out += `<use href="#seat" transform="translate(${x.toFixed(1)} ${y}) scale(${s})"/>`;
    }
    return out;
  };
  const head = (x, y, s) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <path d="M-30 40C-34 6-20-26 4-26C30-26 40 4 34 40Z" fill="#050405"/>
      <path d="M22-18C33-6 37 14 34 38" fill="none" stroke="#9fb6e8" stroke-opacity=".35" stroke-width="2.5" stroke-linecap="round"/>
    </g>`;
  const aisle = [0, 1, 2, 3, 4].map((i) =>
    `<circle cx="${1296 + i * 14}" cy="${708 + i * 44}" r="${(2.4 + i * 0.9).toFixed(1)}" fill="#ffb54d"/>`).join("");

  const dark = `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="seatBack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#2e1114"/><stop offset=".45" stop-color="#19070a"/><stop offset="1" stop-color="#090203"/>
        </linearGradient>
        <linearGradient id="seatRim" x1="0" x2="1">
          <stop offset="0" stop-color="#ffe4c4" stop-opacity=".04"/><stop offset="1" stop-color="#cfe0ff" stop-opacity=".55"/>
        </linearGradient>
        <radialGradient id="screenSpill" cx="1.05" cy=".55" r=".75">
          <stop offset="0" stop-color="#8fa9ea" stop-opacity=".16"/><stop offset="1" stop-color="#8fa9ea" stop-opacity="0"/>
        </radialGradient>
        <filter id="soft"><feGaussianBlur stdDeviation="2.2"/></filter>
        <filter id="glow"><feGaussianBlur stdDeviation="4"/></filter>
        <symbol id="seat" overflow="visible">
          <rect x="-12" y="74" width="22" height="70" rx="8" fill="#070203"/>
          <path d="M-9 79h16" stroke="#ffe4c4" stroke-opacity=".14" stroke-width="2" stroke-linecap="round"/>
          <path d="M14 140V36Q14 8 42 8H70Q98 8 98 36V140Z" fill="url(#seatBack)"/>
          <path d="M26 138V44Q26 22 46 22H66Q86 22 86 44V138" fill="none" stroke="#000" stroke-opacity=".5" stroke-width="3"/>
          <path d="M20 34Q20 14 42 14H70Q92 14 92 34" fill="none" stroke="url(#seatRim)" stroke-width="2.6" stroke-linecap="round"/>
        </symbol>
      </defs>
      <rect width="1600" height="900" fill="url(#screenSpill)"/>
      <g opacity=".5" filter="url(#soft)">${seatRow(702, 0.5, -20)}</g>
      ${head(470, 738, 0.62)}${head(1010, 742, 0.6)}
      <g opacity=".78">${seatRow(752, 0.72, -60)}</g>
      ${head(760, 806, 0.86)}
      <g>${seatRow(822, 1.02, -95)}</g>
      <g filter="url(#glow)" opacity=".9">${aisle}</g>${aisle}
    </svg>`;

  const light = `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMaxYMax slice">
      <defs>
        <linearGradient id="cyclo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#6e5a3c" stop-opacity="0"/>
          <stop offset=".32" stop-color="#6e5a3c" stop-opacity=".11"/>
          <stop offset=".5" stop-color="#fffdf7" stop-opacity=".35"/>
          <stop offset="1" stop-color="#6e5a3c" stop-opacity=".13"/>
        </linearGradient>
        <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#5a5650"/><stop offset=".35" stop-color="#2a2826"/><stop offset="1" stop-color="#151413"/>
        </linearGradient>
        <radialGradient id="lens" cx=".45" cy=".45" r=".6">
          <stop offset="0" stop-color="#fffdf2"/><stop offset=".55" stop-color="#ffe2a6"/><stop offset="1" stop-color="#c8954a"/>
        </radialGradient>
        <linearGradient id="diffuser" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#f6efe0"/>
        </linearGradient>
        <linearGradient id="cone" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffe2a6" stop-opacity=".45"/><stop offset="1" stop-color="#ffe2a6" stop-opacity="0"/>
        </linearGradient>
        <radialGradient id="pool">
          <stop offset="0" stop-color="#fff8e4" stop-opacity=".95"/><stop offset="1" stop-color="#fff8e4" stop-opacity="0"/>
        </radialGradient>
        <filter id="blur8"><feGaussianBlur stdDeviation="8"/></filter>
        <filter id="blur24"><feGaussianBlur stdDeviation="24"/></filter>
      </defs>

      <!-- sol cyclo : la courbe entre le mur et le sol -->
      <rect y="470" width="1600" height="430" fill="url(#cyclo)"/>
      <ellipse cx="760" cy="842" rx="360" ry="54" fill="url(#pool)"/>

      <!-- marques au sol, en perspective -->
      <g opacity=".85">
        <path d="M512 852l70-4 1 5-70 4z M544 850l7-.5 15 20-7 .5z" fill="#e3b323"/>
        <path d="M286 878l46-3 1 4-46 3z M304 870l6-.4 10 16-6 .4z" fill="#d0463b"/>
      </g>

      <g class="gear" transform="translate(1600 900) scale(.7) translate(-1600 -900)">
        <!-- lumière du fresnel vers le sol -->
        <path d="M1148 492L1148 560L640 880L360 880Z" fill="url(#cone)" filter="url(#blur24)" opacity=".7"/>

        <!-- câble -->
        <path d="M1212 880C1120 892 1010 870 900 884S640 898 470 880S190 896 -20 884" fill="none" stroke="#1f1d1b" stroke-width="6" stroke-linecap="round"/>
        <path d="M1212 878C1120 890 1010 868 900 882" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="1.5"/>

        <!-- trépied + fresnel -->
        <ellipse cx="1212" cy="884" rx="120" ry="12" fill="#5a4630" opacity=".28" filter="url(#blur8)"/>
        <path d="M1212 740L1128 884M1212 740L1300 884M1212 740L1218 896" stroke="#262422" stroke-width="7" stroke-linecap="round"/>
        <path d="M1212 742V590" stroke="#2d2b28" stroke-width="10" stroke-linecap="round"/>
        <rect x="1203" y="640" width="18" height="16" rx="3" fill="#3a3733"/>
        <g transform="rotate(-16 1212 528)">
          <path d="M1170 540Q1170 600 1212 600Q1254 600 1254 540" fill="none" stroke="#2d2b28" stroke-width="8"/>
          <rect x="1150" y="482" width="150" height="96" rx="12" fill="url(#metal)"/>
          <path d="M1196 486v-12M1216 486v-12M1236 486v-12M1256 486v-12M1276 486v-12" stroke="#2a2826" stroke-width="5" stroke-linecap="round"/>
          <ellipse cx="1150" cy="530" rx="18" ry="46" fill="#1a1918"/>
          <ellipse cx="1146" cy="530" rx="15" ry="40" fill="url(#lens)"/>
          <path d="M1146 498a9 32 0 0 0 0 64M1146 508a5 22 0 0 0 0 44" fill="none" stroke="#c8954a" stroke-opacity=".5" stroke-width="1.5"/>
          <path d="M1150 484L1094 462L1096 470L1150 492ZM1150 576L1094 598L1096 590L1150 568Z" fill="#222120"/>
          <ellipse cx="1132" cy="530" rx="40" ry="70" fill="#fff6dc" opacity=".55" filter="url(#blur24)"/>
        </g>

        <!-- boîte à lumière sur C-stand -->
        <ellipse cx="1520" cy="880" rx="130" ry="13" fill="#5a4630" opacity=".25" filter="url(#blur8)"/>
        <path d="M1528 790L1436 870M1528 790L1610 862M1528 790L1540 890" stroke="#262422" stroke-width="7" stroke-linecap="round"/>
        <rect x="1446" y="852" width="44" height="22" rx="9" fill="#6f6355"/>
        <path d="M1528 792V330" stroke="#2d2b28" stroke-width="9" stroke-linecap="round"/>
        <circle cx="1528" cy="560" r="9" fill="#3a3733"/><circle cx="1528" cy="330" r="11" fill="#3a3733"/>
        <path d="M1528 330L1560 290" stroke="#2d2b28" stroke-width="9" stroke-linecap="round"/>
        <path d="M1272 186L1434 128L1448 432L1290 448Z" fill="#fffef8" filter="url(#blur24)" opacity=".95"/>
        <path d="M1434 128L1556 210L1566 356L1448 432Z" fill="#1d1b19"/>
        <path d="M1434 128L1556 210M1448 432L1566 356" stroke="#3b3834" stroke-width="2"/>
        <path d="M1272 186L1434 128L1448 432L1290 448Z" fill="url(#diffuser)" stroke="#262422" stroke-width="7" stroke-linejoin="round"/>
      </g>
    </svg>`;

  const set = document.createElement("div");
  set.className = "set";
  set.setAttribute("aria-hidden", "true");
  set.innerHTML = `<div class="set__dark">${dark}</div><div class="set__light">${light}</div>`;
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
