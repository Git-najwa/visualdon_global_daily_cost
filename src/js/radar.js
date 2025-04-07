let rawData = {};
let topCountries = [];
let lowCountries = [];
let currentData = [];
let showingLow = false;

// Chargement de data.json
fetch('data/data.json')
  .then(response => response.json())
  .then(data => {
    rawData = data;

    const countries = Object.entries(data).map(([name, info]) => ({
      name,
      value: parseFloat(info.cost.replace("€", "")),
    }));

    countries.sort((a, b) => b.value - a.value);

    topCountries = countries.slice(0, 3);
    lowCountries = countries.slice(-3);
    currentData = topCountries;

    d3.select("#cockpit-chart")
      .append("svg")
      .attr("width", 300)
      .attr("height", 300)
      .style("overflow", "visible");

    drawUFO();
  });

function drawUFO(color = "#38bdf8") {
  const group = d3.select("#cockpit-chart svg g");
  if (!group.empty()) group.remove();

  const width = 300;
  const height = 300;

  const svg = d3.select("#cockpit-chart svg");
  const g = svg.append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  g.append("ellipse")
    .attr("rx", 170)
    .attr("ry", 75)
    .attr("fill", "#0a0a3d")
    .style("filter", `drop-shadow(0 0 15px ${color})`);

  g.append("ellipse")
    .attr("cy", -40)
    .attr("rx", 90)
    .attr("ry", 40)
    .attr("fill", color)
    .attr("opacity", 0.3);

  g.append("line")
    .attr("x1", 0)
    .attr("y1", -70)
    .attr("x2", 0)
    .attr("y2", -100)
    .attr("stroke", color)
    .attr("stroke-width", 2);

  g.append("circle")
    .attr("cx", 0)
    .attr("cy", -100)
    .attr("r", 5)
    .attr("fill", color);

  g.append("ellipse")
    .attr("rx", 140)
    .attr("ry", 60)
    .attr("stroke", color)
    .attr("fill", "none")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "5 5");

  // Ajout des pays
  g.append("g")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(0, 0)")
    .selectAll("text")
    .data(currentData)
    .enter()
    .append("text")
    .attr("y", (d, i) => i * 25 - 25)
    .text(d => `${d.name} (${d.value}€)`)
    .attr("fill", "#fff")
    .attr("font-size", "12px")
    .style("font-family", "'Press Start 2P', cursive")
    .style("cursor", "pointer")
    .on("click", function(event, d) {
      showActivities(d.name);
    });
}

// ✨ Détails des activités
function showActivities(countryName) {
  const info = rawData[countryName];
  const container = document.getElementById("activityDetails");

  if (!info) {
    container.innerHTML = `<p style="color:red;">Pays non trouvé : ${countryName}</p>`;
    return;
  }

  // Définir le thème couleur selon showingLow
  const themeClass = showingLow ? 'rose-style' : 'bleu-style';

  // Enlever les anciennes classes avant d'ajouter la nouvelle
  container.classList.remove('rose-style', 'bleu-style');
  container.classList.add(themeClass);

  const activities = info.activities.filter(Boolean);
  const html = `
    <h3>${countryName}</h3>
    <ul>
      ${activities.map(a => `<li>${a}</li>`).join("")}
    </ul>
  `;
  container.innerHTML = html;
}



// 🔁 Toggle entre top et low
document.getElementById("toggleView").addEventListener("click", () => {
  showingLow = !showingLow;
  currentData = showingLow ? lowCountries : topCountries;
  drawUFO(showingLow ? "#f472b6" : "#38bdf8");

  const btn = document.getElementById("toggleView");
  btn.classList.toggle("low", showingLow);
  btn.innerText = showingLow
    ? "Voir les 3 pays les plus chers"
    : "Voir les 3 pays les moins chers";
});
