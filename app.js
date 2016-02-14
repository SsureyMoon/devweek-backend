var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var http = require('http');

var config  = require('./config');


var routes = require('./routes');

var app = express();
var server = http.createServer(app);

app.use(logger('developement'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var socketHandler = require('./lib/socket')
    .init(server, config.socket.namespace);

app.use('/', routes);


app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
}

// for local testing
var port = 8000;

if (require.main === module) {
    server.listen(port, function(){
        console.log('Express server listening on port ' + port);
    })
}

module.exports = app;
