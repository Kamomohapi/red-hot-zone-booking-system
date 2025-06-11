from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from urllib.parse import quote_plus  # <-- import this
from dotenv import load_dotenv

import os 

load_dotenv()  # Load environment variables from .env file

mongo_user = os.getenv("MONGO_USER")
raw_password = os.getenv("MONGO_PASSWORD")
escaped_password = quote_plus(raw_password)
mongo_cluster = os.getenv("MONGO_CLUSTER")

uri = f"mongodb+srv://{mongo_user}:{escaped_password}@{mongo_cluster}/?retryWrites=true&w=majority&appName=Cluster0"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

db = client.salonBookingSystem
userCollection = db['Users']
salonCollection = db['Salons']
bookingCollection = db['Bookings']
serviceCollection = db['Services']

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

class Settings:
    SMTP_HOST = os.getenv("SMTP_HOST")
    SMTP_PORT = int(os.getenv("SMTP_PORT"))
    SMTP_USER = os.getenv("SMTP_USER")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")