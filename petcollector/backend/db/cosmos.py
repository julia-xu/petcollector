import os
from azure.cosmos import CosmosClient, PartitionKey
from dotenv import load_dotenv

load_dotenv()

connection_string = os.getenv("COSMOS_CONNECTION_STRING")
database_name = os.getenv("COSMOS_DATABASE")
container_name = os.getenv("COSMOS_CONTAINER")

client = CosmosClient.from_connection_string(connection_string)

def get_container():
    database = client.create_database_if_not_exists(database_name)
    container = database.create_container_if_not_exists(
        id=container_name,
        partition_key=PartitionKey(path="/species")
    )
    return container