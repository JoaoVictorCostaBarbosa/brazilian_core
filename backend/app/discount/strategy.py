from abc import ABC, abstractmethod
from decimal import Decimal
from typing import Optional

from app.models.coupon import Coupon


class DiscountStrategy(ABC):
    """
    Strategy Pattern — interface comum para todas as estratégias de desconto.
    Permite adicionar novos tipos de desconto (fixo, frete grátis, compre X ganhe Y)
    sem alterar o código que os usa.
    """

    @abstractmethod
    def apply(self, price: Decimal) -> Decimal:
        ...


class NoDiscount(DiscountStrategy):
    """Estratégia nula: retorna o preço original sem modificação."""

    def apply(self, price: Decimal) -> Decimal:
        return price


class PercentageDiscount(DiscountStrategy):
    """Estratégia de desconto percentual baseada no cupom."""

    def __init__(self, percentage: int) -> None:
        self._factor = Decimal(1) - Decimal(percentage) / Decimal(100)

    def apply(self, price: Decimal) -> Decimal:
        return price * self._factor


def get_discount_strategy(coupon: Optional[Coupon]) -> DiscountStrategy:
    """Factory function que seleciona a estratégia correta para o cupom recebido."""
    if coupon is None:
        return NoDiscount()
    return PercentageDiscount(coupon.discount_percentage)
