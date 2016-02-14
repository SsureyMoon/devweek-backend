var socketio = require('socket.io'),
    async = require('async'),
    querystring = require('querystring'),
    http = require('http');
var config  = require('../config');

exports.init = function init(server, redisClient, adapter, namespace){
    var io = socketio(server);

    io.adapter(adapter);

    redisClient.get("key", function(error, info){
        if(error) console.error(error);
        console.log(info);
        console.log("obj2");
    })

    var conn = io.of(namespace).on('connect', onConnect({
        redisClient: redisClient,
        success: socketHandler,
        errors: connectionErrorHandler
    }));

    return {io:io, conn:conn}
}


// of(name space), client
function onConnect(options){


    options.redisClient.get("key", function(error, info){
        if(error) console.error(error);
        console.log(info);
        console.log("obj");
    })

    return function(socket){
        // var token = socket._query.one_time_token
        console.log("socket info")
        console.log(socket.id)
        options.success(socket);
    }
}

function connectionErrorHandler(socket){
    console.log('connection error!')
    socket.disconnect('unauthorized connection');
}

function socketHandler(socket){

    var _socket = socket;


    socket.customErrorHandler = function errorHandler(err){
        console.error(err);
        return this.emit("error", {message: err.message})
    }


    socket.join(config.conf_name, function(error){
        if(error){
            return socket.customErrorHandler(error).bind(socket);
        }
        socket.emit('connect', { socket_id: socket.id });
    });
    console.log('a new client connected: '+ socket.id);
}

Array.prototype.customRemove = function(item){
    var index = this.indexOf(item);
    if (index > -1)
        this.splice(index, 1)
    return this;
}

Array.prototype.customCopy = function(){
    return this.slice();
}
