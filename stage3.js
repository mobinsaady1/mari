
"use strict";

// انتخاب عناصر صفحه
const $ = (selector) => document.querySelector(selector);

const clueCards = document.querySelectorAll(".clue-card");
const clueReveal = $("#clueReveal");
const vaultCode = $("#vaultCode");
const codeMessage = $("#codeMessage");
const keyMessage = $("#keyMessage");
const keySection = $("#keySection");
const reward = $("#reward");
const chest = $("#chest");
const particleContainer = $("#particles");
const checkCodeButton = $("#checkCode");
const finishButton = $("#finishButton");

// بررسی وجود عناصر ضروری صفحه
if (
  !clueReveal ||
  !vaultCode ||
  !codeMessage ||
  !keyMessage ||
  !keySection ||
  !reward ||
  !chest ||
  !particleContainer ||
  !checkCodeButton ||
  !finishButton
) {
  console.error(
    "بعضی از عناصر مرحله سوم در stage3.html پیدا نشدند."
  );
} else {
  // سرنخ‌ها؛ پاسخ‌ها به ترتیب ۲، ۳ و ۰ هستند.
  const clueTexts = [
    "سرنخ اول: کوچک‌ترین عدد اول را پیدا کن؛ عددی که فقط بر ۱ و خودش بخش‌پذیر است.",
    "سرنخ دوم: مثلث چند ضلع دارد؟ تعداد ضلع‌هایش رقم دوم رمز است.",
    "سرنخ سوم: دایره چند گوشه دارد؟ تعداد گوشه‌هایش رقم آخر رمز است."
  ];

  const foundClues = new Set();

  let codeUnlocked = false;
  let chestUnlocked = false;
  let keySolved = false;

  // تبدیل اعداد فارسی و عربی به انگلیسی
  function normalizeDigits(value) {
    return String(value)
      .replace(/[۰-۹]/g, (digit) =>
        String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))
      )
      .replace(/[٠-٩]/g, (digit) =>
        String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))
      );
  }

  // تبدیل اعداد انگلیسی به فارسی برای نمایش
  function persianDigits(number) {
    return String(number).replace(
      /\d/g,
      (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]
    );
  }

  // به‌روزرسانی نوار پیشرفت
  function updateProgress() {
    const progress =
      foundClues.size +
      Number(codeUnlocked) +
      Number(keySolved);

    const progressBar = $("#progressBar");
    const progressLabel = $("#progressLabel");

    if (progressBar) {
      progressBar.style.width = `${progress * 20}%`;
    }

    if (progressLabel) {
      progressLabel.textContent =
        `${persianDigits(progress)} از ۵`;
    }
  }

  // نمایش پیام موفقیت یا خطا
  function showMessage(element, message, type = "") {
    if (!element) return;

    element.textContent = message;
    element.className = `message ${type}`.trim();
  }

  // نمایش و ثبت سرنخ‌ها
  clueCards.forEach((card) => {
    card.addEventListener("click", () => {
      const index = Number(card.dataset.clue);

      if (index < 0 || index >= clueTexts.length) return;

      clueReveal.textContent = clueTexts[index];
      card.classList.add("found");

      const status = card.querySelector(".clue-status");

      if (status) {
        status.textContent = "✓";
      }

      // هر سرنخ فقط یک بار در پیشرفت حساب می‌شود.
      if (!foundClues.has(index)) {
        foundClues.add(index);
        updateProgress();
      }

      if (foundClues.size === 3) {
        clueReveal.textContent +=
          " حالا جواب سه سرنخ را به ترتیب کنار هم بگذار.";
      }
    });
  });

  // بررسی رمز صندوق
  function checkCode() {
    if (codeUnlocked) return;

    if (foundClues.size < 3) {
      showMessage(
        codeMessage,
        "هنوز همه سرنخ‌ها را پیدا نکردی. هر سه نشان را بررسی کن.",
        "error"
      );

      return;
    }

    const enteredCode = normalizeDigits(
      vaultCode.value.trim()
    );

    if (!/^\d{3}$/.test(enteredCode)) {
      showMessage(
        codeMessage,
        "رمز باید دقیقاً سه رقم داشته باشد.",
        "error"
      );

      return;
    }

    // رمز صحیح صندوق
    if (enteredCode !== "230") {
      showMessage(
        codeMessage,
        "این رمز درست نیست! به ترتیب جواب سه سرنخ فکر کن.",
        "error"
      );

      vaultCode.value = "";
      vaultCode.focus();

      return;
    }

    // رمز صحیح است
    codeUnlocked = true;
    updateProgress();

    vaultCode.disabled = true;
    checkCodeButton.disabled = true;
    checkCodeButton.style.opacity = "0.55";

    showMessage(
      codeMessage,
      "آفرین! رمز ۲۳۰ صحیح است؛ قفل اول باز شد.",
      "success"
    );

    const chestLock = $("#chestLock");
    const sceneCaption = $("#sceneCaption");

    if (chestLock) {
      chestLock.textContent = "✦";
    }

    if (sceneCaption) {
      sceneCaption.textContent =
        "قفل اول باز شد؛ حالا کلید جادویی را پیدا کن.";
    }

    keySection.classList.remove("hidden");

    keySection.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });

    burstParticles();
  }

  // دکمه بررسی رمز
  checkCodeButton.addEventListener("click", checkCode);

  // امکان بررسی رمز با کلید Enter
  vaultCode.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      checkCode();
    }
  });

  // انتخاب کلید نهایی
  document.querySelectorAll(".key-option").forEach((button) => {
    button.addEventListener("click", () => {
      if (!codeUnlocked || keySolved) return;

      // فقط کلید طلایی درست است.
      if (button.dataset.key !== "gold") {
        showMessage(
          keyMessage,
          "این کلید درست نیست! به رنگ خورشید و گنج فکر کن.",
          "error"
        );

        return;
      }

      keySolved = true;
      chestUnlocked = true;

      updateProgress();

      button.classList.add("correct");

      // پس از انتخاب کلید صحیح، همه کلیدها غیرفعال می‌شوند.
      document.querySelectorAll(".key-option").forEach((option) => {
        option.disabled = true;
      });

      // باز شدن صندوق
      chest.classList.add("open");

      const chestLock = $("#chestLock");
      const sceneCaption = $("#sceneCaption");

      if (chestLock) {
        chestLock.textContent = "✧";
      }

      if (sceneCaption) {
        sceneCaption.textContent = "صندوق طلایی باز شد! ✨";
      }

      showMessage(
        keyMessage,
        "آفرین! کلید طلایی را پیدا کردی.",
        "success"
      );

      reward.classList.remove("hidden");

      burstParticles();

      reward.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    });
  });

  
  // پایان مرحله سوم و ورود به مرحله چهارم
  finishButton.addEventListener("click", () => {
    if (!chestUnlocked) return;

    finishButton.textContent = "در حال ورود به اتاق آخر...";

    finishButton.disabled = true;

    const finishMessage = $("#finishMessage");

    if (finishMessage) {
      finishMessage.textContent =
        "مرحله سوم کامل شد! در حال آماده‌سازی سورپرایز نهایی MAEDE...";
    }

    window.setTimeout(() => {
      window.location.href = "stage4.html";
    }, 1200);
  });


  // افکت ذرات جادویی
  const particleSymbols = ["✦", "✧", "⋆", "·"];

  function createParticle() {
    const particle = document.createElement("span");

    particle.className = "particle";

    particle.textContent =
      particleSymbols[
        Math.floor(Math.random() * particleSymbols.length)
      ];

    particle.style.left = `${Math.random() * 100}%`;

    particle.style.setProperty(
      "--duration",
      `${6 + Math.random() * 7}s`
    );

    particle.style.fontSize =
      `${10 + Math.random() * 15}px`;

    particleContainer.appendChild(particle);

    particle.addEventListener("animationend", () => {
      particle.remove();
    });
  }

  // افکت انفجار ذرات هنگام باز شدن قفل‌ها
  function burstParticles() {
    for (let i = 0; i < 22; i++) {
      setTimeout(() => {
        createParticle();
      }, i * 35);
    }
  }

  // ذرات آرام پس‌زمینه
  for (let i = 0; i < 12; i++) {
    setTimeout(() => {
      createParticle();
    }, i * 350);
  }

  // مقداردهی اولیه پیشرفت
  updateProgress();
}
