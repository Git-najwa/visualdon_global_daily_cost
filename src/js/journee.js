import data from "/data/data.json" assert { type: "json" };

const params = new URLSearchParams(window.location.search);
const country = params.get("country");

if (!country || !data[country]) {
  document.body.innerHTML = "<p>Pays inconnu</p>";
} else {
  // Intro affichée
  document.getElementById("intro").innerHTML = `
    <h1>Bienvenue en ${country}</h1>
    <p>Voici comment se déroule une journée typique là-bas...</p>
  `;

  const timeline = document.getElementById("timeline");
  const invoiceDisplay = document.getElementById("invoice-total");
  const ticketList = document.getElementById("ticket-lines");
  const ticketBox = document.getElementById("full-invoice");
  const ticketTotalDisplay = document.querySelector("#ticket-total span");
  const closeButton = document.getElementById("close-ticket");

  let total = 0;
  const addedIndexes = new Set();
  invoiceDisplay.innerText = "0.00€";

  // ➕ Ajout du coût au scroll (sans décrémentation)
  window.addEventListener("scroll", () => {
    document.querySelectorAll(".activity-block").forEach((block, index) => {
      const rect = block.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.6 && rect.bottom > 0;

      if (isVisible && !addedIndexes.has(index)) {
        const rawActivity = data[country].activities[index] || "";
        const cost = parseFloat(rawActivity.match(/(\d+[\.,]?\d*)/g)?.[0]?.replace(",", ".") || "0");

        if (!isNaN(cost)) {
          total += cost;
          addedIndexes.add(index);
          animateTotal(invoiceDisplay, total);
        }
      }
    });
  });

  function animateTotal(el, target) {
    let current = parseFloat(el.innerText.replace(/[^\d.-]/g, "") || "0");
    const increment = (target - current) / 20;

    const interval = setInterval(() => {
      current += increment;
      if (Math.abs(current - target) < 0.05) {
        current = target;
        clearInterval(interval);
      }
      el.innerText = current.toFixed(2) + "€";
    }, 30);
  }

  function showTicket() {
    ticketList.innerHTML = "";
    let sum = 0;

    [...addedIndexes].sort((a, b) => a - b).forEach(index => {
      const activity = data[country].activities[index];
      if (!activity) return; // 🛡️ sécurité
      const time = `${7 + index * 2}:00`;
      const name = activity.replace(/:.*$/, "").trim();
      const price = activity.match(/(\d+[\.,]?\d*)/g)?.[0] || "0.00";
      sum += parseFloat(price.replace(",", "."));
      ticketList.innerHTML += `<li><span>${time} ${name}</span><span>${price}€</span></li>`;
    });

    ticketTotalDisplay.innerText = `${sum.toFixed(2)}€`;
    ticketBox.classList.add("visible");
  }

  // 💥 Fermer le ticket avec la croix
  closeButton.addEventListener("click", () => {
    ticketBox.classList.remove("visible");
  });

  // Scènes
  data[country].activities.forEach((activity, index) => {
    const hour = 7 + index * 2;
    const block = document.createElement("div");
    block.classList.add("activity-block");

    const scenes = [
      "scene1.gif", "scene2.gif", "scene3.gif",
      "scene4.gif", "scene5.gif", "scene6.gif",
      "scene7.gif", "scene8.webp", "scene9.gif",
    ];

    block.style.backgroundImage = `url('data/assets/${scenes[index]}')`;

    let bubbleHTML = "";
    let costHTML = "";

    if (activity) {
      bubbleHTML = `<div class="bubble">${activity}</div>`;
      costHTML = `<div class="cost">${activity.match(/\d+[\w€¥$₩₦₽₫]/g)?.[0] || ""}</div>`;
    }

    block.innerHTML = `
      <div class="time">${hour}:00</div>
      ${bubbleHTML}
      ${costHTML}
    `;
    timeline.appendChild(block);
  });

  // Bas de page
  document.getElementById("conclusion").innerHTML = `
    <h2>Fin de journée !</h2>
    <p>Tu veux comparer avec d’autres pays ?</p>
    <button onclick="window.location.href='/'">← Retour à la carte</button>
  `;

  // Bouton ticket
  document.getElementById("ticket-btn").addEventListener("click", showTicket);
document.getElementById("close-ticket").addEventListener("click", () => {
  document.getElementById("full-invoice").classList.remove("visible");
});
}
