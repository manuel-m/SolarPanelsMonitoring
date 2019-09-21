
'use strict';
var https = require('http');
var readEnphaseInterval = setInterval(readEnphaseValues, 1000); //run the readEnphaseValues function every 1000ms
var puissanceNette = 0;

var options = {
    host: '192.168.0.106',
    path: '/production.json',
    headers: {'User-Agent': 'request'}
};

function readEnphaseValues() {
	https.get(options, function (res) {
		var json = '';
		res.on('data', function (chunk) {
			json += chunk;
		});
		res.on('end', function () {
			if (res.statusCode === 200) {
				try {
					var data = JSON.parse(json);
					
					// Productions Data
					console.log("Production : " + data.production[1].wNow);
					
					console.log("Consommation : " + data.consumption[0].wNow);
					
					puissanceNette = data.consumption[1].wNow;
					console.log("Puissance nette : " + puissanceNette);
					
					console.log('');
				} catch (e) {
					console.log('Error parsing JSON!');
				}
			} else {
				console.log('Status:', res.statusCode);
			}
		});
	}).on('error', function (err) {
		  console.log('Error:', err);
	});
}

function endReadEnphaseValues() { /
  clearInterval(readEnphaseInterval); // Stop
}

setTimeout(endReadEnphaseValues, 10000); //stop script after 10 seconds 