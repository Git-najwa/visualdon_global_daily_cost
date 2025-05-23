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
    if (!activity || typeof activity !== "string" || !activity.includes(":")) return;
    const [label, cost] = activity.split(":");
    const hour = 7 + index * 2;

    const block = document.createElement("div");
    block.className = "activity-block";
    block.style.backgroundImage = `url('./data/assets/${scenes[index]}')`;

    block.innerHTML = `
      <div class="time">${hour}:00</div>
      <div class="bubble">${label.trim()}: ${cost.trim()}</div>
    `;

    block.addEventListener("click", () => {
      openFullscreenActivityPopup(label.trim(), cost.trim(), `./data/assets/${scenes[index]}`);
    });

    container.appendChild(block);
  });
}

function openFullscreenActivityPopup(label, cost, imageUrl) {
  const popup = document.createElement("div");
  popup.className = "fullscreen-popup";
  popup.innerHTML = `
    <div class="popup-content popup-activity">
      <span class="close-btn">✖</span>
      <br>
      <br>
      <br>
      <br>
      <br>
      <img src="${imageUrl}" alt="${label}" />
      <h3>${label}</h3>
      <p>${cost}</p>
    </div>
  `;
  document.body.appendChild(popup);

  popup.querySelector(".close-btn").addEventListener("click", () => {
    popup.remove();
  });
}

function drawComparisonGraph(c1, c2, containerSelector = "#comparison-graph", widthOverride = null) {
    const margin = { top: 100, right: 30, bottom: 150, left: 60 };
    const width = (widthOverride || 960) - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
  
    const totalWidth = width + margin.left + margin.right;
    const totalHeight = height + margin.top + margin.bottom;
  
    const svgContainer = d3.select(containerSelector)
      .html("")
      .append("svg")
      .attr("viewBox", `0 0 ${totalWidth} ${totalHeight}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("display", "block")
      .style("width", "100%")
      .style("height", "100%")
      .on("click", () => {
        if (containerSelector === "#comparison-graph") showFullscreenGraph(c1, c2);
      });
  
    const svg = svgContainer.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
  
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -60)
      .attr("text-anchor", "middle")
      .style("fill", "#fff")
      .style("font-family", "'Press Start 2P', monospace")
      .style("font-size", "12px");
  
    const parseCountry = (country) =>
      (data[country]?.activities || []).map(a => {
        const parts = a?.split(":");
        if (!parts || parts.length < 2) return null;
        return { label: parts[0].trim(), cost: parseFloat(parts[1].replace("€", "").trim()) };
      }).filter(d => d && d.label && !isNaN(d.cost));
  
    const map1 = parseCountry(c1);
    const map2 = parseCountry(c2);
    const sharedLabels = map1.map(d => d.label).filter(label => map2.find(d => d.label === label));
  
    const activities = sharedLabels.map(label => ({
      label,
      cost1: map1.find(d => d.label === label).cost,
      cost2: map2.find(d => d.label === label).cost,
    }));
  
    const labels = activities.map(d => d.label);
    const costs1 = activities.map(d => d.cost1);
    const costs2 = activities.map(d => d.cost2);
  
    const x = d3.scalePoint().domain(labels).range([0, width]).padding(1);
    const y = d3.scaleLinear()
      .domain([0, Math.ceil(d3.max([...costs1, ...costs2]) / 5) * 5])
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
      .call(d3.axisLeft(y).ticks(Math.ceil(y.domain()[1] / 5)))
      .selectAll("text")
      .style("fill", "#ffffffcc")
      .style("font-family", "'Press Start 2P', monospace");
  
    const line = d3.line()
      .x((d, i) => x(labels[i]))
      .y(d => y(d))
      .curve(d3.curveMonotoneX);
  
    [costs1, costs2].forEach((costArray, idx) => {
      svg.append("path")
        .datum(costArray)
        .attr("d", line)
        .attr("stroke", idx === 0 ? "#8a8aff" : "#ec4899")
        .attr("stroke-width", 2.5)
        .attr("fill", "none")
        .attr("stroke-dasharray", function() {
          const length = this.getTotalLength();
          return `${length} ${length}`;
        })
        .attr("stroke-dashoffset", function() {
          return this.getTotalLength();
        })
        .transition()
        .duration(5000)
        .ease(d3.easeCubicInOut)
        .attr("stroke-dashoffset", 0);
    });
  
    [costs1, costs2].forEach((costArray, idx) => {
      svg.selectAll(`.dot-${idx}`)
        .data(costArray)
        .enter()
        .append("circle")
        .attr("cx", (d, i) => x(labels[i]))
        .attr("cy", d => y(d))
        .attr("r", 5)
        .attr("fill", idx === 0 ? "#8a8aff" : "#ec4899")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.2)
        .on("mouseover", function (event, d) {
          const i = costArray.indexOf(d);
          const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background", "#000000cc")
            .style("color", "#fff")
            .style("padding", "8px 12px")
            .style("border-radius", "10px")
            .style("font-family", "'Press Start 2P', monospace")
            .style("font-size", "10px")
            .style("pointer-events", "auto")
            .style("z-index", "9999")
            .html(`
              <div class="tooltip-title"> Activité : ${labels[i]}</div>
              <div class="tooltip-cost" style="margin-top: 0.8rem;"> Coût : ${d}€</div>
            `);
  
          tooltip.style("left", (event.pageX + 10) + "px")
                 .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", () => d3.selectAll(".tooltip").remove());
    });
  
    svg.append("circle").attr("cx", 20).attr("cy", -40).attr("r", 6).attr("fill", "#8a8aff");
    svg.append("text").attr("x", 32).attr("y", -35).text(c1).style("fill", "#fff").style("font-size", "10px");
    svg.append("circle").attr("cx", width - 120).attr("cy", -40).attr("r", 6).attr("fill", "#ec4899");
    svg.append("text").attr("x", width - 108).attr("y", -35).text(c2).style("fill", "#fff").style("font-size", "10px");
  }
  
  function showFullscreenGraph(c1, c2) {
    const popup = document.createElement("div");
    popup.className = "fullscreen-popup";
    popup.innerHTML = `
     <div class="popup-content graph-popup">
    <span class="close-btn">✖</span>
    <div class="graph-wrapper">
      <div id="fullscreen-graph"></div>
    </div>
  </div>
    `;
    document.body.appendChild(popup);
    popup.querySelector(".close-btn").addEventListener("click", () => popup.remove());
    drawComparisonGraph(c1, c2, "#fullscreen-graph", 1150);
  }
