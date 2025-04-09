import { drawCircularChart } from './circularChart.js';
drawCircularChart();

const svg = d3.select("#map");
svg.attr("width", 1200).attr("height", 620);

const width = +svg.attr("width");
const height = +svg.attr("height");

const projection = d3.geoMercator()
  .scale(125)
  .translate([width / 2.1, height / 1.5]);

const path = d3.geoPath().projection(projection);

let selectedCountries = [];
let selectedCharacter = null;
const characterImg = document.getElementById("character");
const rocket = document.getElementById("rocket");

// ✅ Map des avatars
const characterMap = {
  patrick: "avatar1.png",
  amongus: "avatar2.png",
  keroppi: "avatar3.webp"
};

// ✅ Choix du personnage
document.querySelectorAll(".character-option").forEach(option => {
  option.addEventListener("click", () => {
    document.querySelectorAll(".character-option").forEach(opt => opt.classList.remove("selected"));
    option.classList.add("selected");

    const avatar = option.dataset.character;
    selectedCharacter = avatar;

    characterImg.src = `/data/assets/${characterMap[avatar]}`;
    characterImg.classList.remove("hidden");

    // ✅ Attendre que l’image de l’avatar soit chargée AVANT de le positionner
    characterImg.onload = () => {
      positionAvatarInRocket();
    };
  });
});

// ✅ Fonction qui place l’avatar au centre de la fusée
function positionAvatarInRocket() {
  const rocketRect = rocket.getBoundingClientRect();
  const mapRect = document.getElementById("map-container").getBoundingClientRect();

  const avatarSize = characterImg.offsetWidth || 50; // fallback
  const offsetLeft = rocketRect.left - mapRect.left;
  const offsetTop = rocketRect.top - mapRect.top;

  characterImg.style.left = `${offsetLeft + rocketRect.width / 2 - avatarSize / 2}px`;
  characterImg.style.top = `${offsetTop + rocketRect.height / 2 - avatarSize / 2}px`;
  characterImg.style.position = "absolute";
  characterImg.style.transition = "all 0.4s ease";
}


Promise.all([
  d3.json("https://unpkg.com/world-atlas@2/countries-110m.json"),
  d3.json("/data/data.json")
]).then(([worldData, costData]) => {
  const altNames = {
    "Japan": "Japan",
    "France": "France"
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
      d3.select("#tooltip").classed("hidden", true);
    })
    .on("mousemove", function (event, d) {
      const name = altNames[d.properties.name] || d.properties.name;
      const cost = costData[name]?.cost ?? "Données indisponibles";
    
      const tooltip = d3.select("#tooltip");
    
      tooltip
        .style("left", `${event.pageX + 15}px`)
        .style("top", `${event.pageY - 40}px`)
        .html(`
          <div class="tooltip-title">${name}</div>
          <div class="tooltip-cost"> ${cost} / jour</div>
        `)
        .classed("hidden", false);
    })
    
    .on("click", function (event, d) {
      event.stopPropagation();

      const name = altNames[d.properties.name] || d.properties.name;
      if (!costData[name]) return;

      // Gestion sélection pays
      if (selectedCountries.includes(name)) {
        selectedCountries = selectedCountries.filter(c => c !== name);
        d3.select(this).attr("fill", "#3b82f6");
      } else {
        if (selectedCountries.length < 2) {
          selectedCountries.push(name);
          d3.select(this).attr("fill", "#ff00cc");
        }
      }

      // Positionnement de la fusée et du personnage
      const [x, y] = projection(d3.geoCentroid(d));

      if (rocket) {
        rocket.style.left = `${x}px`;
        rocket.style.top = `${y}px`;
      }

      if (selectedCharacter) {
        characterImg.classList.remove("hidden");
        const offsetX = 30; // ajuste pour centrer selon taille réelle de la fusée
        const offsetY = 20;
        characterImg.style.left = `${x - offsetX}px`;
        characterImg.style.top = `${y - offsetY}px`;
      }

      // Affichage info
      document.getElementById("country-name").textContent = name;
      document.getElementById("daily-cost").textContent = `Coût moyen par jour : ${costData[name].cost}`;
      document.getElementById("country-info").classList.remove("hidden");
      document.getElementById("day-simulation").classList.add("hidden");

      // Redirection si 2 pays
      if (selectedCountries.length === 2) {
        const [c1, c2] = selectedCountries;
        window.location.href = `compare.html?country1=${encodeURIComponent(c1)}&country2=${encodeURIComponent(c2)}`;
      }
    });

  // Reset si clic en dehors
  svg.on("click", function (event) {
    if (event.target.tagName !== "path") {
      selectedCountries = [];
      svg.selectAll(".map-path")
        .attr("fill", d => {
          const name = altNames[d.properties.name] || d.properties.name;
          return costData[name] ? "#3b82f6" : "#1111aa";
        });
      document.getElementById("country-info").classList.add("hidden");
    }
  });
});
