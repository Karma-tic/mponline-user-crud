from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.api.user import router as user_router

app = FastAPI(
    title="MPOnline - Secure User Management",
    description="Government Standard Secure CRUD API",
    version="1.0.0"
)

# CORS Security
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)

@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")

@app.get("/")
def home():
    return {
        "message": "✅ MPOnline Secure User CRUD API is running",
        "docs_url": "http://localhost:8000/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)