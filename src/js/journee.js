import data from "/data/data.json" assert { type: "json" };

const params = new URLSearchParams(window.location.search);
const country = params.get("country");

if (!country || !data[country]) {
  document.body.innerHTML = "<p>Pays inconnu</p>";
} else {
  document.getElementById("intro").innerHTML = `
    <h1>Bienvenue en ${country}</h1>
    <p>Voici comment se déroule une journée typique là-bas...</p>
  `;

  const timeline = document.getElementById("timeline");

  data[country].activities.forEach((activity, index) => {
    const hour = 7 + index * 2;
    const block = document.createElement("div");
    block.classList.add("activity-block");
    const scenes = [
        "scene1.gif",
        "scene2.gif",
        "scene3.gif",
        "scene4.gif",
        "scene5.gif",
        "scene6.gif",
        "scene7.gif",
        "scene8.webp",
        "scene9.gif",
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

  document.getElementById("conclusion").innerHTML = `
    <h2>Fin de journée !</h2>
    <p>Tu veux comparer avec d’autres pays ?</p>
    <button onclick="window.location.href='/'">Retour à la carte</button>
  `;
}
