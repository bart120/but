import redis
import mysql.connector
import json
from config import config

#connexion à redis
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)

#connexion mysql
db = mysql.connector.connect(**config)
cursor = db.cursor(dictionary=True)