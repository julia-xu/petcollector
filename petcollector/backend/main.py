from fastapi import FastAPI
from routers import pets

app = FastAPI(
    title="PetCollector API",
    description="Collect and identify pets using AI",
    version="1.0.0"
)

app.include_router(pets.router)

@app.get("/")
def root():
    return {"message": "Welcome to PetCollector API"}