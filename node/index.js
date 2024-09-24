const redis = require('redis');
const mysql = require('mysql2/promise');
const config = require('./config');

//connexion à redis
const redisClient = redis.createClient({
    host: '127.0.0.1',
    port: 6379
});

//connexion à mysql
const db = mysql.createPool(config.mysql);

async function getProduitFromDB(produit_id) {
    const [rows] = await db.execute('SELECT * FROM produits WHERE id=?', [produit_id]);
    return rows[0];
}

async function getProduit(produit_id) {
    await redisClient.connect();
    const cacheKey = `produit:${produit_id}`;
    //chercher dans le redis
    return new Promise((resolve, reject) => {

        redisClient.get(cacheKey).then(async (produitCache) => {
            if (produitCache) {
                return resolve(JSON.parse(produitCache));
            } else {
                const produit = await getProduitFromDB(produit_id);
                if (produit) {
                    redisClient.setEx(cacheKey, 600, JSON.stringify(produit));
                }
                return resolve(produit);
            }
        });
    });
}

//utilisation
(async () => {
    try {
        const produit = await getProduit(1);
        console.log(produit);
    } catch (err) {
        console.error(err);
    } finally {
        redisClient.quit();
        db.end();
    }
})();