const $ = (s, c = document) => c.querySelector(s),
  $$ = (s, c = document) => [...c.querySelectorAll(s)];
$("#yr").textContent = new Date().getFullYear();
$("#burger").onclick = () =>
  $("#links").classList.toggle("open");
const io = new IntersectionObserver(
  (e) =>
    e.forEach((x) => {
      if (x.isIntersecting) {
        x.target.classList.add("in");
        io.unobserve(x.target);
      }
    }),
  { threshold: 0.12 },
);
$$(".rv").forEach((el) => io.observe(el));
// hero slides
const sl = $$(".slides i");
if (sl.length) {
  let i = 0;
  sl[0].classList.add("on");
  if (sl.length > 1)
    setInterval(() => {
      sl[i].classList.remove("on");
      i = (i + 1) % sl.length;
      sl[i].classList.add("on");
    }, 5500);
}
// counters
$$("[data-n]").forEach((el) => {
  const t = +el.dataset.n,
    s = el.dataset.s || "";
  let n = 0;
  const st = setInterval(() => {
    n += Math.ceil(t / 40);
    if (n >= t) {
      n = t;
      clearInterval(st);
    }
    el.textContent = n + s;
  }, 35);
});
// falling leaves
const cv = $("#leaves");
if (
  cv &&
  !matchMedia("(prefers-reduced-motion:reduce)").matches
) {
  const x = cv.getContext("2d");
  let L = [];
  const R = () => {
    cv.width = cv.offsetWidth;
    cv.height = cv.offsetHeight;
  };
  R();
  addEventListener("resize", R);
  const cols = ["#ff6a13", "#c8501a", "#6a9a2e", "#e0a030"];
  for (let i = 0; i < 26; i++)
    L.push({
      x: Math.random() * cv.width,
      y: Math.random() * cv.height,
      s: 5 + Math.random() * 9,
      v: 0.4 + Math.random() * 1,
      a: Math.random() * 6,
      r: Math.random() * 0.03,
      c: cols[i % 4],
    });
  (function f() {
    x.clearRect(0, 0, cv.width, cv.height);
    L.forEach((l) => {
      l.y += l.v;
      l.x += Math.sin((l.a += 0.02)) * 0.9;
      if (l.y > cv.height + 20) {
        l.y = -20;
        l.x = Math.random() * cv.width;
      }
      x.save();
      x.translate(l.x, l.y);
      x.rotate(l.a);
      x.fillStyle = l.c;
      x.globalAlpha = 0.7;
      x.beginPath();
      x.ellipse(0, 0, l.s, l.s / 2, 0, 0, 7);
      x.fill();
      x.restore();
    });
    requestAnimationFrame(f);
  })();
}
// lightbox
$$(".gal img").forEach(
  (i) =>
    (i.onclick = () => {
      $("#lb img").src = i.src;
      $("#lb").classList.add("on");
    }),
);
$("#lb").onclick = () => $("#lb").classList.remove("on");
// before/after
$$(".ba").forEach((b) => {
  const r = $("input", b),
    c = $(".bb", b);
  const u = () => {
    c.style.clipPath = `inset(0 ${100 - r.value}% 0 0)`;
    b.style.setProperty("--p", r.value + "%");
  };
  r.oninput = u;
  u();
});
// contact form
const cf = $("#cf");
if (cf)
  cf.onsubmit = (e) => {
    e.preventDefault();
    const d = new FormData(cf);
    location.href = `mailto:${JTS.OWNER_EMAIL}?subject=Website message from ${d.get("n")}&body=${encodeURIComponent(d.get("m") + "\n\n" + d.get("e"))}`;
  };
// quote calculator
const qf = $("#qf");
if (qf) {
  const S = [
    ["Tree removal", 600],
    ["Crown topping", 450],
    ["Crane removal", 1500],
    ["Stump grinding", 150],
    ["Tree trimming", 300],
    ["Storm cleanup", 500],
    ["Lot clearing", 900],
  ];
  $("#svc").innerHTML = S.map(
    (s) => `<option value="${s[1]}">${s[0]}</option>`,
  ).join("");
  $("#date").min = new Date().toISOString().split("T")[0];
  let lo = 0,
    hi = 0;
  const money = (n) => "$" + Math.round(n).toLocaleString();
  const calc = () => {
    const ex = $$(".ex:checked").reduce(
        (a, c) => a + +c.value,
        0,
      ),
      q = Math.max(1, +$("#qty").value || 1),
      b =
        (+$("#svc").value *
          $("#size").value *
          $("#acc").value +
          ex) *
        q;
    lo = b * 0.9;
    hi = b * 1.15;
    $("#tot").textContent = money(lo) + " – " + money(hi);
  };
  qf.addEventListener("input", calc);
  calc();
  qf.onsubmit = async (e) => {
    e.preventDefault();
    const v = (id) => $("#" + id).value,
      sv = $("#svc").selectedOptions[0].text,
      sum = `Service: ${sv}\nTrees: ${v("qty")} (${$("#size").selectedOptions[0].text}, ${$("#acc").selectedOptions[0].text})\nPreferred: ${v("date")} ${v("time")}\nAddress: ${v("addr")}\nPhone: ${v("phone")}\nNotes: ${v("notes")}\nEstimate: ${$("#tot").textContent}`;
    const m = $("#msg"),
      C = window.JTS;
    if (C.EMAILJS_PUBLIC_KEY && window.emailjs) {
      try {
        emailjs.init(C.EMAILJS_PUBLIC_KEY);
        const p = {
          name: v("name"),
          summary: sum,
          estimate: $("#tot").textContent,
        };
        await emailjs.send(
          C.EMAILJS_SERVICE_ID,
          C.EMAILJS_TEMPLATE_ID,
          {
            ...p,
            to_email: v("email"),
            subject: "Your Jones Tree Service quote",
          },
        );
        await emailjs.send(
          C.EMAILJS_SERVICE_ID,
          C.EMAILJS_TEMPLATE_ID,
          {
            ...p,
            to_email: C.OWNER_EMAIL,
            subject: "New booking from " + v("name"),
          },
        );
        m.textContent =
          "Booked! Your quote was emailed to you and we will confirm shortly.";
        qf.reset();
        calc();
      } catch (err) {
        m.textContent =
          "Email failed. Please call (740) 645-7187.";
      }
    } else {
      location.href = `mailto:${C.OWNER_EMAIL}?cc=${encodeURIComponent(v("email"))}&subject=${encodeURIComponent("Booking request from " + v("name"))}&body=${encodeURIComponent(sum)}`;
      m.textContent =
        "Opening your email app (EmailJS not configured yet, see README).";
    }
  };
}
