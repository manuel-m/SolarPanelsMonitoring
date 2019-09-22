// [!!!] poll client side
poll();

function refresh() {
  if (!$) return; // jquery loaded

  // [!!!] jquery async
  $.get('api/data', function(data_json) {
    // get data
    var data = JSON.parse(data_json);
    var text_values = 'Production: ' + data.enphaseProduction + ' / Consumption: ' + data.enphaseConsumption + ' / Net power:' + data.enphaseNetPower;

    // [!!!] jquery dom update
    $('#updated-values').text(text_values);

    $('#updatedProduction').text(data.enphaseProduction);
    $('#updatedConsumption').text(data.enphaseConsumption);
    $('#updatedNetPower').text(data.enphaseNetPower);
  });
}

function poll() {
  refresh();
  setTimeout(poll, 2500);
}
