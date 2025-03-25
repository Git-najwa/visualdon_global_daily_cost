const topCountries = [
    { name: "États-Unis", value: 85 },
    { name: "France", value: 75 },
    { name: "Australie", value: 57 }
  ];
  
  const lowCountries = [
    { name: "Argentine", value: 20 },
    { name: "Inde", value: 22 },
    { name: "Brésil", value: 30 }
  ];
  
  const width = 300;
  const height = 300;
  
  const svg = d3.select("#cockpit-chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("overflow", "visible");
  
  const group = svg.append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`)
    .attr("id", "spaceship");
  
  function drawUFO(color = "#f472b6") {
    group.selectAll("*").remove();
  
    // Corps
    group.append("ellipse")
      .attr("rx", 150)
      .attr("ry", 70)
      .attr("fill", "#0a0a3d")
      .style("filter", `drop-shadow(0 0 15px ${color})`);
  
    // Dôme
    group.append("ellipse")
      .attr("cy", -40)
      .attr("rx", 80)
      .attr("ry", 40)
      .attr("fill", color)
      .attr("opacity", 0.3);
  
    // Antenne
    group.append("line")
      .attr("x1", 0)
      .attr("y1", -70)
      .attr("x2", 0)
      .attr("y2", -100)
      .attr("stroke", color)
      .attr("stroke-width", 2);
    
    group.append("circle")
      .attr("cx", 0)
      .attr("cy", -100)
      .attr("r", 5)
      .attr("fill", color);
  
    // Anneau lumineux
    group.append("ellipse")
      .attr("rx", 125)
      .attr("ry", 55)
      .attr("stroke", color)
      .attr("fill", "none")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5 5");
  
    // Texte centré
    group.append("g")
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
  
  let showingLow = false;
  let currentData = topCountries;
  drawUFO();
  
  // Toggle via bouton
  document.getElementById("toggleView").addEventListener("click", () => {
    showingLow = !showingLow;
    currentData = showingLow ? lowCountries : topCountries;
  
    drawUFO(showingLow ? "#f472b6" : "#facc15");
  
    document.getElementById("toggleView").innerText =
      showingLow ? "Voir les pays les plus chers" : "Voir les pays les moins chers";
  });
  