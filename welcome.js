
const startButton = document.getElementById("startButton");

startButton.addEventListener("click", function () {
    document.body.classList.add("leaving");

    startButton.disabled = true;

    setTimeout(function () {
        window.location.href = "index.html";
    }, 750);
});
