(() => {
"use strict";
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
const rnd = a => a[Math.floor(Math.random() * a.length)];
const mk = (cls, txt, css = {}) => { const e = document.createElement("span"); e.className = cls; e.textContent = txt; Object.assign(e.style, css); document.body.appendChild(e); return e; };
const gone = e => e.addEventListener("animationend", () => e.remove());

// ✦ رد درخشان نشانگر (همه‌ی صفحه‌ها)
if (!calm) { let last = 0; addEventListener("pointermove", e => { const n = performance.now(); if (n - last < 70) return; last = n; gone(mk("mp-trail", rnd(["✦", "✧", "·", "♡"]), { left: e.clientX + "px", top: e.clientY + "px" })); }); }

// 🌸 گلبرگ‌های شناور (فقط باغ و مزون)
if (!calm && $("#gardenStage")) { const box = document.createElement("div"); box.className = "mp-petals"; box.setAttribute("aria-hidden", "true");
  for (let i = 0; i < 16; i++) { const p = document.createElement("span"); p.textContent = rnd(["🌸", "✿", "❀", "🌷", "✦"]);
    p.style.cssText = `left:${Math.random() * 100}%;font-size:${12 + Math.random() * 16}px;animation-duration:${12 + Math.random() * 14}s;animation-delay:-${Math.random() * 20}s`; box.appendChild(p); }
  document.body.prepend(box); }

// 🎉 کنفتی
function confetti(n = 46) { if (calm) return; for (let i = 0; i < n; i++) gone(mk("mp-confetti", rnd(["✦", "💜", "🌸", "✧", "🎀", "✨"]), { left: Math.random() * 100 + "vw", fontSize: 10 + Math.random() * 16 + "px", animationDuration: 2.2 + Math.random() * 2 + "s", animationDelay: Math.random() * .5 + "s" })); }
const watch = (el, fn) => { if (el) new MutationObserver(() => fn(el)).observe(el, { attributes: true, attributeFilter: ["class", "hidden"] }); };

// باغ: امتیاز شناور + جشن پایان
document.addEventListener("click", e => { const f = e.target.closest(".flower-card"); if (f && !f.disabled && !calm) gone(mk("mp-pop", "+۱۰ ✨", { left: e.clientX + "px", top: e.clientY + "px" })); });
let gWon = false; watch($("#gardenReward"), el => { const on = !el.classList.contains("hidden"); if (on && !gWon) confetti(); gWon = on; });
let sWon = false; watch($("#reward"), el => { const on = !el.classList.contains("hidden"); if (on && !sWon) confetti(60); sWon = on; });

// مرحله آخر: نامه حرف‌به‌حرف تایپ می‌شود
const letterSec = $("#letterSection"), letterMsg = $("#letterMessage");
if (letterSec && letterMsg && !calm) { let t; watch(letterSec, el => { if (el.hidden) return; const full = letterMsg.textContent; if (!full) return; clearInterval(t); letterMsg.textContent = ""; let i = 0;
  t = setInterval(() => { i += 2; letterMsg.textContent = full.slice(0, i); if (i >= full.length) { clearInterval(t); letterMsg.textContent = full; } }, 30); }); }

// ✨ مزون
const lay = $(".boutique-layout");
if (lay) {
  const btn = (t, fn, c = "") => { const b = document.createElement("button"); b.type = "button"; b.className = "mp-chip " + c; b.textContent = t; b.addEventListener("click", fn); return b; };
  const pick = sel => rnd($$(sel))?.click();
  const setSel = id => { const s = $("#" + id); if (!s) return; s.selectedIndex = Math.floor(Math.random() * s.options.length); s.dispatchEvent(new Event("change", { bubbles: true })); };
  const epi = ["رؤیایی", "افسانه‌ای", "سلطنتی", "مهتابی", "بی‌همتا", "شاعرانه"];
  function note() { setTimeout(() => { const t = $("#mpStyleName"); if (!t) return;
    const m = $("#summaryModel")?.textContent || "", c = $("#summaryColor")?.textContent || "", f = $(".fabric-choice.selected strong")?.textContent || "";
    let h = 0; for (const ch of m + c + f) h = (h * 31 + ch.charCodeAt(0)) % 997;
    t.textContent = `✦ ${m} ${c}، پارچه‌ی ${f} · ${epi[h % epi.length]}`; }, 60); }
  function surprise() {
    pick(".model-options .choice-button"); pick(".color-choice"); pick(".fabric-choice"); pick("[data-skirt-shape]");
    ["necklineOptions", "sleeveOptions", "necklaceStyle", "bagStyle", "earringStyle", "crownStyle", "gloveStyle", "glassesStyle", "capeStyle", "beltStyle", "braceletStyle", "hairStyleOptions"].forEach(setSel);
    $$("[data-extra]").forEach(b => { if ((Math.random() < .25) !== b.classList.contains("selected")) b.click(); });
    const L = $("#dressLengthOptions"); if (L) { L.value = Math.floor(Math.random() * 3); L.dispatchEvent(new Event("input", { bubbles: true })); }
    $$(".accessory-button").forEach(b => { if ((Math.random() < .4) !== b.classList.contains("selected")) b.click(); });
    [".accessory-tone", ".accessory-metal", ".bag-color[data-bag-color]", ".glove-color", ".hair-color"].forEach(pick);
    $("#designMessage").textContent = "🎲 یک استایل غافلگیرکننده ساخته شد! دوستش داری؟ یا دوباره بزن.";
    note(); confetti(18);
  }
  function snap() { const M = window.maede3d; if (!M) return null; M.renderer.render(M.scene, M.camera); return M.renderer.domElement.toDataURL("image/png"); }
  const save = () => { const u = snap(); if (!u) return; const a = document.createElement("a"); a.href = u; a.download = "maede-design.png"; a.click(); };

  const bar = document.createElement("div"); bar.className = "mp-bar";
  bar.append(btn("🎲 غافلگیرم کن", surprise, "mp-main"));
  [["👗 مدل", ".model-options"], ["🎨 رنگ", ".color-options"], ["🧵 پارچه", ".fabric-studio"], ["💎 اکسسوری", ".accessory-options"]]
    .forEach(([t, s]) => bar.append(btn(t, () => $(s)?.scrollIntoView({ behavior: "smooth", block: "center" }))));
  $(".controls-card")?.prepend(bar);

  const stud = document.createElement("div"); stud.className = "mp-studio";
  const name = document.createElement("div"); name.id = "mpStyleName"; name.className = "mp-name"; stud.append(name);
  [["🌙 شب", 0x21172c], ["🌸 صورتی", 0x4a2540], ["🌿 نعنایی", 0x1d3a36], ["✨ طلایی", 0x3a2f1c]]
    .forEach(([t, c]) => stud.append(btn(t, () => { const M = window.maede3d; if (M) M.scene.background = new M.THREE.Color(c); }, "mp-theme")));
  stud.append(btn("📸 عکس", save, "mp-main"));
  $(".dress-scene")?.after(stud);
  lay.addEventListener("click", note); lay.addEventListener("change", note); note();

  // کارت نهایی با عکس طراحی
  $("#finishDesignBtn")?.addEventListener("click", () => { confetti(70);
    const u = snap(), box = $("#finalDesignPreview"); if (!u || !box) return;
    $$(".mp-card", box).forEach(n => n.remove());
    const w = document.createElement("figure"); w.className = "mp-card";
    const img = new Image(); img.src = u; img.alt = "طراحی نهایی";
    const cap = document.createElement("figcaption"); cap.textContent = $("#mpStyleName")?.textContent || "";
    const dl = document.createElement("a"); dl.href = u; dl.download = "maede-design.png"; dl.textContent = "⬇ ذخیره‌ی عکس طراحی";
    w.append(img, cap, dl); box.prepend(w); });
}
})();
