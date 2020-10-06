populateMetropolitanZone("metZone_combo", null);

function onClickComenzar () {
  
  // Get the combo selected values
  selectedIdMetZone = d3.select("#metZone_combo").property("value");
  selectedIdCity = d3.select("#city_combo").property("value");
  selectedPresupuestoMin = d3.select("#min_amount").property("value");
  selectedPresupuestoMax = d3.select("#max_amount").property("value");
  
 // URL Dev environment
  // url = "../templates/mapa.html?z=" + selectedIdMetZone + "&c=" + selectedIdCity + "&min="  + selectedPresupuestoMin + "&max=" + selectedPresupuestoMax;
  
  // URL production environment 
  url = "mapa.html?z=" + selectedIdMetZone + "&c=" + selectedIdCity + "&min="  + selectedPresupuestoMin + "&max=" + selectedPresupuestoMax;
  
  // aqui mandar llamar endpoint comenzar y comentar la linea de abajo
  window.location= url;

  // url = "http://127.0.0.1:5000/comenzar/" + selectedMetZone + "/" + selectedCity + "/" + selectedMin + "/" + selectedMax
  // d3.request(url)
  // .header("X-Requested-With", "XMLHttpRequest")
  // .post();  

}