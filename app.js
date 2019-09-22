/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');

var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var about = require('./routes/about');
app.get('/about', about.about);

/*[!!!] REST api*/
app.get('/api/data', function(req, res) {
  res.send(
    JSON.stringify({
      val1: 10 + Math.random() * 10,
      val2: 20 + Math.random() * 20,
    })
  );
});

//*****************************

var https = require('http');
var readEnphaseInterval = setInterval(readEnphaseValues, 5000); //run the readEnphaseValues function every 5s
var enphaseProduction = 0;
var enphaseConsumption = 0;
var enphaseNetPower = 0;

var options = {
  host: '192.168.0.106',
  path: '/production.json',
  headers: { 'User-Agent': 'request' },
};

var lastReadTime = Date.now();

function readEnphaseValues() {
  https
    .get(options, function(res) {
      var json = '';
      res.on('data', function(chunk) {
        json += chunk;
      });
      res.on('end', function() {
        if (res.statusCode === 200) {
          try {
            var data = JSON.parse(json);
            enphaseProduction = Math.round(data.production[1].wNow);
            enphaseConsumption = Math.round(data.consumption[0].wNow);
            enphaseNetPower = Math.round(data.consumption[1].wNow);

            // current timestamp in milliseconds
            let ts = Date.now();
            let duration = ts - lastReadTime;
            lastReadTime = ts;

            var d = new Date();
            var msg =
              ('00' + (d.getMonth() + 1)).slice(-2) +
              '/' +
              ('00' + d.getDate()).slice(-2) +
              '/' +
              d.getFullYear() +
              ' ' +
              ('00' + d.getHours()).slice(-2) +
              ':' +
              ('00' + d.getMinutes()).slice(-2) +
              ':' +
              ('00' + d.getSeconds()).slice(-2) +
              '\t' +
              duration +
              '\t' +
              enphaseProduction +
              '\t' +
              enphaseConsumption +
              '\t' +
              enphaseNetPower +
              '\r';
            console.log(msg);
          } catch (e) {
            console.log('Error parsing JSON!');
          }
        } else {
          console.log('Status:', res.statusCode);
        }
      });
    })
    .on('error', function(err) {
      console.log('Error:', err);
    });
}

//*****************************

/*[!!!] REST api*/
app.get('/api/data', function(req, res) {
  res.send(
    JSON.stringify({
      enphaseProduction: enphaseProduction,
      enphaseConsumption: enphaseConsumption,
      enphaseNetPower: enphaseNetPower,
    })
  );
});

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
