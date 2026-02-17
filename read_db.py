from pymongo import MongoClient
import pandas as pd

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client["test"]
collection = db["employees"]

# Fetch data
data = list(collection.find())

# Convert to tableno
df = pd.DataFrame(data)
import pandas as pd

pd.set_option('display.max_columns', None)
pd.set_option('display.width', None)
pd.set_option('display.max_colwidth', None)

print(df)

print(df)
