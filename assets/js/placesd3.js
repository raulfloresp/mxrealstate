function leaflet(importedData){
  
  d3.select("#map-id").remove();
  d3.select("#map-container").append('div').attr('id','map-id');
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
      Convenience_Store: new L.LayerGroup(),
      Houses: new L.LayerGroup()
      
    };
  // Create the map with our layers
  var map = L.map("map-id", {
      center: [importedData.city_coordinates[0].city_lat, importedData.city_coordinates[0].city_long],
      zoom: 12,
      layers: [
        // layers.University,
        // layers.School,
        layers.Restaurant,
        // layers.Shopping_Mall,
        // layers.Convenience_Store,
        layers.Houses
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
      "Convenience Store": layers.Convenience_Store,
      "Houses": layers.Houses
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
      }),
      Houses: L.ExtraMarkers.icon({
        icon: "ion-ios-home",
        iconColor: "white",
        markerColor: "purple",
        shape: "circle"
      })
    };

         
      var places = importedData.places;
     
      var houses = importedData.houses;
      

      var placeCount = {
          University: 0,
          School: 0,
          Restaurant: 0,
          Shopping_Mall: 0,
          Convenience_Store: 0,
          Houses: houses.length
      };
      
      for (var i = 0; i < houses.length; i++) {
        var house = houses[i]
        // Create a new marker with the appropriate icon and coordinates
        var houseMarker = L.marker([house.house_lat, house.house_long], {
          icon: icons["Houses"]
        });
        // Add the new marker to the appropriate layer
        houseMarker.addTo(layers["Houses"]);
        // Bind a popup to the marker that will  display on click. This will be rendered as HTML
        houseMarker.bindPopup(house.id_publicacion + "<br> Cuartos:"+ house.rooms + "<br> Bathrooms:" + house.bathrooms+ "<br> Square Meters: " + house.squared_meters + "<br> Price" + house.price);
      }

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
       
        // Call the updateLegend function, which will... update the legend!
        updateLegend(placeCount);

      
    // Update the legend's innerHTML with the last updated time and station count
    function updateLegend(placeCount) {
      document.querySelector(".legend").innerHTML = [
        "<p class='houses'>Number of Houses: " + placeCount.Houses + "</p>",
        "<p class='university'>Number of Universities: " + placeCount.University + "</p>",
        "<p class='school'>Number of Schools: " + placeCount.School + "</p>",
        "<p class='restaurant'>Number of Restaurants: " + placeCount.Restaurant + "</p>",
        "<p class='shopping_mall'>Number of Shopping Malls: " + placeCount.Shopping_Mall + "</p>",
        "<p class='convenience_store'>Number of Convenience: " + placeCount.Convenience_Store + "</p>"

      ].join("");
    }
  };

  function leaflet2(importedData){
    
    d3.select("#map-id-2").remove();
    d3.select("#map-container-2").append('div').attr('id','map-id-2');
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
        Convenience_Store: new L.LayerGroup(),
        House: new L.LayerGroup()
        
      };
    // Create the map with our layers
    var map = L.map("map-id-2", {
        center: [importedData.house[0].house_lat, importedData.house[0].house_long],
        zoom: 14,
        layers: [
          layers.University,
          layers.School,
          layers.Restaurant,
          layers.Shopping_Mall,
          layers.Convenience_Store,
          layers.House
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
        "Convenience Store": layers.Convenience_Store,
        "House": layers.House
      };
    // Create a control for our layers, add our overlay layers to it
    L.control.layers(null, overlays).addTo(map);
  
  d3.select("#map-id-2").remove();
  d3.select("#map-container-2").append('div').attr('id','map-id-2');
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
      Convenience_Store: new L.LayerGroup(),
      House: new L.LayerGroup()
      
    };
  // Create the map with our layers
  var map = L.map("map-id-2", {
      center: [importedData.house[0].house_lat, importedData.house[0].house_long],
      zoom: 14,
      layers: [
        layers.University,
        layers.School,
        layers.Restaurant,
        layers.Shopping_Mall,
        layers.Convenience_Store,
        layers.House
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
      "Convenience Store": layers.Convenience_Store,
      "House": layers.House
    };
  // Create a control for our layers, add our overlay layers to it
  L.control.layers(null, overlays).addTo(map);

  // Create a legend to display information about our map
  var info = L.control({
      position: "bottomright"
    });

  // When the layer control is added, insert a div with the class of "legend"
  info.onAdd = function() {
      var div = L.DomUtil.create("div", "legend-2");
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
      }),
      House: L.ExtraMarkers.icon({
        icon: "ion-ios-home",
        iconColor: "white",
        markerColor: "purple",
        shape: "circle"
      })
    };

      // console.log(icons);
      
      var places = importedData.places;
      
      var house = importedData.house[0];
      

      var placeCount = {
          University: 0,
          School: 0,
          Restaurant: 0,
          Shopping_Mall: 0,
          Convenience_Store: 0,
      };
 
       
        var places = importedData.places;
       
        var house = importedData.house[0];
        
        // Create a new marker with the appropriate icon and coordinates
        var houseMarker = L.marker([house.house_lat, house.house_long], {
          icon: icons["House"]
        });
        // Add the new marker to the appropriate layer
        houseMarker.addTo(layers["House"]);
        // Bind a popup to the marker that will  display on click. This will be rendered as HTML
        houseMarker.bindPopup(house.id_publicacion + "<br> Cuartos:"+ house.rooms + "<br> Bathrooms:" + house.bathrooms+ "<br> Square Meters: " + house.squared_meters + "<br> Price" + house.price);
      

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

      
    // Update the legend's innerHTML with the last updated time and station count
    function updateLegend(placeCount) {
      document.querySelector(".legend-2").innerHTML = [
        "<p class='university'>Number of Universities: " + placeCount.University + "</p>",
        "<p class='school'>Number of Schools: " + placeCount.School + "</p>",
        "<p class='restaurant'>Number of Restaurants: " + placeCount.Restaurant + "</p>",
        "<p class='shopping_mall'>Number of Shopping Malls: " + placeCount.Shopping_Mall + "</p>",
        "<p class='convenience_store'>Number of Convenience: " + placeCount.Convenience_Store + "</p>"

      ].join("");
    }
  }


