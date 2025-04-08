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

    block.innerHTML = `
      <div class="time">${hour}:00</div>
      <div class="bubble">${activity}</div>
    `;
    container.appendChild(block);
  });
}

function drawComparisonGraph(c1, c2) {
    const margin = { top: 40, right: 30, bottom: 90, left: 60 };
    const width = 900 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
  
    const svg = d3.select("#comparison-graph")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    // 🔐 Fonction robuste pour extraire les coûts
    function getCosts(country) {
      return data[country].activities.map((a) => {
        if (!a || typeof a !== "string") return 0;
        const parts = a.split(":");
        if (parts.length < 2) return 0;
        const num = parseFloat(parts[1].replace("€", "").trim());
        return isNaN(num) ? 0 : num;
      });
    }
  
    const labels = data[c1].activities.map((a, i) => `${7 + i * 2}:00`);
    const costs1 = getCosts(c1);
    const costs2 = getCosts(c2);
  
    const x = d3.scalePoint().domain(labels).range([0, width]).padding(0.5);
    const y = d3.scaleLinear()
      .domain([0, d3.max([...costs1, ...costs2]) * 1.2])
      .range([height, 0]);
  
    // 🧭 Axes
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-40)")
      .style("text-anchor", "end")
      .style("fill", "#fff")
      .style("font-size", "10px");
  
    svg.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill", "#fff");
  
    // 📈 Courbes
    const line = d3.line()
      .x((d, i) => x(labels[i]))
      .y((d) => y(d))
      .curve(d3.curveMonotoneX);
  
    svg.append("path")
      .datum(costs1)
      .attr("fill", "none")
      .attr("stroke", "#38bdf8")
      .attr("stroke-width", 3)
      .attr("d", line);
  
    svg.append("path")
      .datum(costs2)
      .attr("fill", "none")
      .attr("stroke", "#f472b6")
      .attr("stroke-width", 3)
      .attr("d", line);
  
    // 🪄 Tooltip
    const tooltip = d3.select("body").append("div")
      .style("position", "absolute")
      .style("padding", "6px 12px")
      .style("background", "#000")
      .style("color", "#fff")
      .style("border-radius", "8px")
      .style("font-size", "11px")
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
        .attr("fill", idx === 0 ? "#38bdf8" : "#f472b6")
        .on("mouseover", (event, d) => {
          tooltip
            .html(`${idx === 0 ? c1 : c2} : ${d.toFixed(2)}€`)
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 20 + "px")
            .style("opacity", 1);
        })
        .on("mouseout", () => tooltip.style("opacity", 0));
    });
  
    // 🧾 Légendes
    svg.append("circle").attr("cx", 0).attr("cy", -20).attr("r", 6).attr("fill", "#38bdf8");
    svg.append("text").attr("x", 12).attr("y", -15).text(c1).style("fill", "#fff").style("font-size", "11px");
  
    svg.append("circle").attr("cx", 100).attr("cy", -20).attr("r", 6).attr("fill", "#f472b6");
    svg.append("text").attr("x", 112).attr("y", -15).text(c2).style("fill", "#fff").style("font-size", "11px");
  }
  
  
