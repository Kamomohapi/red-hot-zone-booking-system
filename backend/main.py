from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from routes.user_routes import user_endpoints
from routes.salon_routes import salon_endpoints
from routes.booking_routes import booking_endpoints
from routes.service_routes import service_endpoints
from dotenv import load_dotenv
import os

app = FastAPI()

load_dotenv()
origins = [
    "http://localhost:3000",  # React app
    "http://127.0.0.1:3000",
    "http://localhost:3001"  # React app
    "https://your-production-domain.com",  # Production domain
]

# cors configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# application routers
app.include_router(user_endpoints, prefix="/api")
app.include_router(salon_endpoints, prefix="/api")
app.include_router(booking_endpoints, prefix="/api")
app.include_router(service_endpoints, prefix="/api")

# Custom OpenAPI schema with JWT Bearer Auth
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="Red Hot Zone Booking API",
        version="1.0.0",
        description="API for salon registration and booking system",
        routes=app.routes,
    )

    # Register BearerAuth in components
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }

    # Apply globally to all routes
    for path in openapi_schema["paths"].values():
        for method in path.values():
            method["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
