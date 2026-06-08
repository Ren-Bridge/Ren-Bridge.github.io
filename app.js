/* RenBridge — progressive enhancement (design language from Stablecoin Swap).
   The page is fully meaningful with JS OFF. This script only:
     1) animates the hero widget so the destination icon morphs through the real
        wrapped-BTC variants ("bridge BTC to any chain"), with BTC fixed as source,
     2) wires the flip button, 3) lets a variant card briefly preview itself in the
        widget while its link opens the real issuer, 4) runs the mobile nav toggle.
   No wallet connect, no quotes, no network calls. */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var BTC = { ticker: "BTC", src: "icons/btc.png", name: "Bitcoin" };

  /* ---- destination pool from the real variant cards already in the DOM ---- */
  function buildPool() {
    var seen = {}, pool = [];
    document.querySelectorAll(".swap-now").forEach(function (a) {
      var t = a.getAttribute("data-ticker"), src = a.getAttribute("data-icon");
      if (t && src && !seen[t]) { seen[t] = 1; pool.push({ ticker: t, src: src, name: a.getAttribute("data-name") || "" }); }
    });
    return pool;
  }

  function setSlot(slot, tok) {
    if (!slot) return;
    var morph = slot.querySelector(".token-icon-morph");
    var label = slot.querySelector(".token-ticker");
    var img = morph && morph.querySelector("img");
    if (!morph) return;
    if (!img) { img = document.createElement("img"); img.width = 28; img.height = 28; morph.appendChild(img); }
    img.classList.remove("is-active");                         // flip out
    window.setTimeout(function () {
      img.src = tok.src; img.alt = tok.ticker + " logo";
      if (label) label.textContent = tok.ticker;
      img.classList.add("is-active");                          // flip in
    }, reduce ? 0 : 380);
  }

  function initWidget(pool) {
    var widget = document.getElementById("app-widget");
    if (!widget) return;
    var from = widget.querySelector('.token-chip[data-slot="from"]');
    var to   = widget.querySelector('.token-chip[data-slot="to"]');
    if (!from || !to) return;

    var flipped = false;                                       // false: BTC -> variant
    var j = pool.findIndex(function (p) { return p.ticker === "WBTC"; }); if (j < 0) j = 0;

    function render() {
      var dest = pool.length ? pool[j] : { ticker: "WBTC", src: "icons/wbtc.png" };
      setSlot(from, flipped ? dest : BTC);
      setSlot(to,   flipped ? BTC : dest);
    }
    render();

    var paused = false;
    if (!reduce && pool.length) {
      window.setInterval(function () {
        if (paused) return;
        j = (j + 1) % pool.length;
        render();
      }, 2300);
    }

    var flip = widget.querySelector(".swap-flip");
    if (flip) flip.addEventListener("click", function () {
      flipped = !flipped; render(); flip.classList.toggle("spin");
    });

    /* variant card: preview it as the destination, then let the link open the issuer */
    document.querySelectorAll(".swap-now").forEach(function (a) {
      a.addEventListener("click", function () {
        var t = a.getAttribute("data-ticker");
        var idx = pool.findIndex(function (p) { return p.ticker === t; });
        if (idx < 0) return;                                   // fallback (no icon): just follow link
        flipped = false; j = idx; render();
        paused = true; widget.classList.add("flash");
        window.setTimeout(function () { widget.classList.remove("flash"); paused = false; }, 4200);
      });
    });
  }

  function initNav() {
    var btn = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".site-nav");
    if (!btn || !nav) return;
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); });
    });
  }

  function ready(fn) { document.readyState !== "loading" ? fn() : document.addEventListener("DOMContentLoaded", fn); }
  ready(function () { initWidget(buildPool()); initNav(); });
})();
