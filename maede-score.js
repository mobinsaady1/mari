(() => {
"use strict";
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fa = n => String(n).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);
const clamp = v => Math.max(40, Math.min(100, Math.round(v)));
const hsl = h => { const n = parseInt(h.slice(1), 16), r = (n >> 16 & 255) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn; let H = 0;
  if (d) { H = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; H = (H * 60 + 360) % 360; } return { h: H, s: d ? d / (1 - Math.abs(2 * l - 1)) : 0, l }; };
const harm = (a, b) => { if (!a || !b) return .85; const x = hsl(a), y = hsl(b); if (x.s < .18 || y.s < .18 || x.l < .16 || y.l < .16 || x.l > .9 || y.l > .9) return .95;
  let d = Math.abs(x.h - y.h); d = Math.min(d, 360 - d); return d < 30 ? .9 : d > 150 ? .85 : (d >= 90 && d <= 130) ? .68 : .45; };
const g = (s, k) => $(s)?.dataset[k];
function state() { return { model: g(".model-options .choice-button.selected", "model") || "ballgown", dress: g(".color-choice.selected", "color") || "#b995ed", fabric: g(".fabric-choice.selected", "fabric") || "silk",
  skirt: g("[data-skirt-shape].selected", "skirtShape") || "auto", neck: $("#necklineOptions")?.value, sleeve: $("#sleeveOptions")?.value, len: +($("#dressLengthOptions")?.value ?? 2),
  acc: $$(".accessory-button.selected").map(b => b.dataset.accessory), extras: $$("[data-extra].selected").map(b => b.dataset.extra),
  tone: g(".accessory-tone.selected", "accessoryTone"), metal: g(".accessory-metal.selected", "accessoryMetal"), bag: g(".bag-color[data-bag-color].selected", "bagColor"), glove: g(".glove-color.selected", "gloveColor"), hair: $("#hairStyleOptions")?.value }; }
function score() {
  const s = state(), A = new Set(s.acc), n = A.size, cs = [];
  if (["necklace", "earring", "crown", "bracelet", "belt"].some(k => A.has(k))) cs.push(harm(s.dress, s.tone), harm(s.dress, s.metal));
  if (A.has("bag")) cs.push(harm(s.dress, s.bag)); if (A.has("glove")) cs.push(harm(s.dress, s.glove));
  const color = clamp(58 + 42 * (cs.length ? cs.reduce((a, b) => a + b) / cs.length : .85));
  let p = 74; const big = ["ballgown", "royal", "bridal", "fairy"].includes(s.model), tight = ["slim", "mermaid", "trumpet"].includes(s.model);
  if (big && s.len === 2) p += 12; if (big && s.len === 0) p -= 14; if (tight && s.len >= 1) p += 10; if (s.model === "bubble" && s.len === 0) p += 14;
  if (s.sleeve === "none" && s.neck === "offshoulder") p -= 10; if (s.neck === "offshoulder" && s.model === "offshoulder") p += 10;
  if (s.sleeve === "long" && ["bubble", "offshoulder"].includes(s.model)) p -= 8; if (s.sleeve === "puff" && big) p += 6; if (s.model === "bridal" && s.extras.includes("train")) p += 4;
  const prop = clamp(p);
  let a = [52, 74, 88, 97, 96, 84, 72, 62, 55, 50][n] ?? 50; if (A.has("cape") && A.has("crown")) a += 3; if (A.has("glasses") && A.has("crown")) a -= 6;
  const F = { silk: ["mermaid", "slim", "bridal", "royal", "trumpet"], satin: ["mermaid", "trumpet", "slim", "bridal", "ballgown"], lace: ["vintage", "bridal", "a-line", "tulip"], floral: ["a-line", "tulip", "bubble", "tiered", "fairy"], glitter: ["mermaid", "trumpet", "bubble", "fairy", "highlow"] };
  const fab = F[s.fabric]?.includes(s.model) ? 96 : 74;
  let h = 0; for (const ch of JSON.stringify(s)) h = (h * 31 + ch.charCodeAt(0)) % 7;
  const cre = clamp(50 + s.extras.length * 9 + (s.skirt !== "auto" ? 7 : 0) + (s.neck !== "sweetheart" ? 5 : 0) + (s.sleeve !== "puff" ? 5 : 0) + (s.fabric !== "silk" ? 6 : 0) + (s.hair !== "down" ? 6 : 0) + (["tulip", "trumpet", "bubble", "tiered", "bridal", "highlow", "fairy"].includes(s.model) ? 8 : 0) + h - 3);
  const parts = [["🎨 هماهنگی رنگ", color, "color"], ["📐 تناسب و استایل", prop, "prop"], ["💎 تعادل اکسسوری", clamp(a), "acc"], ["🧵 انتخاب پارچه", fab, "fab"], ["✨ خلاقیت", cre, "cre"]];
  const total = Math.round(color * .25 + prop * .2 + clamp(a) * .2 + fab * .15 + cre * .2);
  return { total, parts };
}
const titles = [[93, "ملکه‌ی مد 👑"], [86, "طراح درخشان ✨"], [78, "استایلیست خوش‌سلیقه 🌸"], [68, "طراح در حال رشد 🌷"], [0, "شروعِ قشنگیه 🌱"]];
const tips = { color: "رنگ جواهر و فلز رو با رنگ لباس هماهنگ‌تر کن (رنگ‌های نزدیک یا مکمل).", prop: "طول و آستین رو با مدل لباس هماهنگ کن؛ مثلاً پرنسسی و عروس بلند قشنگ‌ترن.", acc: "بین ۳ تا ۴ اکسسوری بهترین تعادله؛ نه خیلی کم، نه خیلی شلوغ.", fab: "پارچه‌ی دیگه‌ای امتحان کن؛ هر مدل یه پارچه‌ی محبوب داره.", cre: "از جزئیات خاص مثل پاپیون، دنباله یا گل‌های برجسته استفاده کن." };
const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };

