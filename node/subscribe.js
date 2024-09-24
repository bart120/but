const redis = require('redis')

const redisClient = redis.createClient({
    host: '127.0.0.1',
    port: '6379'
});

redisClient.on('error', (err) => {
    console.log('Redis erreur: ', err);
});

async function subscribe() {
    // Connexion au souscripteur
    await redisClient.connect();
    // S'abonner à un canal
    await redisClient.subscribe(['notification', 'produit'], (message, channel) => {
        console.log(`Message reçu ${channel} :${message}`);
    });
}

(async () => {
    try {
        await subscribe();
    } catch (err) {
        console.error(err);
    }
})();