const redis = require('redis')

const redisClient = redis.createClient({
    host: '127.0.0.1',
    port: '6379'
});
redisClient.connect();

redisClient.on('error', (err) => {
    console.log('Redis erreur: ', err);
});

function consume() {
    redisClient.xRead(redis.commandOptions({ isolated: true }),
        [{ key: 'produit_stream', id: '0-0' }], { COUNT: 2, BLOCK: 5000 }).then((stream) => {
            if (stream) {
                console.log(stream);
                const messages = stream[0].messages;
                messages.forEach((message) => {
                    console.log('Message reçu :', message.message);
                });
            }
            consume();
        });
}

consume();