// امتیاز زنده
const lay = $(".boutique-layout");
if (lay) {
  const chip = el("div", "mp-live"); $(".mp-studio")?.prepend(chip);
  const live = () => setTimeout(() => { chip.textContent = "🎯 امتیاز لحظه‌ای: " + fa(score().total) + " از ۱۰۰"; }, 90);
  lay.addEventListener("click", live); lay.addEventListener("change", live); lay.addEventListener("input", live); live();

  $("#finishDesignBtn")?.addEventListener("click", () => {
    const box = $("#designReward"); if (!box) return; $(".mp-score", box)?.remove();
    const r = score(), best = (() => { try { const b = Math.max(+localStorage.getItem("MAEDE_BEST") || 0, r.total); localStorage.setItem("MAEDE_BEST", b); return b; } catch { return r.total; } })();
    const card = el("div", "mp-score"), num = el("div", "mp-total", "۰"), stars = Math.max(1, Math.round(r.total / 20));
    card.append(el("div", "mp-stars", "★".repeat(stars) + "☆".repeat(5 - stars)), num, el("div", "mp-title", titles.find(t => r.total >= t[0])[1]));
    r.parts.forEach(([l, v]) => { const row = el("div", "mp-row"), bar = el("div", "mp-bar-fill"); const track = el("div", "mp-track"); track.append(bar);
      row.append(el("span", null, l), track, el("b", null, fa(v))); card.append(row); setTimeout(() => { bar.style.width = v + "%"; }, 60); });
    const low = [...r.parts].sort((a, b) => a[1] - b[1])[0];
    card.append(el("p", "mp-tip", r.total >= 92 ? "عالیه! تقریباً بی‌نقص شد 💜" : "💡 نکته: " + tips[low[2]]), el("p", "mp-best", "🏆 بهترین امتیاز تو: " + fa(best)));
    box.insertBefore(card, $("#finalDesignPreview")); let t0 = null;
    const tick = ts => { t0 ??= ts; const k = Math.min(1, (ts - t0) / 1200); num.textContent = fa(Math.round(r.total * k)) + " / ۱۰۰"; if (k < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick);
  });
}
})();
