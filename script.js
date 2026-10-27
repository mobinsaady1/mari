
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ------------------------------
// مدیریت مرحله‌ها
// ------------------------------

const gardenStage = $("#gardenStage");
const boutiqueStage = $("#boutiqueStage");

function showStage(stageName) {
  const isGarden = stageName === "garden";

  gardenStage.classList.toggle("active", isGarden);
  boutiqueStage.classList.toggle("active", !isGarden);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

$("#openBoutiqueBtn").addEventListener("click", () => {
  showStage("boutique");
});

$("#backToGardenBtn").addEventListener("click", () => {
  showStage("garden");
});

$("#editDesignBtn").addEventListener("click", () => {
  $("#designReward").classList.add("hidden");
  $("#finishDesignBtn").disabled = false;
  $("#designMessage").textContent = "هر وقت آماده بودی، دوباره طرحت رو ثبت کن.";
  showStage("boutique");
});

$("#homeLink").addEventListener("click", (event) => {
  event.preventDefault();
  showStage("garden");
});

// ------------------------------
// مرحله اول: باغ گل‌ها
// ------------------------------

const flowers = [
  { emoji: "🌷", name: "لاله" },
  { emoji: "🌹", name: "رز" },
  { emoji: "🌸", name: "شکوفه" },
  { emoji: "🌺", name: "گل استوایی" },
  { emoji: "🌼", name: "بابونه" },
  { emoji: "🪻", name: "سنبل" },
  { emoji: "🌻", name: "آفتابگردان" },
  { emoji: "💐", name: "دسته گل" },
  { emoji: "🪷", name: "نیلوفر" },
  { emoji: "🏵️", name: "گل زینتی" },
  { emoji: "🥀", name: "گل مخملی" },
  { emoji: "🌱", name: "جوانه" }
];

const flowerGrid = $("#flowerGrid");
const collectedFlowers = new Set();

const numberFa = (value) =>
  new Intl.NumberFormat("fa-IR").format(value);

function renderFlowers() {
  flowerGrid.replaceChildren();

  flowers.forEach((flower, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "flower-card";
    card.dataset.index = String(index);

    const emoji = document.createElement("span");
    emoji.className = "flower-emoji";
    emoji.textContent = flower.emoji;

    const name = document.createElement("span");
    name.className = "flower-name";
    name.textContent = flower.name;

    card.append(emoji, name);

    if (collectedFlowers.has(index)) {
      card.classList.add("collected");
      card.disabled = true;
      card.setAttribute("aria-label", flower.name + " پیدا شده");
    } else {
      card.setAttribute("aria-label", "پیدا کردن " + flower.name);

      card.addEventListener("click", () => {
        collectFlower(index, card);
      });
    }

    flowerGrid.append(card);
  });
}

function updateGardenStats() {
  const count = collectedFlowers.size;
  const required = 8;

  $("#flowerCount").textContent =
    `${numberFa(count)} از ${numberFa(required)}`;

  $("#score").textContent = numberFa(count * 10);

  $("#gardenProgress").style.width =
    `${Math.min((count / required) * 100, 100)}%`;

  if (count >= required) {
    $("#gardenReward").classList.remove("hidden");
    $("#gardenMessage").textContent =
      "همه‌ی گل‌های لازم رو پیدا کردی؛ دروازه‌ی مزون باز شد!";
  }
}

function collectFlower(index, card) {
  if (collectedFlowers.has(index)) return;

  collectedFlowers.add(index);

  card.classList.add("collected");
  card.disabled = true;

  $("#gardenMessage").textContent =
    `چه انتخاب قشنگی! ${flowers[index].name} رو پیدا کردی.`;

  updateGardenStats();
}

$("#hintBtn").addEventListener("click", () => {
  const remaining = flowers
    .map((flower, index) => index)
    .filter((index) => !collectedFlowers.has(index));

  if (remaining.length === 0) {
    $("#gardenMessage").textContent =
      "همه‌ی گل‌های لازم پیدا شدن؛ وقت ورود به مزونه!";
    return;
  }

  const randomIndex =
    remaining[Math.floor(Math.random() * remaining.length)];

  const card = flowerGrid.querySelector(
    `[data-index="${randomIndex}"]`
  );

  if (!card) return;

  card.classList.remove("hint");
  void card.offsetWidth;
  card.classList.add("hint");

  $("#gardenMessage").textContent =
    "یه نگاه دقیق بنداز؛ گل درخشان‌شده رو پیدا کن!";

  card.addEventListener("animationend", () => {
    card.classList.remove("hint");
  }, { once: true });
});

$("#resetGardenBtn").addEventListener("click", () => {
  collectedFlowers.clear();

  $("#gardenReward").classList.add("hidden");
  $("#gardenMessage").textContent =
    "روی گل‌ها کلیک کن تا باغ کم‌کم رازهاش رو برات آشکار کنه.";

  renderFlowers();
  updateGardenStats();
});

renderFlowers();
updateGardenStats();

// ------------------------------
// مرحله دوم: طراحی لباس
// ------------------------------


const models = {
  ballgown: {
    name: "لباس پرنسسی",
    body: `M137 109 Q148 100 160 102 Q172 100 183 109
      L207 148 L187 164 L179 143 L181 208
      L139 208 L141 143 L133 164 L113 148 Z`,
    sleeves: `M136 110 Q125 106 119 122 L111 145
      Q121 157 134 151 L147 126 Z
      M184 110 Q195 106 201 122 L209 145
      Q199 157 186 151 L173 126 Z`,
    skirt: `M139 197 Q160 206 181 197
      Q198 260 226 366 Q192 390 160 382
      Q128 390 94 366 Q122 260 139 197 Z`,
    detail: `M140 119 Q160 139 180 119
      M160 137 L160 351 M125 275 Q160 300 195 275`
  },

  slim: {
    name: "لباس ظریف",
    body: `M137 109 Q148 100 160 102 Q172 100 183 109
      L199 145 L185 160 L177 141 L181 208
      L139 208 L143 141 L135 160 L121 145 Z`,
    sleeves: `M136 110 L123 122 L118 146 L132 151 L147 126 Z
      M184 110 L197 122 L202 146 L188 151 L173 126 Z`,
    skirt: `M139 197 Q160 204 181 197
      L189 260 L199 365 Q160 375 121 365
      L131 260 Z`,
    detail: `M140 119 Q160 139 180 119
      M160 137 L160 355`
  },

  fairy: {
    name: "لباس پری‌گونه",
    body: `M137 109 Q148 100 160 102 Q172 100 183 109
      L207 148 L187 164 L179 143 L181 208
      L139 208 L141 143 L133 164 L113 148 Z`,
    sleeves: `M136 110 Q125 106 119 122 L111 145
      Q121 157 134 151 L147 126 Z
      M184 110 Q195 106 201 122 L209 145
      Q199 157 186 151 L173 126 Z`,
    skirt: `M139 197 Q160 206 181 197
      Q190 235 218 284 Q239 316 231 353
      Q199 373 178 359 L160 377 L142 359
      Q121 373 89 353 Q81 316 102 284
      Q128 235 139 197 Z`,
    detail: `M140 119 Q160 139 180 119
      M160 137 L160 349
      M111 303 Q160 323 209 303`
  },

  mermaid: {
    name: "لباس ماهی",
    body: `M137 109 Q148 100 160 102 Q172 100 183 109
      L207 148 L187 164 L179 143 L181 208
      L139 208 L141 143 L133 164 L113 148 Z`,
    sleeves: `M136 110 L123 122 L118 146 L132 151 L147 126 Z
      M184 110 L197 122 L202 146 L188 151 L173 126 Z`,
    skirt: `M139 197 Q160 204 181 197
      L174 268 Q170 306 177 337
      Q190 354 213 349
      Q207 374 181 381
      Q169 392 160 404
      Q151 392 139 381
      Q113 374 107 349
      Q130 354 143 337
      Q150 306 146 268 Z`,
    detail: `M140 119 Q160 139 180 119
      M160 137 L160 342
      M143 342 Q160 355 177 342`
  },

  royal: {
    name: "لباس سلطنتی",
    body: `M137 109 Q148 100 160 102 Q172 100 183 109
      L207 148 L187 164 L179 143 L181 208
      L139 208 L141 143 L133 164 L113 148 Z`,
    sleeves: `M136 110 Q125 106 119 122 L111 145
      Q121 157 134 151 L147 126 Z
      M184 110 Q195 106 201 122 L209 145
      Q199 157 186 151 L173 126 Z`,
    skirt: `M139 197 Q160 206 181 197
      Q200 256 213 365
      Q188 386 160 383 Q132 386 107 365
      Q120 256 139 197 Z`,
    detail: `M140 119 Q160 139 180 119 M160 137 L160 351 M125 282 Q160 301 195 282`
  },
  "a-line": {
    name: "لباس کلوش کلاسیک",
    sleeves: `M136 110 Q126 108 121 123 L114 144 Q124 153 135 149 L147 126 Z M184 110 Q194 108 199 123 L206 144 Q196 153 185 149 L173 126 Z`,
    skirt: `M140 197 Q160 205 180 197 L202 365 Q160 381 118 365 Z`,
    detail: `M141 119 Q160 137 179 119 M160 137 L160 354 M133 272 L143 355 M187 272 L177 355`
  },
  offshoulder: {
    name: "لباس دکلته",
    body: `M137 112 Q147 119 160 112 Q173 119 183 112 L180 207 L140 207 Z`,
    sleeves: `M135 119 Q126 117 120 131 L114 148 Q124 157 135 149 L145 132 Z M185 119 Q194 117 200 131 L206 148 Q196 157 185 149 L175 132 Z`,
    skirt: `M140 197 Q160 205 180 197 Q193 257 220 365 Q160 388 100 365 Q127 257 140 197 Z`,
    detail: `M140 124 Q160 135 180 124 M160 143 L160 355 M120 310 Q160 329 200 310`
  },
  highlow: {
    name: "لباس های‌لو",
    sleeves: `M136 110 L123 122 L118 146 L132 151 L147 126 Z M184 110 L197 122 L202 146 L188 151 L173 126 Z`,
    skirt: `M140 197 Q160 205 180 197 Q194 244 204 294 Q219 345 240 370 Q199 387 160 380 Q121 387 80 370 Q101 345 116 294 Q126 244 140 197 Z`,
    detail: `M140 119 Q160 139 180 119 M160 137 L160 344 M118 291 Q160 317 202 291`
  },
  pleated: {
    name: "لباس چین‌دار",
    sleeves: `M136 110 Q125 106 119 122 L111 145 Q121 157 134 151 L147 126 Z M184 110 Q195 106 201 122 L209 145 Q199 157 186 151 L173 126 Z`,
    skirt: `M139 197 Q160 206 181 197 L220 365 Q160 388 100 365 Z`,
    detail: `M140 119 Q160 139 180 119 M160 137 L160 350 M128 231 L113 358 M143 225 L137 366 M177 225 L183 366 M192 231 L207 358`
  },
  vintage: {
    name: "لباس وینتیج",
    sleeves: `M136 110 Q124 105 119 121 L110 146 Q121 158 135 150 L147 126 Z M184 110 Q196 105 201 121 L210 146 Q199 158 185 150 L173 126 Z`,
    skirt: `M139 197 Q160 204 181 197 Q194 253 211 364 Q160 382 109 364 Q126 253 139 197 Z`,
    detail: `M140 119 Q160 139 180 119 M160 137 L160 350 M121 270 Q160 293 199 270 M128 320 Q160 340 192 320`
  }
};


const _m = (n, b) => ({ ...models[b], name: n });
Object.assign(models, { tulip: _m("لباس لاله‌ای", "slim"), trumpet: _m("لباس ترامپتی", "mermaid"), bubble: _m("لباس بابل کوتاه", "a-line"), tiered: _m("لباس لایه‌لایه", "pleated"), bridal: _m("لباس عروس", "royal") });
let currentModel = "ballgown";
let currentColor = {
  main: "#b995ed",
  light: "#eadcff",
  dark: "#8c5ac8",
  name: "یاسی"
};

const selectedAccessories = new Set();
let necklaceStyle = "pendant";
let bagStyle = "classic";
let bagColor = { main: "#c6a0e8", dark: "#865bb4", name: "یاسی" };

function applyNecklaceStyle() {
  const chain = $("#necklaceChain");
  const pendant = $("#necklacePendant");
  if (!chain || !pendant) return;
  const variants = {
    pendant: { chain: "M143 105 Q160 135 177 105", pendant: "M155 124 L160 132 L165 124 L160 118 Z", fill: "#f7e7ff", stroke: "#d5ad67", width: 1.5 },
    pearl: { chain: "M143 105 Q160 132 177 105", pendant: "M151 121 Q160 128 169 121", fill: "none", stroke: "#fff0d7", width: 4 },
    choker: { chain: "M143 107 Q160 116 177 107", pendant: "M157 115 L160 120 L163 115 Z", fill: "#e9c6ff", stroke: "#d5ad67", width: 1.2 },
    heart: { chain: "M143 105 Q160 135 177 105", pendant: "M160 133 C156 129 150 125 153 121 C156 117 160 121 160 123 C163 119 168 118 169 123 C170 127 164 131 160 133 Z", fill: "#e77eaa", stroke: "#f5d7a2", width: 1.3 }
  };
  const v = variants[necklaceStyle] || variants.pendant;
  chain.setAttribute("d", v.chain);
  pendant.setAttribute("d", v.pendant);
  pendant.setAttribute("fill", v.fill);
  pendant.setAttribute("stroke", v.stroke);
  pendant.setAttribute("stroke-width", v.width);
}

function applyBagStyle() {
  const shape = $("#bagShape");
  const handle = $("#bagHandle");
  const detail = $("#bagDetail");
  if (!shape || !handle || !detail) return;
  const variants = {
    classic: { shape: "M204 224 Q204 220 209 220 L229 220 Q235 220 235 227 L233 254 Q233 260 227 260 L211 260 Q205 260 205 254 Z", handle: "M206 224 Q219 196 232 224", detail: "M211 238 L219 246 L227 238" },
    clutch: { shape: "M200 230 Q200 225 206 225 L232 225 Q238 225 238 231 L236 251 Q236 256 231 256 L207 256 Q202 256 202 251 Z", handle: "M208 226 Q219 213 230 226", detail: "M214 239 L224 239" },
    round: { shape: "M201 237 A18 18 0 1 0 237 237 A18 18 0 1 0 201 237 Z", handle: "M207 220 Q219 202 231 220", detail: "M214 236 L219 242 L224 236" },
    bow: { shape: "M205 226 Q219 221 233 226 L231 255 Q219 261 207 255 Z", handle: "M207 226 Q219 204 231 226", detail: "M219 237 C212 229 207 237 219 244 C231 237 226 229 219 237 Z" }
  };
  const v = variants[bagStyle] || variants.classic;
  shape.setAttribute("d", v.shape);
  shape.setAttribute("fill", bagColor.main);
  shape.setAttribute("stroke", bagColor.dark);
  handle.setAttribute("d", v.handle);
  detail.setAttribute("d", v.detail);
}

function selectModel(modelKey) {
  if (!models[modelKey]) return;

  currentModel = modelKey;

  $$(".model-options .choice-button").forEach((button) => {
    button.classList.toggle(
      "selected",
      button.dataset.model === modelKey
    );
  });

  $("#summaryModel").textContent = models[modelKey].name;

  
$("#dressSleeves").setAttribute("d", models[modelKey].sleeves);
  $("#dressSkirt").setAttribute("d", models[modelKey].skirt);
  $("#dressDetail").setAttribute("d", models[modelKey].detail);
}

function selectColor(button) {
  currentColor = {
    main: button.dataset.color,
    light: button.dataset.light,
    dark: button.dataset.dark,
    name: button.dataset.colorName
  };

  $$(".color-choice").forEach((choice) => {
    choice.classList.toggle("selected", choice === button);
  });

  $("#fabricLight").setAttribute("stop-color", currentColor.light);
  $("#fabricDark").setAttribute("stop-color", currentColor.dark);

  $("#summaryColor").textContent = currentColor.name;
}


function toggleAccessory(accessoryName, button) {
  const accessory = $("#" + accessoryName + "Accessory");
  if (!accessory) return;

  if (selectedAccessories.has(accessoryName)) {
    selectedAccessories.delete(accessoryName);
    accessory.classList.add("hidden");
    button.classList.remove("selected");
    button.querySelector("b").textContent = "+";
  } else {
    selectedAccessories.add(accessoryName);
    accessory.classList.remove("hidden");
    button.classList.add("selected");
    button.querySelector("b").textContent = "✓";
  }

  updateAccessorySummary();
}

$$(".model-options .choice-button").forEach((button) => {
  button.addEventListener("click", () => {
    selectModel(button.dataset.model);
    $("#designMessage").textContent =
      "مدل جدید انتخاب شد؛ حالا رنگ و جزئیاتش رو تغییر بده.";
  });
});

$$(".color-choice").forEach((button) => {
  button.addEventListener("click", () => {
    selectColor(button);
    $("#designMessage").textContent =
      `رنگ ${currentColor.name} انتخاب شد. پیش‌نمایش رو ببین!`;
  });
});

$$('.accessory-button').forEach((button) => {
  button.addEventListener("click", () => {
    toggleAccessory(button.dataset.accessory, button);
  });
});

const skirtShapeLabels = {
  auto: "هماهنگ با مدل", "a-line": "فون", ballgown: "پفی", slim: "راسته", mermaid: "ماهی", pleated: "چین‌دار"
};
$$('[data-skirt-shape]').forEach((button) => {
  button.addEventListener("click", () => {
    $$('#summaryShape').forEach((summary) => { summary.textContent = skirtShapeLabels[button.dataset.skirtShape] || "هماهنگ با مدل"; });
  });
});

$("#necklaceStyle")?.addEventListener("change", (event) => {
  necklaceStyle = event.target.value;
  applyNecklaceStyle();
  updateAccessorySummary();
});
$("#bagStyle")?.addEventListener("change", (event) => {
  bagStyle = event.target.value;
  applyBagStyle();
  updateAccessorySummary();
});
["earringStyle", "crownStyle", "glassesStyle", "capeStyle", "beltStyle", "braceletStyle"].forEach((id) => {
  $("#" + id)?.addEventListener("change", updateAccessorySummary);
});
[".accessory-tone", ".accessory-metal"].forEach((selector) => {
  $$(selector).forEach((button) => button.addEventListener("click", () => setTimeout(updateAccessorySummary, 0)));
});
$$(".bag-color[data-bag-color]").forEach((button) => {
  button.addEventListener("click", () => {
    bagColor = { main: button.dataset.bagColor, dark: button.dataset.bagDark, name: button.getAttribute("aria-label") || "رنگ سفارشی" };
    $$(".bag-color[data-bag-color]").forEach((item) => item.classList.toggle("selected", item === button));
    applyBagStyle();
    updateAccessorySummary();
  });
});

function selectedAccessoryOption(id) {
  const select = $("#" + id);
  return select?.selectedOptions?.[0]?.textContent?.trim() || "";
}

function getAccessoryDescription(name) {
  const accessoryNames = { necklace: "گردنبند", earring: "گوشواره", crown: "تاج", bag: "کیف", glove: "دستکش", glasses: "عینک", cape: "شنل", belt: "کمربند جواهری", bracelet: "دستبند" };
  if (name === "necklace") {
    const names = { pendant: "گردنبند آویز الماسی", pearl: "گردنبند مرواریدی", choker: "چوکر ظریف", heart: "گردنبند قلب" };
    return names[necklaceStyle] || accessoryNames[name];
  }
  if (name === "bag") {
    const names = { classic: "کیف دستی کلاسیک", clutch: "کیف کلاچ مجلسی", round: "کیف گرد", bow: "کیف پاپیونی" };
    return (names[bagStyle] || "کیف") + "، رنگ " + bagColor.name;
  }
  const styleControls = { earring: "earringStyle", crown: "crownStyle", glasses: "glassesStyle", cape: "capeStyle", belt: "beltStyle", bracelet: "braceletStyle" };
  const control = styleControls[name];
  return control ? `${accessoryNames[name]} (${selectedAccessoryOption(control)})` : accessoryNames[name];
}

function updateAccessorySummary() {
  const parts = [...selectedAccessories].map(getAccessoryDescription).filter(Boolean);
  const tone = $(".accessory-tone.selected")?.getAttribute("aria-label");
  const metal = $(".accessory-metal.selected")?.getAttribute("aria-label");
  if (parts.length && tone) parts.push("نگین " + tone);
  if (parts.length && metal) parts.push("فلز " + metal);
  $("#designMessage").textContent = parts.length ? parts.join("، ") + "؛ جزئیات به‌روز شد." : "مدل اکسسوری‌ها آماده‌ی انتخابه.";
}

function resetDesign() {
  selectModel("ballgown");

  const defaultColor = $('.color-choice[data-color-name="یاسی"]');
  if (defaultColor) selectColor(defaultColor);

  const defaultSkirt = $('[data-skirt-shape="auto"]');
  if (defaultSkirt) {
    $$('.shape-choice').forEach((button) => {
      const active = button === defaultSkirt;
      button.classList.toggle("selected", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }
  if ($('#summaryShape')) $('#summaryShape').textContent = "هماهنگ با مدل";

  selectedAccessories.clear();
  necklaceStyle = "pendant";
  bagStyle = "classic";
  bagColor = { main: "#c6a0e8", dark: "#865bb4", name: "یاسی" };
  if ($("#necklaceStyle")) $("#necklaceStyle").value = necklaceStyle;
  if ($("#bagStyle")) $("#bagStyle").value = bagStyle;
  $$(".bag-color[data-bag-color]").forEach((button) => button.classList.toggle("selected", button.dataset.bagColor === bagColor.main));
  applyNecklaceStyle();
  applyBagStyle();

  $$(".accessory").forEach((accessory) => {
    accessory.classList.add("hidden");
  });

  $$(".accessory-button").forEach((button) => {
    button.classList.remove("selected");
    button.querySelector("b").textContent = "+";
  });

  $("#designReward").classList.add("hidden");
  $("#finishDesignBtn").disabled = false;

  $("#designMessage").textContent =
    "طراحی از اول آماده‌ست؛ این بار یه استایل تازه بساز!";
}

$("#resetDesignBtn").addEventListener("click", resetDesign);

$("#finishDesignBtn").addEventListener("click", () => {
  const accessoriesText = [...selectedAccessories]
    .map(getAccessoryDescription)
    .filter(Boolean)
    .join("، ");

  const finalPreview = $("#finalDesignPreview");
  finalPreview.replaceChildren();

  const modelLine = document.createElement("strong");
  modelLine.textContent = models[currentModel].name;

  const colorLine = document.createElement("span");
  colorLine.textContent = "رنگ: " + currentColor.name;

  const fabricLine = document.createElement("span");
  const fabricNames = { silk: "ابریشم", satin: "ساتن", floral: "پارچه‌ی گل‌دار", lace: "گیپور", glitter: "اکلیلی" };
  const chosenFabric = document.querySelector(".fabric-choice.selected")?.dataset.fabric || "silk";
  fabricLine.textContent = "جنس پارچه: " + (fabricNames[chosenFabric] || "ابریشم");

  const shapeLine = document.createElement("span");
  const skirtShape = document.querySelector("[data-skirt-shape].selected")?.dataset.skirtShape || "auto";
  const neckline = document.querySelector("#necklineOptions")?.selectedOptions[0]?.textContent || "قلبی";
  const sleeves = document.querySelector("#sleeveOptions")?.selectedOptions[0]?.textContent || "پفی کوتاه";
  const lengthLabels = { knee: "تا روی زانو", midi: "میدی", long: "بلند" };
  const lengthValue = ["knee", "midi", "long"][Number(document.querySelector("#dressLengthOptions")?.value ?? 2)] || "long";
  shapeLine.textContent = "جزئیات فرم: " + (skirtShapeLabels[skirtShape] || "هماهنگ با مدل") + "، یقه " + neckline + "، آستین " + sleeves + "، قد " + lengthLabels[lengthValue];

  const accessoryLine = document.createElement("span");
  const accessoryTone = $(".accessory-tone.selected")?.getAttribute("aria-label");
  const accessoryMetal = $(".accessory-metal.selected")?.getAttribute("aria-label");
  const accessoryFinishes = [accessoryTone ? "نگین " + accessoryTone : "", accessoryMetal ? "فلز " + accessoryMetal : ""].filter(Boolean).join("، ");
  accessoryLine.textContent = accessoriesText
    ? "اکسسوری‌ها: " + accessoriesText + (accessoryFinishes ? "؛ " + accessoryFinishes : "")
    : "بدون اکسسوری؛ ساده و شیک";

  finalPreview.append(modelLine, colorLine, fabricLine, shapeLine, accessoryLine);

  $("#designReward").classList.remove("hidden");
  $("#designMessage").textContent =
    "طراحی‌ات ثبت شد؛ می‌تونی هر وقت خواستی دوباره تغییرش بدی.";

  $("#finishDesignBtn").disabled = true;

  $("#designReward").scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
});

applyNecklaceStyle();
applyBagStyle();
