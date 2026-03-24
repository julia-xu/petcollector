from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime

class Pet(BaseModel):
    id: str = str(uuid.uuid4())
    name: str
    species: str
    description: str
    personality: str
    fun_fact: str
    rarity: str
    tags: list[str]
    photo_url: Optional[str] = None
    collected_by: str = "anonymous"
    collected_at: str = str(datetime.utcnow())