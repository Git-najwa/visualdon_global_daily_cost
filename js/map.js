const svg = d3.select("#map");
const width = +svg.attr("width");
const height = +svg.attr("height");

const projection = d3.geoMercator().scale(100).translate([width / 2, height / 1.5]);
const path = d3.geoPath().projection(projection);

Promise.all([
  d3.json("https://unpkg.com/world-atlas@2/countries-110m.json"),
  d3.json("data/data.json")
]).then(([worldData, costData]) => {
  const countries = topojson.feature(worldData, worldData.objects.countries).features;

  svg.selectAll("path")
    .data(countries)
    .join("path")
    .attr("d", path)
    .attr("fill", "#4a5568")
    .attr("stroke", "#2d3748")
    .on("click", function (event, d) {
      d3.selectAll("path").attr("fill", "#4a5568"); // Reset
  d3.select(this).attr("fill", "#4299e1"); // Highlight
      const countryName = d.properties.name || "Inconnu";
      if (costData[countryName]) {
        document.getElementById("country-name").textContent = countryName;
        document.getElementById("daily-cost").textContent = `Coût moyen par jour : ${costData[countryName].cost}`;
        document.getElementById("country-info").classList.remove("hidden");
      } else {
        document.getElementById("country-info").classList.add("hidden");
      }

      document.getElementById("day-simulation").classList.add("hidden");
    });
    
});

