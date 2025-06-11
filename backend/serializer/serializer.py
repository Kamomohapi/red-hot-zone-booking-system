# helpers/mongo_serialization.py

from bson import ObjectId

def serialize_mongo_document(doc: dict) -> dict:
    if not doc:
        return doc
    serialized = {}
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            serialized[key] = str(value)
        else:
            serialized[key] = value
    return serialized
