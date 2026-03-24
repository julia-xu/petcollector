import os
from dotenv import load_dotenv
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.cognitiveservices.vision.computervision.models import VisualFeatureTypes
from msrest.authentication import CognitiveServicesCredentials

load_dotenv()

endpoint = os.getenv("AZURE_VISION_ENDPOINT")
key = os.getenv("AZURE_VISION_KEY")

client = ComputerVisionClient(endpoint, CognitiveServicesCredentials(key))

def analyze_pet_photo(image_url: str) -> dict:
    features = [
        VisualFeatureTypes.tags,
        VisualFeatureTypes.description,
        VisualFeatureTypes.objects
    ]
    
    result = client.analyze_image(image_url, visual_features=features)
    
    tags = [tag.name for tag in result.tags if tag.confidence > 0.7]
    description = result.description.captions[0].text if result.description.captions else "unknown animal"
    objects = [obj.object_property for obj in result.objects]
    
    return {
        "tags": tags,
        "description": description,
        "objects": objects,
        "is_animal": any(t in tags for t in ["cat", "dog", "animal", "pet", "bird", "rabbit", "hamster"])
    }