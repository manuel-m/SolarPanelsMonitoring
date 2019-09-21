// [!!!] poll client side
poll();

function refresh() {
  if (!$) return; // jquery loaded

  // [!!!] jquery async
  $.get('api/data', function(data_json) {
    // get data
    var data = JSON.parse(data_json);
    var text_values = 'val1: ' + data.val1 + ' / val2: ' + data.val2;

    // [!!!] jquery dom update
    $('#updated-values').text(text_values);
  });
}

function poll() {
  refresh();
  setTimeout(poll, 500);
}
