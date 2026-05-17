from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address
from app.core.database import engine, Base
from app.api.user import router as user_router

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="MPOnline - Secure User Management",
    description="Government Standard Secure CRUD API",
    version="1.0.0"
)

# Rate Limiting Middleware
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

# CORS Security
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Router
app.include_router(user_router)

@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables are ready!")

@app.get("/")
def home():
    return {
        "message": "✅ MPOnline Secure User CRUD API is running safely",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)