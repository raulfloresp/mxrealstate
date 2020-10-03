$( function() {
  let min;
  let max;

  $( "#slider-range" ).slider({
    range: true,
    min: 100000,
    max: 10000000,
    values: [ 800000, 2000000 ],
    slide: function( event, ui ) {
      min = numberWithCommas(ui.values[ 0 ]);
      max = numberWithCommas(ui.values[ 1 ]);
      $( "#amount" ).val( "$" + min + " - $" + max );
      $("#min_amount").val("$" + min);
      $("#max_amount").val("$" + max);
    }
  });

  // initialization
  min = numberWithCommas($( "#slider-range" ).slider( "values", 0 ));
  max = numberWithCommas($( "#slider-range" ).slider( "values", 1 ));
  $( "#amount" ).val( "$" + min + " - $" + max );
  $("#min_amount").val("$" + min);
  $("#max_amount").val("$" + max);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

} );
