from services.vision import analyze_pet_photo
from services.ai_profile import generate_pet_profile

vision_result = analyze_pet_photo("https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/1200px-Cat_November_2010-1a.jpg")
print("Vision result:", vision_result)

profile = generate_pet_profile(vision_result["tags"], vision_result["description"])
print("\nPet profile:")
for key, value in profile.items():
    print(f"  {key}: {value}")