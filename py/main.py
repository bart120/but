import redis
import mysql.connector
import json
from config import config
from decimal import Decimal


#connexion à redis
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)

#connexion mysql
db = mysql.connector.connect(**config)
cursor = db.cursor(dictionary=True)

def custom_serializer(obj):
    if isinstance(obj, Decimal):
        return float(obj)

def get_produit_from_db(produit_id):
    cursor.execute("SELECT * FROM produits WHERE id=%s", (produit_id,))
    produit = cursor.fetchone()
    return produit

def get_produit(produit_id):
    cache_key = f'produit:{produit_id}'
    produit_cache = redis_client.get(cache_key)

    if produit_cache:
        return json.loads(produit_cache)
    else:
        produit = get_produit_from_db(produit_id)
        if produit:
            redis_client.setex(cache_key, 600, json.dumps(produit, default=custom_serializer))
        return produit

#execution
if __name__ == '__main__':
    produit = get_produit(1)
    print(produit)
    cursor.close()
    db.close()
