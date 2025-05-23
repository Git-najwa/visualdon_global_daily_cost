import data from "/data/data.json";

const params = new URLSearchParams(window.location.search);
const country = params.get("country");

if (!country || !data[country]) {
  document.body.innerHTML = "<p>Pays inconnu</p>";
} else {
  // Intro
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
  const narratedHours = new Set(); // Pour éviter de rejouer une narration
  invoiceDisplay.innerText = "0.00€";

  // Scènes
  data[country].activities.forEach((activity, index) => {
    const hour = 7 + index * 2;
    const block = document.createElement("div");
    block.classList.add("activity-block");
    block.dataset.hour = hour; // Important pour le scroll listener

    const scenes = [
      "./data/assets/scene1.gif",
      "./data/assets/scene2.gif",
      "./data/assets/scene3.gif",
      "./data/assets/scene4.gif",
      "./data/assets/scene5.gif",
      "./data/assets/scene6.gif",
      "./data/assets/scene7.gif",
      "./data/assets/scene8.webp",
      "./data/assets/scene9.gif",
    ];
    block.style.backgroundImage = `url('${scenes[index]}')`;

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

  // Scroll logic
  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    document.getElementById("progress-fill").style.width = `${scrolled * 100}%`;

    document.querySelectorAll(".activity-block").forEach((block, index) => {
      const rect = block.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.6 && rect.bottom > 0;
      const hour = parseInt(block.dataset.hour);

      // 🟡 Narration immersive à certaines heures
      if (isVisible && !narratedHours.has(hour)) {
        if (hour === 11) showNarration("Café matinal... le carburant de la vie !");
        if (hour === 13) showNarration("Tu as pris les transports... mais à quel prix ?");
        if (hour === 17) showNarration("Enfin le souper... ça creuse une journée !");
        if (hour === 21) showNarration("Tu rentres, exténué·e. Le loyer t’attend.");
        narratedHours.add(hour);
      }

      // 💸 Ajout des coûts visibles
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

  // 💬 Fonction pour afficher une popup narrative
  function showNarration(message) {
    const popup = document.createElement("div");
    popup.className = "narration-popup";
    popup.innerText = message;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 4000);
  }

  // 🎞️ Animation incrémentale du total
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

  // 🧾 Générer le ticket final
  function showTicket() {
    ticketList.innerHTML = "";
    let sum = 0;

    [...addedIndexes].sort((a, b) => a - b).forEach(index => {
      const activity = data[country].activities[index];
      if (!activity) return;
      const time = `${7 + index * 2}:00`;
      const name = activity.replace(/:.*$/, "").trim();
      const price = activity.match(/(\d+[\.,]?\d*)/g)?.[0] || "0.00";
      sum += parseFloat(price.replace(",", "."));
      ticketList.innerHTML += `<li><span>${time} ${name}</span><span>${price}€</span></li>`;
    });

    ticketTotalDisplay.innerText = `${sum.toFixed(2)}€`;
    ticketBox.classList.add("visible");
  }

  // ❌ Fermer le ticket
  closeButton.addEventListener("click", () => {
    ticketBox.classList.remove("visible");
  });

  // 🧾 Bouton voir ticket
  document.getElementById("ticket-btn").addEventListener("click", showTicket);
}
