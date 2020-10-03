var metropolitan_zone;
var id_city;
var min_presupuesto; 
var max_presupuesto; 

// on Maps page load
$(document).ready(function () {
    
    //Get the values selected by the user in index from the URL 
    min_presupuesto = getQueryParams("min");
    max_presupuesto = getQueryParams("max");
    metropolitan_zone = getQueryParams("z");

    // populate range slider info
    document.getElementById("min_amount").value = min_presupuesto;
    document.getElementById("max_amount").value = max_presupuesto;
    $( "#amount" ).val(min_presupuesto + " - " + max_presupuesto );
    $("#slider-range").slider('values',0,min_presupuesto.replace('$','').replace(/,/g,''));
    $("#slider-range").slider('values',1, max_presupuesto.replace('$','').replace(/,/g,''));

    //Populate metropolitam zone and city combos 
    var objId = "metZone_combo";
    populateMetropolitanZone (objId, null);
    onChangeCityCombo(metropolitan_zone, true);  
});


function onClickFiltrar () {
    selectedMetZone = d3.select("#metZone_combo").property("value");
    selectedCity = d3.select("#city_combo").property("value");
    selectedMin = d3.select("#min_amount").property("value");
    selectedMax = d3.select("#max_amount").property("value");
    
    url = "http://127.0.0.1:5000/housesCrimePlaces_filter/" + selectedMetZone + "/" + selectedCity + "/" + selectedMin + "/" + selectedMax
    d3.request(url)
    .header("X-Requested-With", "XMLHttpRequest")
    .get(function(data){
        
      metro_zone_obj = JSON.parse(data.response);
      
    });
    
}