(function () {
  "use strict";

  // 20 Desember 2026, 08:00 WIB (UTC+7)
  var weddingDate = new Date("2026-12-20T08:00:00+07:00").getTime();

  var els = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    minutes: document.getElementById("cd-minutes"),
    seconds: document.getElementById("cd-seconds"),
    countdown: document.getElementById("countdown"),
    done: document.getElementById("countdown-done"),
  };

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  var timer;

  function updateCountdown() {
    var diff = weddingDate - Date.now();

    if (diff <= 0) {
      els.countdown.hidden = true;
      els.done.hidden = false;
      clearInterval(timer);
      return;
    }

    var s = Math.floor(diff / 1000);
    els.days.textContent = Math.floor(s / 86400);
    els.hours.textContent = pad(Math.floor((s % 86400) / 3600));
    els.minutes.textContent = pad(Math.floor((s % 3600) / 60));
    els.seconds.textContent = pad(s % 60);
  }

  updateCountdown();
  timer = setInterval(updateCountdown, 1000);

  // Scroll reveal
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // Guest name from URL, e.g. ?to=Budi
  var guest = new URLSearchParams(window.location.search).get("to");
  if (guest) {
    var guestEl = document.getElementById("guest-name");
    guestEl.textContent = guest;
    document.getElementById("name").value = guest;
  }

  // RSVP
  var form = document.getElementById("rsvp-form");
  var status = document.getElementById("form-status");
  var list = document.getElementById("wishes");

  var attendanceLabels = {
    hadir: "Hadir",
    "tidak-hadir": "Tidak Hadir",
    ragu: "Masih Ragu",
  };

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var data = new FormData(form);
    var name = String(data.get("name") || "").trim();
    var attendance = data.get("attendance");
    var guests = data.get("guests");
    var message = String(data.get("message") || "").trim();

    status.classList.remove("is-error");

    if (!name || !attendance) {
      status.textContent = "Mohon isi nama dan konfirmasi kehadiran Anda.";
      status.classList.add("is-error");
      return;
    }

    var item = document.createElement("li");
    var strong = document.createElement("strong");
    strong.textContent = name;
    var badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent =
      attendanceLabels[attendance] +
      (attendance === "hadir" ? " · " + guests + " orang" : "");
    var p = document.createElement("p");
    p.textContent = message || "Turut berbahagia atas pernikahan kalian.";

    item.append(strong, badge, p);
    list.prepend(item);

    status.textContent =
      "Terima kasih, " + name + "! Konfirmasi Anda telah kami terima.";
    form.reset();
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
