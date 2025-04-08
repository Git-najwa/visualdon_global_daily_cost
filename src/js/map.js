import { drawCircularChart } from './circularChart.js';

drawCircularChart(); // Appel du graphique radar

const svg = d3.select("#map");
svg.attr("width", 1200).attr("height", 600); // Taille personnalisée

const width = +svg.attr("width");
const height = +svg.attr("height");

const projection = d3.geoMercator()
  .scale(125)
  .translate([width / 2, height / 1.45]);

const path = d3.geoPath().projection(projection);

let selectedCountries = [];

Promise.all([
  d3.json("https://unpkg.com/world-atlas@2/countries-110m.json"),
  d3.json("/data/data.json")
]).then(([worldData, costData]) => {

  const altNames = {
    "Japan": "Japan",
    "France": "France"
    // Ajoute ici d'autres corrections de nom si nécessaire
  };

  const countries = topojson.feature(worldData, worldData.objects.countries).features;

  svg.selectAll("path")
    .data(countries)
    .join("path")
    .attr("class", "map-path")
    .attr("d", path)
    .attr("fill", d => {
      const name = altNames[d.properties.name] || d.properties.name;
      return costData[name] ? "#3b82f6" : "#1111aa";
    })
    .attr("stroke", "#000033")
    .attr("stroke-width", 0.5)
    .on("mouseover", function () {
      d3.select(this).attr("fill", "#ff00cc");
    })
    .on("mouseout", function (event, d) {
      const name = altNames[d.properties.name] || d.properties.name;
      if (!selectedCountries.includes(name)) {
        d3.select(this).attr("fill", costData[name] ? "#3b82f6" : "#1111aa");
      }
    })
    .on("click", function (event, d) {
      const name = altNames[d.properties.name] || d.properties.name;
      if (!costData[name]) return;

      // Toggle sélection
      if (selectedCountries.includes(name)) {
        selectedCountries = selectedCountries.filter(c => c !== name);
        d3.select(this).attr("fill", "#3b82f6");
      } else {
        if (selectedCountries.length < 2) {
          selectedCountries.push(name);
          d3.select(this).attr("fill", "#ff00cc");
        }
      }

      // Rocket visuelle (facultatif)
      const [x, y] = projection(d3.geoCentroid(d));
      const rocket = document.getElementById("rocket");
      if (rocket) {
        rocket.style.left = `${x + 100}px`;
        rocket.style.top = `${y}px`;
      }

      // Affichage des infos
      if (costData[name]) {
        document.getElementById("country-name").textContent = name;
        document.getElementById("daily-cost").textContent = `Coût moyen par jour : ${costData[name].cost}`;
        document.getElementById("country-info").classList.remove("hidden");
      } else {
        document.getElementById("country-info").classList.add("hidden");
      }

      document.getElementById("day-simulation").classList.add("hidden");

      // Redirection si 2 pays sélectionnés
      if (selectedCountries.length === 2) {
        const [c1, c2] = selectedCountries;
        window.location.href = `compare.html?country1=${encodeURIComponent(c1)}&country2=${encodeURIComponent(c2)}`;
      }
    });
});
