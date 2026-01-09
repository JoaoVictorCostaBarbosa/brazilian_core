from app.routers.auth_route import router as auth_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette import status

app = FastAPI(
    title="Brazil core API",
    description="API para o projeto final de disciplina de banco de dados.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])

@app.get("/health")
async def health_check():
    return status.HTTP_200_OK
