from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import pets

app = FastAPI(
    title="PetDex API",
    description="Catch and identify pets using AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pets.router)

@app.get("/")
def root():
    return {"message": "Welcome to PetCollector API"}