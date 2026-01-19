"use client";
import { useEffect, useState } from "react";
import RenderCartItems from "./renderCartItems";
import { useCart } from "./cartContext";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { createOrder } from "../../../../api/order";

export interface Parfum {
  id: string;
  name: string;
  price: number;
  description: string;
  stock_quantity: number;
  url_img: string;
}

interface CouponFormData {
  coupon_code?: string;
}

export default function Cart() {
  const { cartItems, getCurrCartItems, setCartItems } = useCart();
  const { register, handleSubmit } = useForm<CouponFormData>();
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getCurrCartItems();
  }, [cartItems]);

  async function finalizePurchase() {
    try {
      setSuccess(false);
      setLoading(true);
      setError(null);
      const response = await createOrder(couponCode ?? undefined);
      if (response.status !== 201) throw new Error("Erro ao finalizar compra");
      setCartItems([])
      getCurrCartItems()
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch {
      setError("Erro ao finalizar compra");
    } finally {
      setCouponCode(null);
      setLoading(false);
    }
  }

  const hasItems = cartItems.length > 0;

  return (
    <div>
      <div className="h-[7vh] bg-amber-200 grid grid-cols-2 items-center">
        <h1 className="ml-7 text-6xl font-extrabold text-teal-950">Brazilian core</h1>

        <div className="flex justify-end px-4">
          <Link href="/home" className="text-amber-200 bg-teal-950 py-2 px-4 rounded-lg">Voltar</Link>
        </div>
      </div>

      <div className="p-6 rounded-b-lg">
        {hasItems ? <RenderCartItems cartItems={cartItems} /> : <p className="text-center text-2xl font-bold text-teal-950">Carrinho vazio</p>}

        <form onSubmit={handleSubmit((data) => setCouponCode(data.coupon_code ?? null))} className={`bg-white rounded-xl shadow-md p-4 border border-teal-400 ${hasItems ? "flex" : "hidden"} flex-col gap-4 mt-4`}>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-teal-900">Código do cupom</label>
            <input {...register("coupon_code")} className="outline-none rounded-lg border border-teal-200 p-3 text-teal-950 focus:ring-2 focus:ring-emerald-700 transition" />
          </div>

          <button type="submit" className="bg-emerald-900 max-w-fit px-4 text-amber-100 rounded-xl py-3 font-semibold text-lg hover:bg-emerald-800 transition">Aplicar cupom</button>
        </form>

        {couponCode && <div className="mt-4 bg-emerald-50 border border-emerald-700 rounded-xl p-4 text-emerald-900 font-semibold">Cupom aplicado: <span className="uppercase">{couponCode}</span></div>}

        {error && <p className="text-red-600 mt-4">{error}</p>}
        {success && <p className="text-green-600 mt-4">Compra finalizada com sucesso</p>}

        <button onClick={finalizePurchase} disabled={!hasItems || loading} className="mt-6 w-full py-3 rounded-xl font-bold text-lg bg-teal-900 text-amber-100 hover:bg-teal-800 transition-colors disabled:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70 shadow-sm hover:shadow-md">
          {loading ? "Finalizando..." : "Finalizar Compra"}
        </button>
      </div>
    </div>
  );
}
