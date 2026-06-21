"use client";

import { useState } from "react";
import { Parfum } from "../../cart/page";
import { useCart } from "../../cart/cartContext";
import ReviewBox from "./reviewCard";
import { addToWishlist } from "../../../../../api/wishlist";

interface TesteProps {
  parfum: Parfum;
}

export default function RenderParfumPage({ parfum }: TesteProps) {
  const { addToCart } = useCart();
  const [wishlistMsg, setWishlistMsg] = useState<string | null>(null);

  async function handleAddToWishlist() {
    const res = await addToWishlist(parfum.id);
    if (res.status === 201) {
      setWishlistMsg("Adicionado à lista de desejos!");
    } else if (res.status === 409) {
      setWishlistMsg("Já está na lista de desejos.");
    } else {
      setWishlistMsg("Erro ao adicionar.");
    }
    setTimeout(() => setWishlistMsg(null), 3000);
  }

  return (
    <div className="mx-auto  px-4 py-10">
      <div className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center bg-amber-100 rounded-2xl shadow-lg p-8">
          <div className="md:col-span-1 flex justify-center">
            <img src={parfum.url_img} alt={parfum.name} className="rounded-2xl w-72 h-72 object-cover shadow-md" />
          </div>

          <div className="md:col-span-2 flex flex-col gap-4 text-teal-950">
            <h1 className="text-4xl font-extrabold tracking-tight">{parfum.name}</h1>

            <p className="text-lg text-teal-800 leading-relaxed max-w-xl">{parfum.description}</p>

            <span className="text-3xl font-bold text-emerald-900">R$ {parfum.price}</span>

            <div>
              {parfum.stock_quantity === 0 ? (
                <span className="inline-block text-sm font-semibold bg-red-100 text-red-700 px-3 py-1 rounded-full">Esgotado</span>
              ) : parfum.stock_quantity <= 5 ? (
                <span className="inline-block text-sm font-semibold bg-amber-100 text-amber-700 px-3 py-1 rounded-full">Últimas {parfum.stock_quantity} unidades</span>
              ) : (
                <span className="inline-block text-sm font-semibold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">{parfum.stock_quantity} em estoque</span>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={() => addToCart(parfum.id)}
                className="inline-flex items-center gap-3 bg-emerald-900 text-amber-100 px-6 py-3 rounded-xl font-semibold text-lg shadow-md shadow-emerald-900/30 hover:bg-emerald-800 hover:scale-[1.02] active:scale-95 transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16">
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7z" />
                </svg>
                Adicionar ao carrinho
              </button>

              <button
                onClick={handleAddToWishlist}
                className="inline-flex items-center gap-2 border-2 border-teal-950 text-teal-950 px-5 py-3 rounded-xl font-semibold text-lg hover:bg-teal-950 hover:text-amber-200 transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.885.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
                </svg>
                Lista de desejos
              </button>
            </div>

            {wishlistMsg && (
              <p className="text-sm font-semibold text-teal-700">{wishlistMsg}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <ReviewBox id={parfum.id}/>
      </div>
    </div>
  );
}
