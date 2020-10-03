populateMetropolitanZone("metZone_combo", null);

function onClickComenzar () {
  
  // Get the combo selected values
  selectedIdMetZone = d3.select("#metZone_combo").property("value");
  selectedIdCity = d3.select("#city_combo").property("value");
  selectedPresupuestoMin = d3.select("#min_amount").property("value");
  selectedPresupuestoMax = d3.select("#max_amount").property("value");
  
  url = "../mapa.html?z=" + selectedIdMetZone + "&c=" + selectedIdCity + "&min="  + selectedPresupuestoMin + "&max=" + selectedPresupuestoMax;
  

  window.location= url;
  
}