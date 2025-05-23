import * as d3 from 'd3';

// Réduire les dimensions du graphique
export function drawCircularChart() {
  const width = 900;
  const height = 900;
  const innerRadius = 100;
  const outerRadius = Math.min(width, height) / 2 - 60;

  // Création du tooltip 
  const tooltip = d3.select("body") // Changement ici : on l'attache au body
    .append("div")
    .attr("class", "tooltip")
    .style("position", "fixed") // Changement ici : fixed au lieu de absolute
    .style("visibility", "hidden")
    .style("background", "rgba(0, 0, 0, 0.9)")
    .style("border", "2px solid #38bdf8")
    .style("border-radius", "8px")
    .style("padding", "12px")
    .style("font-family", "'Press Start 2P', cursive")
    .style("font-size", "10px")
    .style("color", "white")
    .style("pointer-events", "none")
    .style("z-index", "9999") // Augmentation du z-index pour être sûr qu'il soit au-dessus
    .style("box-shadow", "0 0 15px rgba(56, 189, 248, 0.3)");

  const svg = d3.select("#circular-barplot")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("display", "block")
    .style("margin", "0 auto")
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  // Modifier ces paramètres dans la fonction drawCircularChart()
  const x = d3.scaleBand()
    .range([0, 2 * Math.PI])
    .align(0)
    .padding(0.01); // Réduire le padding pour avoir des segments plus larges (était 0.03)
  const y = d3.scaleRadial().range([innerRadius, outerRadius]);
  // Modifier la palette de couleurs pour mieux différencier les jaunes tout en gardant l'aspect solaire
  const z = d3.scaleOrdinal().range([
    "#FFF9DB", // Eau et électricité (jaune très clair, presque blanc)
    "#FFE066", // Petit-déjeuner (jaune moyen, plus vif)
    "#FFA94D", // Transport (orange clair)
    "#fb923c", // Courses (orange moyen)
    "#f97316", // Souper (orange vif)
    "#ea580c", // Activité (orange foncé)
    "#c2410c"  // Loyer (orange très foncé/brun)
  ]);

  d3.json('./data/data.json').then(rawData => {
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
      .attr("filter", "url(#solar-glow)")
      .lower();

    // Ajouter le filtre pour l'effet lumineux
    const defs = svg.append("defs");
    const filter = defs.append("filter")
      .attr("id", "solar-glow");

    filter.append("feGaussianBlur")
      .attr("stdDeviation", "5")
      .attr("result", "coloredBlur");

    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode")
      .attr("in", "coloredBlur");
    feMerge.append("feMergeNode")
      .attr("in", "SourceGraphic");

    // Ajuster les segments pour qu'ils soient plus larges
    svg.append("g")
      .selectAll("g")
      .data(series)
      .join("g")
      .attr("fill", d => z(d.key))
      .selectAll("path")
      .data(d => d)
      .join("path")
      .attr("class", "segment")
      .attr("data-name", d => d.data.country)
      .attr("d", d3.arc()
        .innerRadius(d => y(d[0]))
        .outerRadius(d => y(d[1]))
        .startAngle(d => x(d.data.country))
        .endAngle(d => x(d.data.country) + x.bandwidth())
        .padAngle(0.01)
        .padRadius(innerRadius))
      .style("stroke", "#000")
      .style("stroke-width", "0.5px")
      .style("stroke-opacity", 0.2)
      .on("mouseover", function(event, d) {
        const category = d3.select(this.parentNode).datum().key;
        const country = d.data.country;
        const value = (d[1] - d[0]).toFixed(2);
        
        // Mise en évidence du segment
        d3.select(this)
          .style("filter", "brightness(1.2)")
          .style("stroke-width", "2px")
          .style("stroke-opacity", "1");

        // Affichage du tooltip
        tooltip
          .style("visibility", "visible")
          .html(`
            <div style="margin-bottom: 8px; color: #38bdf8">${country}</div>
            <div>${category}: ${value}€</div>
          `)
          .style("left", (event.clientX + 15) + "px") // Utilisation de clientX au lieu de pageX
          .style("top", (event.clientY - 20) + "px"); // Utilisation de clientY au lieu de pageY
      })
      .on("mousemove", function(event) {
        tooltip
          .style("left", (event.clientX + 15) + "px") // Utilisation de clientX au lieu de pageX
          .style("top", (event.clientY - 20) + "px"); // Utilisation de clientY au lieu de pageY
      })
      .on("mouseout", function() {
        // Réinitialisation du style du segment
        d3.select(this)
          .style("filter", "none")
          .style("stroke-width", "0.5px")
          .style("stroke-opacity", "0.2");
        
        // Masquer le tooltip
        tooltip.style("visibility", "hidden");
      });

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

    // Modifier la partie de création de la légende
    const legendItems = legend.selectAll("g")
      .data(categories.slice().reverse())
      .join("g")
      .attr("transform", (d, i) => `translate(-40, ${(i - categories.length / 2) * 18})`)
      .style("cursor", "pointer") // Ajouter un curseur pointer
      .on("click", function(event, category) {
        const paths = svg.selectAll("path");
        const currentOpacity = paths.style("opacity");
        
        // Réinitialiser tous les segments
        paths.style("opacity", 0.1);
        
        // Si on clique sur la même catégorie à nouveau, tout réinitialiser
        if (currentOpacity === "0.1") {
          paths.style("opacity", 1);
        } else {
          // Mettre en évidence les segments de la catégorie sélectionnée
          svg.selectAll("path")
            .filter(function(d) {
              // Récupérer la catégorie du segment
              return d3.select(this.parentNode).datum().key === category;
            })
            .style("opacity", 1);
        }
      });

    // Ajouter un effet de survol sur les éléments de la légende
    legendItems
      .on("mouseover", function() {
        d3.select(this)
          .style("opacity", 0.7);
      })
      .on("mouseout", function() {
        d3.select(this)
          .style("opacity", 1);
      });

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
    const searchInput = document.getElementById("circular-search"); // Modifier l'id ici

    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase();

      // Réinitialiser tous les segments
      svg.selectAll("path")
        .style("opacity", 1)
        .style("filter", "none");

      if (!searchTerm) return;

      // Assombrir tous les segments
      svg.selectAll("path")
        .style("opacity", 0.2);

      // Mettre en évidence les segments correspondants
      svg.selectAll("path")
        .filter(function() {
          const country = d3.select(this).attr("data-name")?.toLowerCase();
          return country && country.includes(searchTerm);
        })
        .style("opacity", 1)
        .style("filter", "brightness(1.2)");
    });
  });
}
