d3.json("data/ejemplo_json.json",(jsondata) => {
    console.log(jsondata);

//-----------------------------------       Bar Chart -------------------------------------------------------------------

var placesArray= jsondata.places;
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

//-----------------------------------        Pie Chart -------------------------------------------------------------------

var crimeArray= jsondata.crimes;

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
var housesArray= jsondata.houses;

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
}
);