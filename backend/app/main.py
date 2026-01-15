from app.routers.auth_route import router as auth_router
from app.routers.cart_item_router import router as cart_router
from app.routers.coupon_route import router as coupon_router
from app.routers.order_router import router as order_router
from app.routers.products_route import router as product_router
from app.routers.review_route import router as review_router
from app.routers.user_route import router as user_router
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
app.include_router(user_router, prefix="/api/user", tags=["User"])
app.include_router(product_router, prefix="/api/products", tags=["Product"])
app.include_router(cart_router, prefix="/api/cart", tags=["Cart"])
app.include_router(coupon_router, prefix="/api/coupon", tags=["Coupon"])
app.include_router(review_router, prefix="/api/review", tags=["Review"])
app.include_router(order_router, prefix="/api/order", tags=["Order"])


@app.get("/health")
async def health_check():
    return status.HTTP_200_OK
