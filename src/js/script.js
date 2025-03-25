function startSimulation() {
  const country = document.getElementById("country-name").textContent;
  if (!country) return;
  window.location.href = `/journee.html?country=${encodeURIComponent(country)}`;
}
