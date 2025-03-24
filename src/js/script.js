function startSimulation() {
    fetch("data/data.json")
      .then(response => response.json())
      .then(data => {
        const country = document.getElementById("country-name").textContent;
        if (!country || !data[country]) return;
  
        const simulationDiv = document.getElementById("day-simulation");
        const timeline = document.getElementById("timeline");
        simulationDiv.classList.remove("hidden");
        timeline.innerHTML = "";
  
        data[country].activities.forEach((activity, index) => {
          setTimeout(() => {
            const event = document.createElement("p");
            event.classList.add("text-lg", "mt-2");
            event.textContent = activity;
            timeline.appendChild(event);
          }, index * 1000);
        });
      });
  }
  