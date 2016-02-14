var socketio = require('socket.io'),
    async = require('async'),
    querystring = require('querystring'),
    http = require('http');

exports.init = function init(server, namespace){
    var io = socketio(server);

    var conn = io.of(namespace).on('connect', onConnect({
        success: socketHandler,
        errors: connectionErrorHandler
    }));

    return {io:io, conn:conn}
}


// of(name space), client
function onConnect(options){

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

    socket.emit('connect', { socket_id: socket.id });
    console.log('a new client connected: '+ socket.id);

    socket.customErrorHandler = function errorHandler(err){
        console.error(err);
        return this.emit("error", {message: err.message})
    }

    socket.on('streaming', function(data){
        socket.emit('streaming', data)
    })
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
