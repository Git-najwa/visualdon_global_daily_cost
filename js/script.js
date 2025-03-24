document.addEventListener("DOMContentLoaded", function () {
    fetch("data.json")
        .then(response => response.json())
        .then(data => populateCountries(data));
});

function populateCountries(data) {
    const select = document.getElementById("countrySelect");
    Object.keys(data).forEach(country => {
        const option = document.createElement("option");
        option.value = country;
        option.textContent = country;
        select.appendChild(option);
    });
}

function loadCountryData() {
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById("countrySelect");
            const country = select.value;
            if (country && data[country]) {
                document.getElementById("country-info").classList.remove("hidden");
                document.getElementById("country-name").textContent = country;
                document.getElementById("daily-cost").textContent = `Coût moyen par jour : ${data[country].cost}`;
            } else {
                document.getElementById("country-info").classList.add("hidden");
            }
        });
}

function startSimulation() {
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            const country = document.getElementById("countrySelect").value;
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

