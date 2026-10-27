
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const chestButton = document.getElementById("chestButton");
    const chestCaption = document.getElementById("chestCaption");

    const letterSection = document.getElementById("letterSection");
    const letterMessage = document.getElementById("letterMessage");

    const editorSection = document.getElementById("editorSection");
    const messageInput = document.getElementById("messageInput");

    const editButton = document.getElementById("editButton");
    const replayButton = document.getElementById("replayButton");
    const saveButton = document.getElementById("saveButton");
    const cancelButton = document.getElementById("cancelButton");
    const resetButton = document.getElementById("resetButton");
    const saveStatus = document.getElementById("saveStatus");

    const stars = document.getElementById("stars");
    const hearts = document.getElementById("hearts");

    // این متن اولیه را هر وقت خواستی تغییر بده.
    const DEFAULT_MESSAGE = `بعضی لحظه‌ها ساده به نظر می‌رسند،
اما می‌توانند تا همیشه در قلب آدم باقی بمانند.

اگر تا اینجا آمده‌ای، یعنی قدم‌به‌قدم رازهای این دنیا را کشف کرده‌ای.
اما زیباترین چیزها همیشه یک جواب مشخص ندارند؛
بعضی چیزها را باید با تمام وجود احساس کرد.

امیدوارم هر بار که این پیام را می‌خوانی،
لبخندی کوچک روی لبانت بنشیند
و یادت بیاید که دنیا هنوز پر از لحظه‌های قشنگ و غیرمنتظره است.

این پایان یک بازی است،
اما شاید شروع یک خاطره زیبا باشد... ♡`;

    const STORAGE_KEY = "MAEDE_STAGE4_FINAL_MESSAGE";

    let currentMessage = DEFAULT_MESSAGE;
    let editorOpeningMessage = DEFAULT_MESSAGE;

    // خواندن پیام ذخیره‌شده در همین مرورگر
    try {
        const savedMessage = localStorage.getItem(STORAGE_KEY);

        if (savedMessage !== null) {
            currentMessage = savedMessage;
        }
    } catch (error) {
        console.warn("ذخیره‌سازی مرورگر در دسترس نیست.", error);
    }

    function renderMessage() {
        // textContent باعث می‌شود متن کاربر به‌عنوان HTML اجرا نشود.
        letterMessage.textContent = currentMessage;
    }

    function showHearts() {
        for (let i = 0; i < 24; i++) {
            const heart = document.createElement("span");

            heart.className = "burst-heart";
            heart.textContent = Math.random() > 0.5 ? "♥" : "♡";

            heart.style.left = `${15 + Math.random() * 70}%`;
            heart.style.top = `${25 + Math.random() * 35}%`;
            heart.style.setProperty(
                "--dx",
                `${(Math.random() - 0.5) * 240}px`
            );
            heart.style.setProperty(
                "--dy",
                `${-40 - Math.random() * 220}px`
            );

            document.body.appendChild(heart);

            heart.addEventListener("animationend", () => {
                heart.remove();
            });
        }
    }

    function openGift() {
        if (chestButton.classList.contains("opened")) {
            return;
        }

        chestButton.classList.add("opened");
        chestButton.setAttribute("aria-label", "صندوق هدیه باز شد");
        chestCaption.textContent = "راز آخر، یک پیام از قلب است...";

        window.setTimeout(() => {
            renderMessage();

            letterSection.hidden = false;
            editorSection.hidden = true;

            chestCaption.textContent = "هدیه تو آماده است ♡";

            showHearts();

            letterSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 850);
    }

    function openEditor() {
        editorOpeningMessage = currentMessage;
        messageInput.value = currentMessage;
        saveStatus.textContent = "";
        editorSection.hidden = false;

        editorSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        window.setTimeout(() => messageInput.focus(), 350);
    }

    function closeEditor() {
        // اگر ذخیره نکرده باشی، تغییرات موقت کنار گذاشته می‌شوند.
        messageInput.value = editorOpeningMessage;
        saveStatus.textContent = "";
        editorSection.hidden = true;
    }

    function saveMessage() {
        currentMessage = messageInput.value;

        try {
            localStorage.setItem(STORAGE_KEY, currentMessage);
            saveStatus.textContent = "پیامت در این مرورگر ذخیره شد ♡";
        } catch (error) {
            saveStatus.textContent =
                "پیام برای همین بازدید اعمال شد؛ ذخیره دائمی در دسترس نیست.";
        }

        renderMessage();
        editorSection.hidden = true;
        letterSection.hidden = false;

        letterSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    function resetMessage() {
        messageInput.value = DEFAULT_MESSAGE;
        saveStatus.textContent = "متن اولیه آماده است؛ برای اعمال آن، ذخیره را بزن.";
    }

    function replayGift() {
        editorSection.hidden = true;
        letterSection.hidden = true;

        chestButton.classList.remove("opened");
        chestButton.setAttribute("aria-label", "باز کردن صندوق هدیه");
        chestCaption.textContent = "یک هدیه کوچک، با احساسی بزرگ";

        // انیمیشن شناور صندوق از ابتدا شروع شود.
        void chestButton.offsetWidth;

        document.getElementById("intro").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    // ستاره‌های پس‌زمینه
    for (let i = 0; i < 85; i++) {
        const star = document.createElement("span");

        star.className = "star";
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.setProperty(
            "--duration",
            `${1.5 + Math.random() * 4}s`
        );

        stars.appendChild(star);
    }

    // قلب‌های شناور
    function createFloatingHeart() {
        const heart = document.createElement("span");

        heart.className = "floating-heart";
        heart.textContent = Math.random() > 0.5 ? "♥" : "♡";
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.setProperty(
            "--size",
            `${12 + Math.random() * 16}px`
        );
        heart.style.setProperty(
            "--duration",
            `${7 + Math.random() * 6}s`
        );

        hearts.appendChild(heart);

        heart.addEventListener("animationend", () => {
            heart.remove();
        });
    }

    // رویداد دکمه‌ها
    chestButton.addEventListener("click", openGift);
    editButton.addEventListener("click", openEditor);
    saveButton.addEventListener("click", saveMessage);
    cancelButton.addEventListener("click", closeEditor);
    resetButton.addEventListener("click", resetMessage);
    replayButton.addEventListener("click", replayGift);

    renderMessage();

    createFloatingHeart();
    window.setInterval(createFloatingHeart, 1400);
});
