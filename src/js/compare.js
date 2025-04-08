import data from "/data/data.json" assert { type: "json" };

const params = new URLSearchParams(window.location.search);
const country1 = params.get("country1");
const country2 = params.get("country2");

if (!country1 || !country2 || !data[country1] || !data[country2]) {
  document.body.innerHTML = "<p>Comparaison impossible</p>";
} else {
  buildTimeline("country1", country1);
  buildTimeline("country2", country2);
}

function buildTimeline(containerId, countryName) {
  const container = document.getElementById(containerId);
  container.innerHTML = `<h2>${countryName}</h2>`;

  data[countryName].activities.forEach((activity, index) => {
    const hour = 7 + index * 2;
    const block = document.createElement("div");
    block.className = "activity-block";

    const scenes = [
      "scene1.gif", "scene2.gif", "scene3.gif",
      "scene4.gif", "scene5.gif", "scene6.gif",
      "scene7.gif", "scene8.webp", "scene9.gif",
    ];
    block.style.backgroundImage = `url('/data/assets/${scenes[index]}')`;

    let bubble = "";
    if (activity) {
      bubble = `<div class="bubble">${activity}</div>`;
    }

    block.innerHTML = `
      <div class="time">${hour}:00</div>
      ${bubble}
    `;
    container.appendChild(block);
  });
}
