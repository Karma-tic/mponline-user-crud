from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.models.user import User

app = FastAPI(
    title="MPOnline - Secure User Management",
    description="Government Standard Secure CRUD API",
    version="1.0.0",
    docs_url="/docs"
)

# Security Headers + CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React ke liye
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)
    print("✅ All database tables created successfully!")

@app.get("/")
def home():
    return {
        "message": "✅ MPOnline Secure User CRUD API is running",
        "status": "secure",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)