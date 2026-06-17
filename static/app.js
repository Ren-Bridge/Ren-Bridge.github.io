/* Bridge WETH — progressive enhancement only.
   All SEO content lives in the HTML source; this script only animates the
   preview widget (cycles the destination network) and the mobile menu. */
(function () {
  "use strict";
  var R = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var NETS = [
    { n: "Arbitrum",   i: "static/arbitrum.png" },
    { n: "Base",       i: "static/base.png" },
    { n: "Optimism",   i: "static/optimism.png" },
    { n: "Polygon",    i: "static/polygon.png" },
    { n: "zkSync Era", i: "static/zksync.png" },
    { n: "Linea",      i: "static/linea.png" },
    { n: "Scroll",     i: "static/scroll.png" }
  ];

  var idx = 0, timer = null;
  var nameEl = document.getElementById("net-name");
  var iconEl = document.getElementById("net-icon");

  function paint() {
    if (!nameEl || !iconEl) return;
    var o = NETS[idx];
    if (R) { nameEl.textContent = o.n; iconEl.src = o.i; return; }
    nameEl.style.transition = "opacity .25s"; iconEl.style.transition = "opacity .25s";
    nameEl.style.opacity = "0"; iconEl.style.opacity = "0";
    setTimeout(function () {
      nameEl.textContent = o.n; iconEl.src = o.i;
      nameEl.style.opacity = "1"; iconEl.style.opacity = "1";
    }, 220);
  }
  function next() { idx = (idx + 1) % NETS.length; paint(); }
  function restart() { if (timer) clearInterval(timer); if (!R) timer = setInterval(next, 2300); }

  function widget() {
    if (!nameEl) return;
    paint();
    restart();
    var sw = document.querySelector(".bw-switch");
    if (sw) sw.addEventListener("click", function () { sw.classList.toggle("spin"); next(); restart(); });
  }

  function nav() {
    var b = document.querySelector(".nav-toggle"), n = document.querySelector(".site-nav");
    if (!b || !n) return;
    b.addEventListener("click", function () {
      var o = n.classList.toggle("open");
      b.setAttribute("aria-expanded", o ? "true" : "false");
    });
    n.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { n.classList.remove("open"); });
    });
  }

  function go(f) { document.readyState !== "loading" ? f() : document.addEventListener("DOMContentLoaded", f); }
  go(function () { widget(); nav(); });
})();
