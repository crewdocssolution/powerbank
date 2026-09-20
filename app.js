const PHOTOS = {
  kit20: ["kit-20k.jpg","kit20-1.jpg","kit20-ports.jpg","kit20-mah.jpg","kit20-cable.jpg","scheme-20k.jpg"],
  dc: ["dc-3.jpg","dc-1.jpg","dc-2.jpg","dc-4.jpg"]
};
const POS = {
  "kit-20k.jpg": "center 60%",
  "kit20-1.jpg": "center center",
  "scheme-20k.jpg": "center center",
  "kit20-ports.jpg": "center 55%",
  "kit20-mah.jpg": "center 65%",
  "kit20-cable.jpg": "center center",
  "dc-1.jpg": "center 40%",
  "dc-2.jpg": "center 45%",
  "dc-3.jpg": "center center",
  "dc-4.jpg": "center center"
};
let current = "kit20";

function setLang(lang) {
  document.querySelectorAll("[data-lang]").forEach(el => {
    el.classList.toggle("active", el.getAttribute("data-lang") === lang);
  });
  document.getElementById("btnUk").classList.toggle("active", lang === "uk");
  document.getElementById("btnRu").classList.toggle("active", lang === "ru");
  document.documentElement.lang = lang === "ru" ? "ru" : "uk";
}
function applyPos(img, src) {
  img.style.objectPosition = POS[src] || "center center";
}
function renderThumbs() {
  const box = document.getElementById("thumbs");
  box.innerHTML = PHOTOS[current].map((src, i) =>
    `<img src="${src}" class="${i===0?"on":""}" onclick="setPhoto('${src}', this)">`
  ).join("");
  box.querySelectorAll("img").forEach(img => applyPos(img, img.getAttribute("src")));
  const main = document.getElementById("mainImg");
  main.src = PHOTOS[current][0];
  applyPos(main, PHOTOS[current][0]);
  document.body.classList.remove("kit20","dc");
  document.body.classList.add(current);
}
function setPhoto(src, el) {
  const main = document.getElementById("mainImg");
  main.src = src;
  applyPos(main, src);
  document.querySelectorAll("#thumbs img").forEach(i => i.classList.remove("on"));
  el.classList.add("on");
}
function selectProduct(id) {
  current = id;
  document.getElementById("sw20").classList.toggle("on", id === "kit20");
  document.getElementById("swDc").classList.toggle("on", id === "dc");
  const sel = document.getElementById("orderProduct");
  if (sel) sel.selectedIndex = id === "dc" ? 1 : 0;
  const oi = document.getElementById("orderImg");
  if (oi) oi.src = PHOTOS[id][0];
  const ot = document.getElementById("orderTitle");
  if (ot) ot.textContent = id === "dc" ? "DC1018P · 10 400 mAh" : "Комплект 20 000 mAh";
  
function pickPlug(kind) {
  ["plug","patch","unknown"].forEach(k => {
    const el = document.getElementById("q-"+k);
    if (el) el.classList.toggle("on", k === kind);
  });
  const rec = document.getElementById("quizRec");
  const uk = document.documentElement.lang !== "ru";
  if (!rec) return;
  rec.hidden = false;
  if (kind === "patch") {
    selectProduct("dc");
    rec.textContent = uk
      ? "Беріть тільки B. У варіанта A немає PoE — патч-корд він не нагодує."
      : "Берите только B. У варианта A нет PoE — патч-корд он не накормит.";
  } else if (kind === "plug") {
    selectProduct("kit20");
    rec.textContent = uk
      ? "Вам підходить A. Тримає довше. B теж зійде, якщо хочете один ящик."
      : "Вам подходит A. Держит дольше. B тоже сойдёт, если хотите один ящик.";
  } else {
    rec.textContent = uk
      ? "Напишіть модель у коментарі. Якщо сумнів — безпечніше B."
      : "Напишите модель в комментарии. Если сомнение — безопаснее B.";
  }
}

renderThumbs();
}
function syncFromSelect() {
  selectProduct(document.getElementById("orderProduct").selectedOptions[0].dataset.id);
}
const NP_PROXY_URL = "https://winter-sun-55c2.crewdocssolution.workers.dev";
function openThankYou(){ document.getElementById("thankyouModal").classList.add("open"); document.body.style.overflow="hidden"; }
function closeThankYou(){ document.getElementById("thankyouModal").classList.remove("open"); document.body.style.overflow=""; }
function sendOrder(e) {
  e.preventDefault();
  const name = document.getElementById("orderName").value.trim();
  const phone = document.getElementById("orderPhone").value.trim();
  const product = document.getElementById("orderProduct").value;
  const payment = document.getElementById("orderPayment").value;
  const delivery = document.getElementById("orderDelivery").value;
  const npType = document.getElementById("npType").value;
  const city = document.getElementById("orderCity").value.trim();
  const branch = document.getElementById("orderBranch").value.trim();
  const address = document.getElementById("orderAddress").value.trim();
  const comment = document.getElementById("orderComment").value.trim();
  if (!name || !phone || !product) return false;
  const btn = document.getElementById("orderSubmitBtn");
  btn.disabled = true; btn.style.opacity = ".6";
  fetch(NP_PROXY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone, product, payment, delivery, npType, city, branch, address, comment })
  }).then(r => r.json()).then(data => {
    if (data && data.success) { openThankYou(); document.getElementById("orderForm").reset(); }
    else alert((data && data.error) || "Помилка відправки. Напишіть у Telegram.");
  }).catch(() => alert("Помилка мережі. Telegram: +380995643468"))
  .finally(() => { btn.disabled = false; btn.style.opacity = "1"; });
  return false;
}

function pickPlug(kind) {
  ["plug","patch","unknown"].forEach(k => {
    const el = document.getElementById("q-"+k);
    if (el) el.classList.toggle("on", k === kind);
  });
  const rec = document.getElementById("quizRec");
  const uk = document.documentElement.lang !== "ru";
  if (!rec) return;
  rec.hidden = false;
  if (kind === "patch") {
    selectProduct("dc");
    rec.textContent = uk
      ? "Беріть тільки B. У варіанта A немає PoE — патч-корд він не нагодує."
      : "Берите только B. У варианта A нет PoE — патч-корд он не накормит.";
  } else if (kind === "plug") {
    selectProduct("kit20");
    rec.textContent = uk
      ? "Вам підходить A. Тримає довше. B теж зійде, якщо хочете один ящик."
      : "Вам подходит A. Держит дольше. B тоже сойдёт, если хотите один ящик.";
  } else {
    rec.textContent = uk
      ? "Напишіть модель у коментарі. Якщо сумнів — безпечніше B."
      : "Напишите модель в комментарии. Если сомнение — безопаснее B.";
  }
}

renderThumbs();
