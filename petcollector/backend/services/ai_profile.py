import os
from openai import AzureOpenAI
from dotenv import load_dotenv

load_dotenv()

client = AzureOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_KEY"),
    api_version="2024-02-01"
)

def generate_pet_profile(tags: list, description: str) -> dict:
    prompt = f"""
    You are a fun, creative pet personality writer for an app called PetCollector.
    
    A photo was analyzed and here is what was found:
    - Description: {description}
    - Tags: {", ".join(tags)}
    
    Write a pet profile with exactly these fields:
    - name: a creative fitting name for this pet
    - personality: 2-3 sentences describing their personality, funny and charming
    - fun_fact: one made up but believable fun fact about this specific pet
    - rarity: one word, either Common, Uncommon, Rare, or Legendary based on how exotic the animal seems
    
    Respond in this exact format:
    NAME: ...
    PERSONALITY: ...
    FUN_FACT: ...
    RARITY: ...
    """

    response = client.chat.completions.create(
        model=os.getenv("AZURE_OPENAI_DEPLOYMENT"),
        messages=[
            {"role": "user", "content": prompt}
        ],
        max_tokens=300,
        temperature=0.8
    )

    text = response.choices[0].message.content
    lines = text.strip().split("\n")
    
    profile = {}
    for line in lines:
        if line.startswith("NAME:"):
            profile["name"] = line.replace("NAME:", "").strip()
        elif line.startswith("PERSONALITY:"):
            profile["personality"] = line.replace("PERSONALITY:", "").strip()
        elif line.startswith("FUN_FACT:"):
            profile["fun_fact"] = line.replace("FUN_FACT:", "").strip()
        elif line.startswith("RARITY:"):
            profile["rarity"] = line.replace("RARITY:", "").strip()
    
    return profile