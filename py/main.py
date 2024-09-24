import redis
import mysql.connector
import json
from config import config

#connexion à redis
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)

#connexion mysql
db = mysql.connector.connect(**config)
cursor = db.cursor(dictionary=True)

def get_produit_from_db(produit_id):
    cursor.execute("SELECT * FROM produits WHERE id=%s", (produit_id,))
    produit = cursor.fetchone()
    return produit

#execution
if __name__ == '__main__':
    produit = get_produit_from_db(1)
    print(produit)
    cursor.close()
    db.close()
