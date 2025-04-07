import * as d3 from 'd3';

export function drawCircularChart() {
  const width = 720;
  const height = 720;
  const innerRadius = 120;
  const outerRadius = Math.min(width, height) / 2 - 40;

  const svg = d3.select("#circular-barplot")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("display", "block")
    .style("margin", "0 auto")
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const x = d3.scaleBand().range([0, 2 * Math.PI]).align(0);
  const y = d3.scaleRadial().range([innerRadius, outerRadius]);
  const z = d3.scaleOrdinal().range([
    "#fef9c3", // Eau et électricité (jaune pâle)
  "#fde68a", // Petit-déjeuner
  "#fcd34d", // Transport
  "#fb923c", // Courses
  "#f97316", // Souper
  "#ea580c", // Activité
  "#c2410c"  // Loyer
  ]);

  const tooltip = d3.select("#circular-barplot")
    .append("div")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background", "rgba(0,0,0,0.8)")
    .style("color", "#fff")
    .style("padding", "6px 10px")
    .style("border-radius", "4px")
    .style("font-size", "12px")
    .style("pointer-events", "none")
    .style("z-index", "5");

  d3.json('../../data/data.json').then(rawData => {
    const countries = Object.keys(rawData);
    const categories = [
      "Eau et électricité", "Petit-déjeuner", "Transport",
      "Courses", "Souper", "Activité", "Loyer"
    ];
    z.domain(categories);

    const data = countries.map(country => {
      const values = {};
      (rawData[country].activities || []).forEach(entry => {
        if (entry && entry.includes(':')) {
          const [key, val] = entry.split(': ');
          values[key] = +val.replace('€', '');
        }
      });
      return { country, ...values };
    });

    x.domain(data.map(d => d.country));
    y.domain([0, d3.max(data, d => d3.sum(categories, k => d[k] || 0))]);

    const stack = d3.stack().keys(categories);
    const series = stack(data);

    // Fond
    svg.append("circle")
      .attr("r", outerRadius + 20)
      .attr("fill", "rgba(255, 255, 255, 0.07)")
      .lower();

    // Barres
    svg.append("g")
      .selectAll("g")
      .data(series)
      .join("g")
      .attr("fill", d => z(d.key))
      .selectAll("path")
      .data(d => d)
      .join("path")
      .attr("data-name", d => d.data.country)
      .attr("d", d3.arc()
        .innerRadius(d => y(d[0]))
        .outerRadius(d => y(d[1]))
        .startAngle(d => x(d.data.country))
        .endAngle(d => x(d.data.country) + x.bandwidth())
        .padAngle(0.01)
        .padRadius(innerRadius))
      .on("mouseover", function (event, d) {
        const category = this.parentNode.__data__.key;
        const country = d.data.country;
        const value = d.data[category];
        tooltip
          .html(`<strong>${country}</strong><br>${category}: ${value} €`)
          .style("visibility", "visible");
      })
      .on("mousemove", function (event) {
        tooltip
          .style("top", (event.pageY - 40) + "px")
          .style("left", (event.pageX + 15) + "px");
      })
      .on("mouseout", () => tooltip.style("visibility", "hidden"));

    // Axes circulaires
    const yAxis = svg.append("g").attr("text-anchor", "middle");
    const ticks = y.ticks(6).filter(t => t > 0);

    yAxis.selectAll("circle")
      .data(ticks)
      .join("circle")
      .attr("fill", "none")
      .attr("stroke", "#888")
      .attr("stroke-width", 1.2)
      .attr("stroke-dasharray", "2 2")
      .attr("r", y);

    yAxis.selectAll("text")
      .data(ticks)
      .join("text")
      .attr("y", d => -y(d))
      .attr("dy", "0.35em")
      .attr("fill", "#fff")
      .style("font-size", "10px")
      .text(y.tickFormat(5, "s"));

    // Légende
    const legend = svg.append("g")
      .attr("transform", "translate(0, 0)");

    const legendItems = legend.selectAll("g")
      .data(categories.slice().reverse())
      .join("g")
      .attr("transform", (d, i) => `translate(-40, ${(i - categories.length / 2) * 18})`);

    legendItems.append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", z);

    legendItems.append("text")
      .attr("x", 16)
      .attr("y", 4)
      .attr("dy", "0.35em")
      .style("font-size", "8px")
      .attr("fill", "#fff")
      .selectAll("tspan")
      .data(d => d === "Eau et électricité" ? ["Eau et", "électricité"] : [d])
      .join("tspan")
      .attr("x", 16)
      .attr("dy", (d, i) => i === 0 ? "0" : "1.2em")
      .text(d => d);

    // Barre de recherche avec effet "focus"
    const searchInput = document.getElementById("country-search");

    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase();

      // Reset tout le monde
      d3.selectAll("path")
        .classed("dimmed", false);
      tooltip.style("visibility", "hidden");

      if (!searchTerm) return;

      d3.selectAll("path")
        .classed("dimmed", function () {
          const country = d3.select(this).attr("data-name")?.toLowerCase();
          return !(country && country.includes(searchTerm));
        });

      d3.selectAll("path")
        .filter(function () {
          const country = d3.select(this).attr("data-name")?.toLowerCase();
          return country && country.includes(searchTerm);
        })
        .each(function () {
          const el = d3.select(this);
          const country = el.attr("data-name");
          const parentData = d3.select(this.parentNode).datum();
          const value = el.datum().data[parentData.key];

          tooltip
            .html(`<strong>${country}</strong><br>${parentData.key}: ${value} €`)
            .style("visibility", "visible")
            .style("top", (height / 2 - outerRadius - 20) + "px")
            .style("left", "50%")
            .style("transform", "translateX(-50%)");
        });
    });
  });
}
