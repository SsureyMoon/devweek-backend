var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var http = require('http');

var config  = require('./config');


var routes = require('./routes');

var app = express();
var server = http.createServer(app);

app.set('port', config.port);


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

// boot server for mocha test
var boot = function () {
    server.listen(app.get('port'), function(){
        console.info('Express server listening on port ' + app.get('port'));
    });
}

var shutdown = function() {
    server.close();
}

if (require.main === module) {
    boot();
} else {
    // for api test
    exports.boot = boot;
    exports.server = server;
    exports.shutdown = shutdown;
    exports.port = app.get('port');
}

exports.app = app;
