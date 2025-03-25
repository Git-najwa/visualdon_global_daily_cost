const chartData = [
    { country: "France", cost: 75 },
    { country: "USA", cost: 85 },
    { country: "South Korea", cost: 61 },
    { country: "Germany", cost: 70 },
    { country: "Japan", cost: 58 }
  ];
  
  const svg = d3.select("#chart");
  const width = +svg.attr("width");
  const height = +svg.attr("height");
  const radius = Math.min(width, height) / 2;
  
  const g = svg.append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);
  
  const color = d3.scaleOrdinal()
    .domain(chartData.map(d => d.country))
    .range(["#00ffff", "#ff00ff", "#ffff00", "#00ff00", "#ff6600"]);
  
  const pie = d3.pie().value(d => d.cost);
  const path = d3.arc().outerRadius(radius - 10).innerRadius(50); // donut style
  
  const arc = g.selectAll(".arc")
    .data(pie(chartData))
    .enter().append("g")
    .attr("class", "arc");
  
  arc.append("path")
    .attr("d", path)
    .attr("fill", d => color(d.data.country))
    .style("filter", "drop-shadow(0 0 6px #00ffff)");
  
  arc.append("text")
    .attr("transform", d => `translate(${path.centroid(d)})`)
    .attr("dy", "0.35em")
    .style("fill", "#fff")
    .style("font-size", "6px")
    .style("text-anchor", "middle")
    .text(d => d.data.country);
  