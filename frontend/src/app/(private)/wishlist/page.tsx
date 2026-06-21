"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getWishlist, removeFromWishlist, WishlistItem } from "../../../../api/wishlist";
import { setCartItem } from "../../../../api/cart";

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  async function fetchWishlist() {
    try {
      const res = await getWishlist();
      if (res.status !== 200) throw new Error();
      setItems(res.data as WishlistItem[]);
    } catch {
      setError("Erro ao carregar lista de desejos");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(productId: string) {
    const res = await removeFromWishlist(productId);
    if (res.status === 204) {
      setItems((prev) => prev.filter((i) => i.product_id !== productId));
    }
  }

  async function handleMoveToCart(productId: string) {
    const status = await setCartItem(productId);
    if (status === 201) {
      await handleRemove(productId);
      setFeedback("Produto movido para o carrinho!");
      setTimeout(() => setFeedback(null), 3000);
    }
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="h-[7vh] bg-amber-200 grid grid-cols-2 items-center px-7">
        <h1 className="text-4xl font-extrabold text-teal-950">Brazilian Core</h1>
        <div className="flex justify-end">
          <Link
            href="/home"
            className="text-amber-200 bg-teal-950 py-2 px-4 rounded-lg font-semibold hover:bg-teal-800 transition"
          >
            Voltar
          </Link>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-teal-950 mb-6">Lista de Desejos</h2>

        {feedback && (
          <div className="mb-4 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl px-4 py-3 text-sm font-semibold">
            {feedback}
          </div>
        )}

        {loading && <p className="text-teal-800">Carregando...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && items.length === 0 && (
          <p className="text-2xl font-bold text-teal-950 text-center mt-16">
            Sua lista de desejos está vazia.
          </p>
        )}

        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-teal-200 p-4 flex items-center gap-4"
            >
              <Link href={`/parfum/${item.product_id}`}>
                <img
                  src={item.url_img}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg shrink-0 hover:opacity-90 transition"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/parfum/${item.product_id}`}>
                  <p className="font-bold text-teal-950 truncate hover:underline">
                    {item.name}
                  </p>
                </Link>
                <p className="text-emerald-800 font-semibold text-sm mt-0.5">
                  R$ {Number(item.price).toFixed(2)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {item.stock_quantity === 0
                    ? "Esgotado"
                    : item.stock_quantity <= 5
                    ? `Últimas ${item.stock_quantity} unidades`
                    : "Em estoque"}
                </p>
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => handleMoveToCart(item.product_id)}
                  disabled={item.stock_quantity === 0}
                  className="text-sm bg-teal-950 text-amber-200 px-3 py-1.5 rounded-lg font-semibold hover:bg-teal-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mover ao carrinho
                </button>
                <button
                  onClick={() => handleRemove(item.product_id)}
                  className="text-sm bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-100 transition"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
