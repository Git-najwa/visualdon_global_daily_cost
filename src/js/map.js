import { drawCircularChart } from './circularChart.js';
drawCircularChart();

// Modifier la création de la carte pour qu'elle s'adapte au conteneur
const svg = d3.select("#map");

// Définir des dimensions fixes pour la carte
const width = 1300;  // Augmenté de 1100 à 1300
const height = 800;  // Augmenté de 700 à 800

svg.attr("width", width)
   .attr("height", height)
   .attr("viewBox", `0 0 ${width} ${height}`)
   .attr("preserveAspectRatio", "xMidYMid meet");

// Ajuster la projection pour ces nouvelles dimensions
const projection = d3.geoMercator()
  .scale(180)  // Augmenté de 160 à 180
  .center([0, 30]) // Centrer la carte
  .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

let selectedCountries = [];
let selectedCharacter = null;
const characterImg = document.getElementById("character");
const rocket = document.getElementById("rocket");

const characterMap = {
  1: "avatar1.gif",
  2: "avatar2.png",
  3: "avatar3.webp"
};

document.querySelectorAll(".character-option").forEach(option => {
  option.addEventListener("click", () => {
    document.querySelectorAll(".character-option").forEach(opt => opt.classList.remove("selected"));
    option.classList.add("selected");

    const avatar = option.dataset.character;
    selectedCharacter = avatar;

    characterImg.src = `./data/assets/${characterMap[avatar]}`;
    characterImg.classList.remove("hidden");

    characterImg.onload = () => {
      positionAvatarInRocket();
    };
  });
});

function positionAvatarInRocket() {
  const rocketRect = rocket.getBoundingClientRect();
  const mapRect = document.getElementById("map-container").getBoundingClientRect();

  const avatarSize = characterImg.offsetWidth || 50;
  const offsetLeft = rocketRect.left - mapRect.left;
  const offsetTop = rocketRect.top - mapRect.top;

  characterImg.style.left = `${offsetLeft + rocketRect.width / 2 - avatarSize / 2}px`;
  characterImg.style.top = `${offsetTop + rocketRect.height / 2 - avatarSize / 2}px`;
  characterImg.style.position = "absolute";
  characterImg.style.transition = "all 0.4s ease";
}

Promise.all([
  d3.json("https://unpkg.com/world-atlas@2/countries-110m.json"),
  d3.json("../../data/data.json")
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

      d3.select("#tooltip")
        .style("left", `${event.pageX + 15}px`)
        .style("top", `${event.pageY - 40}px`)
        .html(`
          <div class="tooltip-title">${name}</div>
          <div class="tooltip-cost">${cost} / jour</div>
        `)
        .classed("hidden", false);
    })
    .on("click", function (event, d) {
      event.stopPropagation();

      const name = altNames[d.properties.name] || d.properties.name;
      if (!costData[name]) return;

      // Gestion sélection
      if (selectedCountries.includes(name)) {
        selectedCountries = selectedCountries.filter(c => c !== name);
        d3.select(this).attr("fill", "#3b82f6");
      } else {
        if (selectedCountries.length < 2) {
          selectedCountries.push(name);
          d3.select(this).attr("fill", "#ff00cc");
        }
      }

      // Positionner la fusée et le personnage
      const [x, y] = projection(d3.geoCentroid(d));

      if (rocket) {
        rocket.style.left = `${x}px`;
        rocket.style.top = `${y}px`;
      }

      if (selectedCharacter) {
        characterImg.classList.remove("hidden");
        const offsetX = 30;
        const offsetY = 20;
        characterImg.style.left = `${x - offsetX}px`;
        characterImg.style.top = `${y - offsetY}px`;
      }

      // Info box
      const infoBox = document.getElementById("country-info");
      infoBox.classList.remove("hidden");
      document.getElementById("day-simulation").classList.add("hidden");

      if (selectedCountries.length === 2) {
        const [c1, c2] = selectedCountries;

        infoBox.innerHTML = `
          <h2 class="text-xl mb-4 text-pink-400">Comparaison</h2>
          <p class="mb-4">Tu as sélectionné <span class="text-yellow-300">${c1}</span> et <span class="text-yellow-300">${c2}</span>.</p>
          <p class="mb-4">Souhaites-tu les comparer ?</p>
          <button id="confirm-compare" onclick="compareSelectedCountries()">VOIR LA COMPARAISON</button>
        `;

        setTimeout(() => {
          document.getElementById("confirm-compare").addEventListener("click", () => {
            window.location.href = `compare.html?country1=${encodeURIComponent(c1)}&country2=${encodeURIComponent(c2)}`;
          });
        }, 50);
      } else {
        infoBox.innerHTML = `
          <h2 id="country-name">${name}</h2>
          <p id="daily-cost">Coût moyen par jour : ${costData[name].cost}</p>
          <button onclick="startSimulation()">VOIR UNE JOURNÉE TYPE</button>
        `;
      }
    });

  // ✅ Reset si clic en dehors
  svg.on("click", function (event) {
    if (event.target.tagName !== "path") {
      selectedCountries = [];

      svg.selectAll(".map-path")
        .attr("fill", d => {
          const name = altNames[d.properties.name] || d.properties.name;
          return costData[name] ? "#3b82f6" : "#1111aa";
        });

      const infoBox = document.getElementById("country-info");
      infoBox.classList.add("hidden");

      infoBox.innerHTML = `
        <h2 id="country-name">Pays</h2>
        <p id="daily-cost">Coût moyen par jour : XX€</p>
        <button onclick="startSimulation()">VOIR UNE JOURNÉE TYPE</button>
      `;
    }
  });

  function showInitialInstructions() {
    const instructions = d3.select("#map-container")
      .append("div")
      .attr("class", "map-instructions")
      .style("position", "absolute")
      .style("top", "10px")
      .style("left", "50%")
      .style("transform", "translateX(-50%)")
      .style("text-align", "center")
      .style("background", "rgba(0,0,0,0.8)")
      .style("padding", "10px")
      .style("border-radius", "8px")
      .style("border", "2px solid #38bdf8")
      .style("pointer-events", "none");

    instructions.html(`
      <p>🌟 Cliquez sur un pays pour découvrir une journée type</p>
      <p>✨ Ou sélectionnez deux pays pour les comparer !</p>
    `);

    // Faire disparaître les instructions après la première interaction
    d3.selectAll(".map-path").on("click.instructions", function() {
      instructions.remove();
      d3.selectAll(".map-path").on("click.instructions", null);
    });
  }

  showInitialInstructions();
});
