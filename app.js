const PHOTOS = {
  kit20: ["hoco-j86.jpg","hoco-j86a.jpg","hoco-j86b.jpg","kit20-2.jpg","kit20-4.jpg","kit20-5.jpg"],
  dc: ["dc-2.jpg","dc-1.jpg","dc-3.jpg","dc-4.jpg","dc-5.jpg"]
};
const POS = {
  "hoco-j86.jpg": "center center",
  "hoco-j86a.jpg": "center center",
  "hoco-j86b.jpg": "center center",
  "kit20-2.jpg": "center 70%",
  "kit20-4.jpg": "center 60%",
  "kit20-5.jpg": "center center",
  "dc-1.jpg": "center 40%",
  "dc-2.jpg": "center 45%",
  "dc-3.jpg": "center center",
  "dc-4.jpg": "center center",
  "dc-5.jpg": "center 60%"
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
  document.getElementById("orderProduct").selectedIndex = id === "dc" ? 1 : 0;
  document.getElementById("orderImg").src = PHOTOS[id][0];
  document.getElementById("orderTitle").textContent = id === "dc" ? "DC1018P · 10 400 mAh" : "Комплект 20 000 mAh";
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
renderThumbs();
