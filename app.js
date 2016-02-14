var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var http = require('http');
var redis = require('redis').createClient;

var config  = require('./config');

var redis = require('redis').createClient({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password
 });

var adapter = require('socket.io-redis');

var pub = redis({
    key: config.socket.namespace,
    host: config.redis.host,
    port: config.redis.port,
    auth_pass: config.redis.password
 });

 var sub = redis({
     key: config.socket.namespace,
     host: config.redis.host,
     port: config.redis.port,
     auth_pass: config.redis.password
 });

var adapter = adapter({pubClient: pub, subClient:sub});
var redisClient = redis(config.redis.port, config.redis.host);
redisClient.auth(config.redis.password);

var routes = require('./routes');

var app = express();
var server = http.createServer(app);
var port = config.port;

app.use(logger('developement'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

var socketHandler = require('./lib/socket')
    .init(server, redisClient, adapter, config.socket.namespace);

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

// boot server for mocha test
var boot = function () {
    server.listen(port, function(){
        console.info('Express server listening on port ' + port);
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
    exports.port = port;
}

exports.redisClient = redisClient
exports.app = app;
