// objId: id del drop down, param: query string con el id seleccionado (optional)
function populateMetropolitanZone (objId, param) {
    // Initialize metropolitan zone dropdown
    d3.request("http://127.0.0.1:5000/metropoli_zone")
    .header("X-Requested-With", "XMLHttpRequest")
    .get(function(data){
      var metro_zone_obj = JSON.parse(data.response)
      
    metropolitan_zone = getQueryParams("z");  
      
    d3.select("#"+ objId).selectAll(null)
      .data(metro_zone_obj)
      .enter() // creates placeholder for new data
      .append("option") // appends an "option" placeholder
      .text(function(d) { 
          return d.description;
      }) // insert the description for each metropolitan zone 
      .attr('value',function(d) { 
        return d.id_mzone;
      }) // insert the value for each description 
      .property("selected", function(value){
        return value.id_mzone==metropolitan_zone;
        }); 
    }); 
    
  };


  // OnChange metropolitan zone
  function onChangeCityCombo (selected_value, isFirstTimeLoadFromMaps) {
    
        url = "http://127.0.0.1:5000/cities/" + selected_value
        
        d3.request(url)
        .header("X-Requested-With", "XMLHttpRequest")
        .get(function(data){
            var cities_desc_obj = JSON.parse(data.response)

            id_city = getQueryParams("c");
            
            d3.selectAll(".city_desc_opt").remove()
            
            d3.select("#city_combo").selectAll(null)
            .data(cities_desc_obj)
            .enter() // creates placeholder for new data
            .append("option") // appends an "option" placeholder
            .attr("class","city_desc_opt")
            .text(function(d) { 
                return d.description_city;
            }) // insert the description for each category 
            .attr('value',function(d) { 
                return d.id_city;
            }) // insert the value for each category 
            .property("selected", function(value){
                return value.id_city==id_city;
            }); 

            // this will only be executed on map page onload
            if(isFirstTimeLoadFromMaps)
                onClickFiltrar();
        });
        
  }

  const getQueryParams = (param) => {
    let href = window.location.href;
    //this expression is to get the query strings
    let reg = new RegExp( '[?&]' + param + '=([^&#]*)', 'i' );
    let queryString = reg.exec(href);
    return queryString ? queryString[1] : null;
};

