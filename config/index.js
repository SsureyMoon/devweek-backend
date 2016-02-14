config = {
    database : {
        databaseName: 'database_emo',
        username:'',
        password: '',
        hostAndPort: 'mongodb://@localhost:27017'
    },
    jwt: {
        secret: "nc9uQRp3osdafasqcr30pw9uj0fd8mXi0pmo"
    },
    socket: {
        namespace: "emo-socket"
    }
}

config.uri = config.database.hostAndPort + '/' + config.database.databaseName;
module.exports = config;
