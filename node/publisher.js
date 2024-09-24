const redis = require('redis')

const redisClient = redis.createClient({
    host: '127.0.0.1',
    port: '6379'
});

redisClient.on('error', (err) => {
    console.log('Redis erreur: ', err);
});

async function publish() {
    // Connexion au souscripteur

    // S'abonner à un canal
    await redisClient.publish('notification', 'coucou les sapajous !!!').then(x => {
        console.log('message envoyé');
    });
}

(async () => {
    await redisClient.connect();
    try {
        setInterval(() => { publish(); }, 5000);
    } catch (err) {
        console.error(err);
    }
})();