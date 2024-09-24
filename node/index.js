const redis = require('redis');
const mysql = require('mysql2/promise');
const config = require('./config');

//connexion à redis
const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
});

//connexion à mysql
const db = mysql.createPool(config.mysql);