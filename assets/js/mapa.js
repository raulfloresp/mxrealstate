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
      var metro_zone_obj = JSON.parse(data.response);
    //-----------------------------------       Bar Chart -------------------------------------------------------------------
    var placesArray= metro_zone_obj.places;
    var description_places=[];
    var description_count=[];

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
    //-------------------------------------Places Map------------------------------------------
    
    leaflet(metro_zone_obj);
    //-----------------------------------        Pie Chart -------------------------------------------------------------------

    var crimeArray= metro_zone_obj.crimes;

    var crime_count=[];
    var crimes=[];

    for (var i=0 ;i < crimeArray.length; i++){
        crimes.push(crimeArray[i].description_type);
        crime_count.push(crimeArray[i].amount);
    }

      var data = [{
        labels: crimes,
        values: crime_count,
        type: "pie"
      }];

      var layout = {
        height: 600,
        width: 600
      };

      Plotly.newPlot("pie", data, layout);


    //-----------------------------------        box plot  -------------------------------------------------------------------
    var housesArray= metro_zone_obj.houses;
    console.log(housesArray);

    var id_city= 25;
    var priceUpper= 2000000;
    var pricelower= 0;

    var metersArray= [];
    var buildedmetersArray= [];

    //filtrar info por price y id_city
    var filteredHousesArray= housesArray.filter(element =>
        element.id_city=== id_city && pricelower < parseInt(housesArray[i].price.replace("$","").replace(",","")) < priceUpper )

    for (var i=0; i < filteredHousesArray.length; i++){
        metersArray.push(filteredHousesArray[i].squared_meters);
        buildedmetersArray.push(filteredHousesArray[i].builded_squared_meters);
    }


    var trace1 = {
        y:metersArray,
        type: 'box',
        name: 'Set 1'
      };
      
      var trace2 = {
        y: buildedmetersArray,
        type: 'box'
      };

      var data = [trace1, trace2];
      
      var layout = {
        height: 600,
        width: 600
      };
      
      // Plot the chart to a div tag with id "plot"
      Plotly.newPlot("plot", data, layout);
      //-------------------------------------------------------------------TABLE---------------------------------------------
         
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
   console.log(filteredHousesArray);
    var columns = ['address','rooms','bathrooms','squared_meters','builded_squared_meters','price']
    tabulate(filteredHousesArray,columns)     

      $('.table').DataTable({
          "columns":[
              {"data": "address"},
              {"data": "rooms"},
              {"data": "bathrooms"},
              {"data": "squared_meters"},
              {"data": "builded_squared_meters"},
              {"data": "price"},
          ]            
      });
    });
     
};
d3.selectAll("body").on("click", function() {
  var selectedAddress = d3.select(this);
   console.log(selectedAddress);
 });