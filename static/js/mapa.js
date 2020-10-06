var metropolitan_zone;
var id_city;
var min_presupuesto; 
var max_presupuesto; 

// on Maps page load
$(document).ready(function () {
    
    //Get the values selected by the user in index.html from the URL 
    // getQueryParams is a builded funtion in generalFunctions.js 
    min_presupuesto = getQueryParams("min");
    max_presupuesto = getQueryParams("max");
    metropolitan_zone = getQueryParams("z");

    // populate range slider info
    if(min_presupuesto == null){
      min_presupuesto = "$800,000";
    }

    if(max_presupuesto == null){
      max_presupuesto = "$2,000,000";
    }

    document.getElementById("min_amount").value = min_presupuesto;
    document.getElementById("max_amount").value = max_presupuesto;
    $( "#amount" ).val(min_presupuesto + " - " + max_presupuesto );
    $("#slider-range").slider('values',0,min_presupuesto.replace('$','').replace(/,/g,''));
    $("#slider-range").slider('values',1, max_presupuesto.replace('$','').replace(/,/g,''));

    //Populate metropolitam zone and city combos 
    var objId = "metZone_combo";

    // populateMetropolitanZone() and onChangeCityCombo() are builded funtions in generalFunctions.js
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
    var metro_zone_obj = JSON.parse(data.response); 

    //-------------------------------------Places Map------------------------------------------
    // Builded function in placesd3.js
    d3.select("#titulo_Mapa1").text("Casas dentro de tu presupuesto en " + d3.select("#city_combo option:checked").text());
    leaflet(metro_zone_obj);

    //-----------------------------------       Bar Chart -------------------------------------------------------------------
    var placesArray= metro_zone_obj.places;
    var description_places=[];
    var description_count=[];
    
    d3.select("#titulo_bar").text("Lugares de interes en " + d3.select("#city_combo option:checked").text());

    for (var i=0 ;i < placesArray.length; i++){
        var current= placesArray[i].description_place;
        if (description_places.includes(current)){
            var index= description_places.indexOf(current);
            description_count[index] += 1;
        } else{
            description_places.push(current);
            description_count.push(1);
        }
    }

    // create the trace for the bar chart 
    var trace = {
                x: description_places,
                y: description_count,
                marker: {
                color: '#ffa500'},
                type: "bar",
            };

            // create data variable
            var data = [trace];

            // set the layout for the bar chart 
            var layout = {
                yaxis: {
                    tickmode: "linear",
                },
                height: 600,
                width: 600
            };

            // create the bar chart 
            Plotly.newPlot("bar", data, layout);
    
    //-----------------------------------        Pie Chart -------------------------------------------------------------------

    var crimeArray= metro_zone_obj.crimes;
    
    var crime_count=[];
    var crimes=[];
    
    d3.select("#titulo_pie").text("Distribución de crímenes en  " + d3.select("#city_combo option:checked").text());

    for (var i=0 ;i < crimeArray.length; i++){
        crimes.push(crimeArray[i].description_type);
        crime_count.push(crimeArray[i].amount);
    }

      var data = [{
        labels: crimes,
        values: crime_count,
          hole: .4,
        type: "pie"
      }];

      var layout = {
        height: 600,
        width: 600,
        showlegend: false
      };

      Plotly.newPlot("pie", data, layout);


    //-----------------------------------        box plot  -------------------------------------------------------------------
    var housesArray= metro_zone_obj.houses;
    
    
    var id_city= selectedCity;
    
    
    var metersArray= [];
    var buildedmetersArray= [];

    d3.select("#titulo_box").text("Distribución de metros cuadros para casas dentro de tu presupuesto en  " + d3.select("#city_combo option:checked").text());
    
    //filtrar info por price y id_city
    var filteredHousesArray= housesArray.filter(element => element.id_city== id_city)

    
    for (var i=0; i < filteredHousesArray.length; i++){
        metersArray.push(filteredHousesArray[i].squared_meters);
        buildedmetersArray.push(filteredHousesArray[i].builded_squared_meters);
    }


    var trace1 = {
        y:metersArray,
        type: 'box',
        name: 'square meters'
      };
      
      var trace2 = {
        y: buildedmetersArray,
        type: 'box',
        name: 'build square meters'
      };

      var data = [trace1, trace2];
      
      var layout = {
        height: 600,
        width: 600
      };
      
    // Plot the chart to a div tag with id "plot"
    Plotly.newPlot("plot", data, layout);
    //-------------------------------------------------------------------TABLE---------------------------------------------
    
    d3.select("#titulo_table").text("Lista de casas dentro de tu presupuesto en " + d3.select("#city_combo option:checked").text());
    
    var tabulate = function (data,columns) {
      $('.table').DataTable().destroy();
      d3.select('table').remove();  
      var table = d3.select('.table-responsive').append('table').attr('class','table table-striped table-sm table-hover')
        var thead = table.append('thead')
        var tbody = table.append('tbody')

        thead.append('tr').attr('style','text-align: left;')
          .selectAll('th')
            .data(columns)
            .enter()
          .append('th')
            .text(function (d) { return d })

        var rows = tbody.selectAll('tr')
            .data(data)
            .enter()
          .append('tr')
          .attr('id',d => d.id_publicacion)
          .attr("onclick", function (d) {
            return "onclickHouse("+d.id_publicacion+");"
          })
          
          

        var cells = rows.selectAll('td')
            .data(function(row) {
                return columns.map(function (column) {
                    return { column: column, value: row[column] }
              })
          })
          .enter()
        .append('td')
          .text(function (d) { return d.value })
        
      return table;
      
    }
    var columns = ['address','rooms','bathrooms','squared_meters','builded_squared_meters','price']
    tabulate(filteredHousesArray,columns)     

      $('.table').DataTable({
           select: true            
      });
  });
};
function highlightRow (id_publicacion) {    
  $('tr').removeClass('selected');
  $("#"+id_publicacion).addClass('selected'); 
}

function onclickHouse (id_publicacion) {
  highlightRow(id_publicacion);
  selectedMetZone = d3.select("#metZone_combo").property("value");  
  selectedCity = d3.select("#city_combo").property("value");
  selectedMin = d3.select("#min_amount").property("value");
  selectedMax = d3.select("#max_amount").property("value");    
  url = "http://127.0.0.1:5000/housesPrices_filter/" + selectedMetZone + "/" + selectedCity + "/" + selectedMin + "/" + selectedMax +"/" + id_publicacion
  d3.request(url)
  .header("X-Requested-With", "XMLHttpRequest")
  .get(function(data){
    var houses_obj = JSON.parse(data.response);
    
    console.log(houses_obj)
    // Builded function in placesd3.js
    d3.select("#titulo_Mapa2").text("Casa seleccionada en " + d3.select("#city_combo option:checked").text());
    leaflet2(houses_obj)
    
    // Show the price for the selected house 
    d3.select("#precio_publicado").text(houses_obj.house[0].price).text();
    
    // Show the calculated suggested price. 
    d3.select("#precio_sugerido").text(houses_obj.suggested_price).text();

  });
}
