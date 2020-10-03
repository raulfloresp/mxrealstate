   
var tabulate = function (data,columns) {
    var table = d3.select('table').attr('class','table table-striped table-sm table-hover')
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
  
  d3.csv('./data/houses_mty.csv',function (data) {
      console.log(data);
      var columns = ['address','rooms','bathrooms','squared_meters','builded_squared_meters','price']
      tabulate(data,columns)
    $(document).ready( function () {
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
        } );
    
  })

 