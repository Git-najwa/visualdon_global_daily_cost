const svg = d3.select("#map");
const width = +svg.attr("width");
const height = +svg.attr("height");

const projection = d3.geoMercator().scale(90).translate([width / 2, height / 1.5]);
const path = d3.geoPath().projection(projection);

Promise.all([
  d3.json("https://unpkg.com/world-atlas@2/countries-110m.json"),
  d3.json("/data/data.json")
]).then(([worldData, costData]) => {
  const altNames = {
    "United States of America": "United States of America",
    "Japan": "Japan",
    "France": "France"
  };

  const countries = topojson.feature(worldData, worldData.objects.countries).features;

  svg.selectAll("path")
    .data(countries)
    .join("path")
    .attr("d", path)
    .attr("fill", d => costData[altNames[d.properties.name] || d.properties.name] ? "#3b82f6" : "#1111aa")
    .attr("stroke", "#000033")
    .attr("stroke-width", 0.5)
    .on("mouseover", function () {
      d3.select(this).attr("fill", "#ff00cc");
    })
    .on("mouseout", function (event, d) {
      const countryName = altNames[d.properties.name] || d.properties.name;
      d3.select(this).attr("fill", costData[countryName] ? "#3b82f6" : "#1111aa");
    })
    .on("click", function (event, d) {
      const [x, y] = projection(d3.geoCentroid(d));
      const rocket = document.getElementById("rocket");
      rocket.style.left = `${x + 100}px`;
      rocket.style.top = `${y}px`;

      const countryName = d.properties.name || "Inconnu";
      const displayName = altNames[countryName] || countryName;

      // Reset des couleurs
      d3.selectAll("path").attr("fill", d =>
        costData[altNames[d.properties.name] || d.properties.name] ? "#3b82f6" : "#1111aa"
      );
      d3.select(this).attr("fill", "#ff00cc");

      if (costData[displayName]) {
        document.getElementById("country-name").textContent = displayName;
        document.getElementById("daily-cost").textContent = `Coût moyen par jour : ${costData[displayName].cost}`;
        document.getElementById("country-info").classList.remove("hidden");
      } else {
        document.getElementById("country-info").classList.add("hidden");
      }

      document.getElementById("day-simulation").classList.add("hidden");
    });
});
