// ===================== TAP LOGIC =====================
let tapCount = 0;
let firstTapTime = 0;
const TAP_LIMIT = 5;
const TIME_LIMIT = 5000;

let countdownTimer;
let countdown = 5;

// ===================== TAP DETECTION =====================
document.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") return;

    const now = Date.now();
    if (tapCount === 0) firstTapTime = now;
    tapCount++;

    if (tapCount >= TAP_LIMIT && now - firstTapTime <= TIME_LIMIT) {
        triggerSOS();
        resetTaps();
    }

    if (now - firstTapTime > TIME_LIMIT) resetTaps();
});

function resetTaps() {
    tapCount = 0;
    firstTapTime = 0;
}

// ===================== SOS LOGIC =====================
function triggerSOS() {
    document.getElementById("status").innerText = "🚨 Emergency detected!";
    document.getElementById("cancelBox").classList.remove("hidden");
    startCountdown();
}

function startCountdown() {
    countdown = 5;
    document.getElementById("countdown").innerText = countdown;

    countdownTimer = setInterval(() => {
        countdown--;
        document.getElementById("countdown").innerText = countdown;

        if (countdown === 0) {
            clearInterval(countdownTimer);
            sendAlert();
        }
    }, 1000);
}

document.getElementById("cancelBtn").addEventListener("click", () => {
    clearInterval(countdownTimer);
    document.getElementById("cancelBox").classList.add("hidden");
    document.getElementById("status").innerText = "❌ SOS Cancelled";
});

// ===================== SEND EMAIL ALERT =====================
function sendAlert() {
    document.getElementById("cancelBox").classList.add("hidden");
    document.getElementById("status").innerText = "📍 Fetching location...";

    navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Show map
        const map = new google.maps.Map(document.getElementById("map"), {
            center: { lat, lng },
            zoom: 15
        });

        new google.maps.Marker({
            position: { lat, lng },
            map
        });

        const email = "pavanibellamkonda19@gmail.com"; // 🔴 CHANGE EMAIL HERE
        const subject = "🚨 SOS ALERT - Immediate Help Needed";

        const body =
`SOS ALERT!

I am in danger and need immediate help.

My live location:
https://www.google.com/maps?q=${lat},${lng}

Please respond immediately.`;

        // Open email app
        window.location.href =
            `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        document.getElementById("status").innerText =
            "✅ Email app opened with SOS message";

    }, () => {
        alert("Location permission denied");
    });
}