from fastapi import APIRouter, HTTPException, UploadFile, File
from services.vision import analyze_pet_photo
from services.ai_profile import generate_pet_profile
from services.storage import upload_photo, delete_photo
from db.cosmos import get_container
from models.pet import Pet

router = APIRouter(
    prefix="/pets",
    tags=["pets"]
)

@router.post("/analyze")
async def analyze_pet(image_url: str):
    vision_result = analyze_pet_photo(image_url)
    
    if not vision_result["is_animal"]:
        raise HTTPException(
            status_code=400,
            detail="No animal detected in this photo"
        )
    
    profile = generate_pet_profile(
        vision_result["tags"],
        vision_result["description"]
    )
    
    pet = Pet(
        name=profile["name"],
        species=vision_result["objects"][0] if vision_result["objects"] else "unknown",
        description=vision_result["description"],
        personality=profile["personality"],
        fun_fact=profile["fun_fact"],
        rarity=profile["rarity"],
        tags=vision_result["tags"]
    )
    
    container = get_container()
    container.create_item(body=pet.dict())
    
    return pet

@router.post("/upload")
async def upload_pet(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="File must be an image"
        )
    
    file_bytes = await file.read()
    file_extension = file.filename.split(".")[-1]
    
    photo_url = upload_photo(file_bytes, file_extension)
    
    try:
        vision_result = analyze_pet_photo(photo_url)
        
        if not vision_result["is_animal"]:
            delete_photo(photo_url)
            raise HTTPException(
                status_code=400,
                detail="No animal detected in this photo"
            )
        
        profile = generate_pet_profile(
            vision_result["tags"],
            vision_result["description"]
        )
        
        pet = Pet(
            name=profile["name"],
            species=vision_result["objects"][0] if vision_result["objects"] else "unknown",
            description=vision_result["description"],
            personality=profile["personality"],
            fun_fact=profile["fun_fact"],
            rarity=profile["rarity"],
            tags=vision_result["tags"],
            photo_url=photo_url
        )
        
        container = get_container()
        container.create_item(body=pet.dict())
        
        return pet
    
    except HTTPException:
        raise
    except Exception as e:
        delete_photo(photo_url)
        raise HTTPException(
            status_code=500,
            detail=f"Something went wrong: {str(e)}"
        )
    
@router.get("/")
async def get_all_pets():
    container = get_container()
    pets = list(container.read_all_items())
    return pets

@router.get("/{pet_id}")
async def get_pet(pet_id: str):
    container = get_container()
    try:
        query = f"SELECT * FROM c WHERE c.id = '{pet_id}'"
        items = list(container.query_items(
            query=query,
            enable_cross_partition_query=True
        ))
        if not items:
            raise HTTPException(status_code=404, detail="Pet not found")
        return items[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.delete("/{pet_id}")
async def delete_pet(pet_id: str):
    container = get_container()
    
    # Step 1: find the pet first
    query = f"SELECT * FROM c WHERE c.id = '{pet_id}'"
    items = list(container.query_items(
        query=query,
        enable_cross_partition_query=True
    ))
    
    if not items:
        raise HTTPException(status_code=404, detail="Pet not found")
    
    pet = items[0]
    photo_url = pet.get("photo_url")
    species = pet.get("species")
    
    # Step 2: delete blob first (safe order)
    if photo_url:
        blob_deleted = False
        for attempt in range(3):
            try:
                delete_photo(photo_url)
                blob_deleted = True
                break
            except Exception:
                if attempt == 2:
                    raise HTTPException(
                        status_code=500,
                        detail="Failed to delete photo after 3 attempts"
                    )
        
    # Step 3: delete from Cosmos DB with retry
    for attempt in range(3):
        try:
            container.delete_item(item=pet_id, partition_key=species)
            return {"message": f"Pet {pet_id} deleted successfully"}
        except Exception as e:
            if attempt == 2:
                raise HTTPException(
                    status_code=500,
                    detail=f"Photo deleted but failed to delete pet record after 3 attempts. Pet id: {pet_id}"
                )