// effects.js - arte arte lang
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var navbar = document.querySelector(".navbar");
  function onScroll() {
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 20);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // 2. Floating white particles in the background
  var layer = document.createElement("div");
  layer.className = "fx-particles";
  layer.setAttribute("aria-hidden", "true");
  var count = window.innerWidth < 600 ? 8 : 16;
  for (var i = 0; i < count; i++) {
    var p = document.createElement("span");
    var size = 4 + Math.random() * 9;
    p.className = "fx-particle";
    p.style.width = p.style.height = size + "px";
    p.style.left = Math.random() * 100 + "%";
    p.style.animationDuration = (reduce ? 0 : 12 + Math.random() * 16) + "s";
    p.style.animationDelay = reduce ? "0s" : (-Math.random() * 20 + "s");
    p.style.setProperty("--dx", (Math.random() * 120 - 60) + "px");
    p.style.setProperty("--o", (reduce ? 0.28 : 0.35 + Math.random() * 0.45).toFixed(2));
    p.style.animationDuration = (12 + Math.random() * 16) + "s";    layer.appendChild(p);
  }
  document.body.appendChild(layer);

  // 3. Click ripple on the outline of buttons and cards
  document.addEventListener("click", function (e) {
    var target = e.target.closest(".get-started, #complete-btn, .place-card");
    if (!target) return;
    var rect = target.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height);
    var ripple = document.createElement("span");
    ripple.className = "fx-ripple";
    ripple.style.width = ripple.style.height = size / 2 + "px";
    ripple.style.left = e.clientX - rect.left - size / 4 + "px";
    ripple.style.top = e.clientY - rect.top - size / 4 + "px";
    target.appendChild(ripple);
    setTimeout(function () { ripple.remove(); }, 650);
  });

  // 4. Flash text on the Navigate page when it changes
var ids = ["current-place-name", "current-place-desc", "navigate-message"];  ids.forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    new MutationObserver(function () {
      el.classList.remove("fx-flash");
      void el.offsetWidth;            // restart the animation
      el.classList.add("fx-flash");
    }).observe(el, { childList: true, characterData: true, subtree: true });
  });
})();
