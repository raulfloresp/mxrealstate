var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});
// Initialize all of the LayerGroups we'll be using
var layers = {
    University: new L.LayerGroup(),
    School: new L.LayerGroup(),
    Restaurant: new L.LayerGroup(),
    Shopping_Mall: new L.LayerGroup(),
    Convenience_Store: new L.LayerGroup()
  };
// Create the map with our layers
var map = L.map("map-id", {
    center: [25.6866, -100.3161],
    zoom: 12,
    layers: [
      layers.University,
      layers.School,
      layers.Restaurant,
      layers.Shopping_Mall,
      layers.Convenience_Store
    ]
  });
// Add our 'lightmap' tile layer to the map
lightmap.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
    "Universities": layers.University,
    "School": layers.School,
    "Restaurants": layers.Restaurant,
    "Shopping Malls": layers.Shopping_Mall,
    "Convenience Store": layers.Convenience_Store
  };
// Create a control for our layers, add our overlay layers to it
L.control.layers(null, overlays).addTo(map);

// Create a legend to display information about our map
var info = L.control({
    position: "bottomright"
  });

// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    return div;
  };
  // Add the info legend to the map
  info.addTo(map); 

// Initialize an object containing icons for each layer group
var icons = {
    University: L.ExtraMarkers.icon({
      icon: "ion-university",
      iconColor: "white",
      markerColor: "yellow",
      shape: "circle"
    }),
    School: L.ExtraMarkers.icon({
      icon: "ion-university",
      iconColor: "white",
      markerColor: "red",
      shape: "circle"
    }),
    Restaurant: L.ExtraMarkers.icon({
      icon: "ion-android-restaurant",
      iconColor: "white",
      markerColor: "blue-dark",
      shape: "circle"
    }),
    Shopping_Mall: L.ExtraMarkers.icon({
      icon: "ion-ios-cash",
      iconColor: "white",
      markerColor: "orange",
      shape: "circle"
    }),
    Convenience_Store: L.ExtraMarkers.icon({
      icon: "ion-ios-cart",
      iconColor: "white",
      markerColor: "green",
      shape: "circle"
    })
  };

d3.json("ejemplo_json.json",function(importedData){
    console.log(importedData)
    // var place_type = importedData.places.map(place => place.description_place);
    // var place_latitude = importedData.places.map(place => place.place_lat);
    // var place_longitude = importedData.places.map(place => place.place_long);
    // var place_name = importedData.places.map(place => place.place_name);
    // var place_rating = importedData.places.map(place=> place.rating);
    // var place_rating_count = importedData.places.map(place=>place.user_rating_total);

    var places = importedData.places;


    var placeCount = {
        University: 0,
        School: 0,
        Restaurant: 0,
        Shopping_Mall: 0,
        Convenience_Store: 0,
    };    

    // Loop through the stations (they're the same size and have partially matching data)
    for (var i = 0; i < places.length; i++) {
       var place_type;
       var place = places[i]
        if (place.description_place == "University") {
          place_type = "University";
        }
        
        else if (place.description_place == "School") {
          place_type = "School";
        }
       
        else if (place.description_place == "Restaurant") {
            place_type = "Restaurant";
        }
       
        else if (place.description_place == "Shopping Mall") {
        place_type = "Shopping_Mall";
        }
        
        else {
          place_type = "Convenience_Store";
        }
  
        // Update the station count
        placeCount[place_type]++;
        // Create a new marker with the appropriate icon and coordinates
        var newMarker = L.marker([place.place_lat, place.place_long], {
          icon: icons[place_type]
        });
  
        // Add the new marker to the appropriate layer
        newMarker.addTo(layers[place_type]);
  
        // Bind a popup to the marker that will  display on click. This will be rendered as HTML
        newMarker.bindPopup(place.place_name + "<br> Rating: " + place.rating + "<br>" + place.user_rating_total + " Rating count");
      }
      console.log(placeCount);
      // Call the updateLegend function, which will... update the legend!
      updateLegend(placeCount);
    });
    
  // Update the legend's innerHTML with the last updated time and station count
  function updateLegend(placeCount) {
    document.querySelector(".legend").innerHTML = [
      "<p class='university'>Number of Universities: " + placeCount.University + "</p>",
      "<p class='school'>Number of Schools: " + placeCount.School + "</p>",
      "<p class='restaurant'>Number of Restaurants: " + placeCount.Restaurant + "</p>",
      "<p class='shopping_mall'>Number of Shopping Malls: " + placeCount.Shopping_Mall + "</p>",
      "<p class='convenience_store'>Number of Convenience: " + placeCount.Convenience_Store + "</p>"
    ].join("");
  }
  

