config = {
    port: 8000,
    database : {
        databaseName: 'database_emo',
        username:'',
        password: '',
        hostAndPort: 'mongodb://@localhost:27017'
    },
    redis: {
        resource: 'emo-redis',
        host: 'pub-redis-10733.us-east-1-3.7.ec2.redislabs.com',
        port: '10733',
        password: process.env.REDIS_PW
    },
    jwt: {
        secret: "nc9uQRp3osdafasqcr30pw9uj0fd8mXi0pmo"
    },
    socket: {
        namespace: "emo-socket"
    },
    conf_name: "test-conference"
}

config.uri = config.database.hostAndPort + '/' + config.database.databaseName;
module.exports = config;