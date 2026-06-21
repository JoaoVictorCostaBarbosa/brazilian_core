from datetime import date

from app.models.user import User, UserRole
from app.repositories.stats_repo import StatsRepository
from app.schemas.stats_schema import OverviewResponse, RevenueDayResponse, TopProductResponse
from app.security.auth import get_current_user
from fastapi import APIRouter, Depends, HTTPException, Query
from starlette import status

router = APIRouter()


def _require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Somente admins podem acessar as estatísticas",
        )
    return current_user


@router.get("/overview", response_model=OverviewResponse, status_code=status.HTTP_200_OK)
def get_overview(
    _: User = Depends(_require_admin),
    stats_repo: StatsRepository = Depends(StatsRepository),
):
    return stats_repo.get_overview()


@router.get(
    "/top-products",
    response_model=list[TopProductResponse],
    status_code=status.HTTP_200_OK,
)
def get_top_products(
    limit: int = Query(default=5, ge=1, le=20),
    _: User = Depends(_require_admin),
    stats_repo: StatsRepository = Depends(StatsRepository),
):
    return stats_repo.get_top_products(limit)


@router.get(
    "/revenue",
    response_model=list[RevenueDayResponse],
    status_code=status.HTTP_200_OK,
)
def get_revenue_by_period(
    start: date = Query(..., description="Data inicial (YYYY-MM-DD)"),
    end: date = Query(..., description="Data final (YYYY-MM-DD)"),
    _: User = Depends(_require_admin),
    stats_repo: StatsRepository = Depends(StatsRepository),
):
    if end < start:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="A data final não pode ser anterior à data inicial",
        )
    return stats_repo.get_revenue_by_period(start, end)
