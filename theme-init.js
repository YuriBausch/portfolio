// Applique le thème mémorisé avant le premier rendu (évite un flash de thème).
// Chargé de façon synchrone dans le <head> : la CSP n'autorise plus les scripts inline.
(function () {
  try {
    var t = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", t);
  } catch (e) {}
})();
