let topCountries = [];
let lowCountries = [];
let currentData = [];
let showingLow = false;

// Chargement de data.json
fetch('data/data.json')
  .then(response => response.json())
  .then(data => {
    // Transformer l'objet en tableau { name, value }
    const countries = Object.entries(data).map(([name, info]) => ({
      name,
      value: parseFloat(info.cost.replace("€", ""))
    }));

    // Trier les pays par coût décroissant
    countries.sort((a, b) => b.value - a.value);

    // Sélectionner les 3 plus chers et les 3 moins chers
    topCountries = countries.slice(0, 3);
    lowCountries = countries.slice(-3);

    currentData = topCountries;

    // Initialisation du SVG une fois les données chargées
    d3.select("#cockpit-chart")
      .append("svg")
      .attr("width", 300)
      .attr("height", 300)
      .style("overflow", "visible");

    drawUFO(); // Dessiner la première fois
  });

  
  function drawUFO(color = "#38bdf8") {
    const group = d3.select("#cockpit-chart svg g");
    if (!group.empty()) group.remove();
  
    const width = 300;
    const height = 300;
  
    const svg = d3.select("#cockpit-chart svg");
    const g = svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);
  
    // Corps de la soucoupe
    g.append("ellipse")
      .attr("rx", 170)
      .attr("ry", 75)
      .attr("fill", "#0a0a3d")
      .style("filter", `drop-shadow(0 0 15px ${color})`);
  
    // Dôme
    g.append("ellipse")
      .attr("cy", -40)
      .attr("rx", 90)
      .attr("ry", 40)
      .attr("fill", color)
      .attr("opacity", 0.3);
  
    // Antenne
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
  
    // Anneau lumineux
    g.append("ellipse")
      .attr("rx", 140)
      .attr("ry", 60)
      .attr("stroke", color)
      .attr("fill", "none")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5 5");
  
    // Pays au centre
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
      .style("font-family", "'Press Start 2P', cursive");
  }
  
  // Initialisation du SVG
  d3.select("#cockpit-chart")
    .append("svg")
    .attr("width", 300)
    .attr("height", 300)
    .style("overflow", "visible");
  
  drawUFO();
  
  document.getElementById("toggleView").addEventListener("click", () => {
    showingLow = !showingLow;
    currentData = showingLow ? lowCountries : topCountries;
  
    // Re-dessine la soucoupe
    drawUFO(showingLow ? "#f472b6" : "#38bdf8");
  
    // Met à jour le bouton
    const btn = document.getElementById("toggleView");
    btn.classList.toggle("low", showingLow);
    btn.innerText = showingLow
      ? "Voir les 3 pays les plus chers"
      : "Voir les 3 pays les moins chers";
  });
  