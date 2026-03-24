import os
import uuid
from datetime import datetime, timedelta
from azure.storage.blob import (
    BlobServiceClient,
    generate_blob_sas,
    BlobSasPermissions
)
from dotenv import load_dotenv

load_dotenv()

connection_string = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
container_name = os.getenv("AZURE_STORAGE_CONTAINER")

blob_service_client = BlobServiceClient.from_connection_string(connection_string)

def get_account_name_and_key():
    parts = dict(p.split("=", 1) for p in connection_string.split(";") if "=" in p)
    return parts.get("AccountName"), parts.get("AccountKey")

def create_container_if_not_exists():
    try:
        blob_service_client.create_container(container_name)
    except Exception:
        pass

def upload_photo(file_bytes: bytes, file_extension: str = "jpg") -> str:
    create_container_if_not_exists()
    
    blob_name = f"{uuid.uuid4()}.{file_extension}"
    
    blob_client = blob_service_client.get_blob_client(
        container=container_name,
        blob=blob_name
    )
    
    blob_client.upload_blob(file_bytes)
    
    account_name, account_key = get_account_name_and_key()
    
    sas_token = generate_blob_sas(
        account_name=account_name,
        container_name=container_name,
        blob_name=blob_name,
        account_key=account_key,
        permission=BlobSasPermissions(read=True),
        expiry=datetime.utcnow() + timedelta(hours=24)
    )
    
    return f"https://{account_name}.blob.core.windows.net/{container_name}/{blob_name}?{sas_token}"

def delete_photo(blob_url: str):
    try:
        blob_name = blob_url.split("/")[-1].split("?")[0]
        blob_client = blob_service_client.get_blob_client(
            container=container_name,
            blob=blob_name
        )
        blob_client.delete_blob()
    except Exception:
        pass