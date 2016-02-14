var cluster = require('cluster');
var os      = require('os');

// 1. Define cluster to run app
cluster.setupMaster({
    exec: 'app.js'
});

cluster.on('exit', function (worker) {
    console.info('Worker ' + worker.id + ' died');
    // Replace the dead worker
    cluster.fork();
});

// Fork a worker for each available CPU
for (var i = 0; i < 1; i++) {
    cluster.fork();
}
console.info("%d cpus", os.cpus().length);
