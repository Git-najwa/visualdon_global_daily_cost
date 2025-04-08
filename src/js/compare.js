import * as d3 from "https://cdn.skypack.dev/d3@7";
import data from "/data/data.json" assert { type: "json" };

const params = new URLSearchParams(window.location.search);
const country1 = params.get("country1");
const country2 = params.get("country2");

if (!country1 || !country2 || !data[country1] || !data[country2]) {
  document.getElementById("comparison-graph").innerHTML = "Comparaison impossible.";
} else {
  buildTimeline("country1", country1);
  buildTimeline("country2", country2);
  drawComparisonGraph(country1, country2);
}

function buildTimeline(containerId, countryName) {
    const container = document.getElementById(containerId);
    container.innerHTML = `<h2>${countryName}</h2>`;
  
    const scenes = [
      "scene1.gif", "scene2.gif", "scene3.gif",
      "scene4.gif", "scene5.gif", "scene6.gif",
      "scene7.gif", "scene8.webp", "scene9.gif",
    ];
  
    data[countryName].activities.forEach((activity, index) => {
      // Vérifie que l'activité est bien définie et contient ":"
      if (!activity || typeof activity !== "string" || !activity.includes(":")) return;
  
      const [label, cost] = activity.split(":");
      const hour = 7 + index * 2;
  
      const block = document.createElement("div");
      block.className = "activity-block";
      block.style.backgroundImage = `url('/data/assets/${scenes[index]}')`;
  
      block.innerHTML = `
        <div class="time">${hour}:00</div>
        ${activity ? `<div class="bubble">${activity}</div>` : ""}
      `;

      block.addEventListener("click", () => {
        openFullscreenPopup(label.trim(), cost.trim(), `/data/assets/${scenes[index]}`);
      });
  
      container.appendChild(block);
    });
  }
  function openFullscreenPopup(label, cost, imageUrl) {
    const popup = document.createElement("div");
    popup.className = "fullscreen-popup";
    popup.innerHTML = `
      <div class="popup-content">
        <span class="close-btn">✖</span>
        <br>
        <br>
        <img src="${imageUrl}" alt="${label}" />
        <h3>${label}</h3>
        <p>${cost}</p>
      </div>
    `;
  
    document.body.appendChild(popup);
  
    // Fermer au clic
    popup.querySelector(".close-btn").addEventListener("click", () => {
      popup.remove();
    });
  }
  
  function drawComparisonGraph(c1, c2) {
    const margin = { top: 100, right: 30, bottom: 150, left: 60 };
    const width = 960 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    const totalWidth = width + margin.left + margin.right;
    const totalHeight = height + margin.top + margin.bottom;
  
    const svgContainer = d3.select("#comparison-graph")
      .html("") // clear before redraw
      .append("svg")
      .attr("width", totalWidth)
      .attr("height", totalHeight)
      .style("background", "url('/data/assets/starfield.gif') center center / cover no-repeat");
  
    svgContainer.insert("rect", ":first-child")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", totalWidth)
      .attr("height", totalHeight)
      .attr("fill", "rgba(10,10,30, 0.6)")
      .attr("rx", 24);
  
    const svg = svgContainer.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    // --- Secure mapping of activity labels and costs ---
    const parseCountry = (country) =>
      (data[country]?.activities || []).map(a => {
        const parts = a?.split(":");
        if (!parts || parts.length < 2) return null;
        return {
          label: parts[0].trim(),
          cost: parseFloat(parts[1].replace("€", "").trim())
        };
      }).filter(d => d && d.label && !isNaN(d.cost));
  
    const map1 = parseCountry(c1);
    const map2 = parseCountry(c2);
  
    const sharedLabels = map1.map(d => d.label).filter(label =>
      map2.find(d => d.label === label)
    );
  
    const activities = sharedLabels.map(label => ({
      label,
      cost1: map1.find(d => d.label === label).cost,
      cost2: map2.find(d => d.label === label).cost,
    }));
  
    const labels = activities.map(d => d.label);
    const costs1 = activities.map(d => d.cost1);
    const costs2 = activities.map(d => d.cost2);
  
    const x = d3.scalePoint().domain(labels).range([0, width]).padding(0.5);
    const y = d3.scaleLinear()
      .domain([0, d3.max([...costs1, ...costs2]) * 1.2])
      .range([height, 0]);
  
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "middle")
      .attr("transform", "rotate(-15)")
      .attr("dy", "3.5em")
      .style("fill", "#ffffffdd")
      .style("font-size", "10px")
      .style("font-family", "'Press Start 2P', monospace");
  
    svg.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill", "#ffffffcc")
      .style("font-family", "'Press Start 2P', monospace");
  
    const line = d3.line()
      .x((d, i) => x(labels[i]))
      .y(d => y(d))
      .curve(d3.curveMonotoneX);
  
    svg.append("path")
      .datum(costs1)
      .attr("fill", "none")
      .attr("stroke", "#8a8aff")
      .attr("stroke-width", 2.5)
      .attr("filter", "url(#glow1)")
      .attr("d", line);
  
    svg.append("path")
      .datum(costs2)
      .attr("fill", "none")
      .attr("stroke", "#3f3f9c")
      .attr("stroke-width", 2.5)
      .attr("filter", "url(#glow2)")
      .attr("d", line);
  
    const defs = svgContainer.append("defs");
    defs.append("filter").attr("id", "glow1")
      .append("feGaussianBlur").attr("stdDeviation", "3.5").attr("result", "coloredBlur");
    defs.append("filter").attr("id", "glow2")
      .append("feGaussianBlur").attr("stdDeviation", "3.5").attr("result", "coloredBlur");
  
    const tooltip = d3.select("body").append("div")
      .attr("class", "space-tooltip")
      .style("position", "absolute")
      .style("background", "#0f0f3a")
      .style("color", "#fff")
      .style("border", "2px dashed rgb(183, 233, 255)")
      .style("padding", "0.5rem 1rem")
      .style("border-radius", "10px")
      .style("font-size", "10px")
      .style("pointer-events", "none")
      .style("opacity", 0);
  
    [costs1, costs2].forEach((costArray, idx) => {
      svg.selectAll(`.dot-${idx}`)
        .data(costArray)
        .enter()
        .append("circle")
        .attr("class", `dot-${idx}`)
        .attr("cx", (d, i) => x(labels[i]))
        .attr("cy", d => y(d))
        .attr("r", 5)
        .attr("fill", idx === 0 ? "#8a8aff" : "#3f3f9c")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.2)
        .on("mouseover", (event, d) => {
          tooltip
            .html(`<strong>${idx === 0 ? c1 : c2}</strong><br>${d.toFixed(2)} €`)
            .style("left", event.pageX + 12 + "px")
            .style("top", event.pageY - 24 + "px")
            .style("opacity", 1);
        })
        .on("mouseout", () => tooltip.style("opacity", 0));
    });
  
    // Légende espacée à gauche et droite
    svg.append("circle").attr("cx", 20).attr("cy", -40).attr("r", 6).attr("fill", "#8a8aff");
    svg.append("text").attr("x", 32).attr("y", -35).text(c1)
      .style("fill", "#fff").style("font-size", "10px").style("font-family", "'Press Start 2P'");
  
    svg.append("circle").attr("cx", width - 120).attr("cy", -40).attr("r", 6).attr("fill", "#3f3f9c");
    svg.append("text").attr("x", width - 108).attr("y", -35).text(c2)
      .style("fill", "#fff").style("font-size", "10px").style("font-family", "'Press Start 2P'");
  }
  
  
  
  
  
  
  
