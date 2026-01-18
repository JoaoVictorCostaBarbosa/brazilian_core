"use client";

import { useEffect, useState } from "react";
import { getCoupons, postCoupon } from "../../../../../api/coupon";
import RenderAvalibleCoupons from "./renderCoupons";
import { useUser } from "../../user/context/userContext";
import { useForm } from "react-hook-form";

export interface coupon {
  id: string;
  code: string;
  discount_percentage: number;
  expires_at: string;
}

export interface CouponFormData {
  code: string;
  discount_percentage: number;
  expires_at: string;
}

export default function RenderCoupons() {
  const [coupons, setCoupons] = useState<coupon[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { currUser, getUser } = useUser();

  const { register, handleSubmit } = useForm<CouponFormData>({ shouldUnregister: false });

  useEffect(() => {
    if (!currUser) getUser();
  }, [currUser, getUser]);

  async function getCurrCoupons() {
    try {
      setError(null);
      setLoading(true);
      const response = await getCoupons();
      if (response.status !== 200) throw new Error("Erro ao buscar cupons");

        
      setCoupons(response.data);
    } catch {
      setError("Erro ao carregar cupons");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCurrCoupons();
  }, []);

  async function onSubmit(data: CouponFormData) {
    try{
        setLoading(true)
        setError(null)
        const response = await postCoupon(data);

        if (response.status !== 201) {
          throw new Error("Erro ao criar cupom");
        }
        
        await getCurrCoupons()
        
    } catch {
        setError("cupon já existente")
    } finally{
        setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-center m-4 text-teal-950">Cupons</h1>
      {currUser?.role === "admin" && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-md p-4 border border-teal-400 m-4 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-semibold text-teal-950 font-mono">Criar novo cupom</span>
            </div>

            <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-teal-900">Código</label>
            <input {...register("code")} placeholder="EX: PROMO20" required className="outline-none rounded-lg border border-teal-200 p-3 text-teal-950 focus:ring-2 focus:ring-emerald-700 transition" />
            </div>

            <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-teal-900">Desconto (%)</label>
            <input type="number" {...register("discount_percentage", { valueAsNumber: true })} placeholder="20" required className="outline-none rounded-lg border border-teal-200 p-3 text-teal-950 focus:ring-2 focus:ring-emerald-700 transition" />
            </div>

            <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-teal-900">Expira em</label>
            <input type="date" {...register("expires_at")} required className="outline-none rounded-lg border border-teal-200 p-3 text-teal-950 focus:ring-2 focus:ring-emerald-700 transition" />
            </div>

            
            <button type="submit" className="bg-emerald-900 max-w-fit px-4 text-amber-100 rounded-xl py-3 font-semibold text-lg hover:bg-emerald-800 hover:scale-[1.01] active:scale-95 transition-all duration-200">Criar cupom</button>
            {error && <p className="text-red-600">{error}</p>}
        </form>
        )}


      {loading && <p className="text-teal-950 text-lg">Carregando cupons...</p>}

      {coupons && coupons.length > 0 ? (
        <RenderAvalibleCoupons coupons={coupons} getAvalibleCoupons={getCurrCoupons} currUser={currUser}/>
      ) : (
        !loading && <h2 className="text-3xl font-bold mt-10 text-teal-950">Sem cupons disponíveis</h2>
      )}
    </div>
  );
}
