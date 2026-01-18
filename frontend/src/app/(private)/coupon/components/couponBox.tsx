import { coupon } from "./couponsRendedPage";
import { UserPropsReturn, useUser } from "../../user/context/userContext";
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { deleteCoupon, patchCoupon } from "../../../../../api/coupon";

interface props{
    coupon: coupon;
    getAvalibleCoupons: () => Promise<void>,
    currUser: UserPropsReturn | undefined
}

export default function CouponBox({coupon, getAvalibleCoupons, currUser}: props){
    const isExpired = new Date(coupon.expires_at) < new Date();
    const [openEdit, setOpenEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { register, handleSubmit } = useForm();

    async function deleteCurrCoupon(id: string) {
        try {
          setLoading(true);
          setError(null);
          const response = await deleteCoupon(id);
          if (response.status !== 204) throw new Error("Erro ao deletar cupon")
        
          await getAvalibleCoupons();
          
        } catch {
          setError("Erro ao deletar review");
        } finally {
          setLoading(false);
        }
    }

    async function updateCoupon(id: string, percentage: number) {
        try {
            const couponBuffer = coupon;

            if ( percentage !== null && percentage !== couponBuffer.discount_percentage) {
                 await patchCoupon(id, percentage);
            }

            setOpenEdit(false);
            await getAvalibleCoupons();
        } catch {
            setError("Erro ao atualizar cupom");
        }
    }


    return (
        <div className="bg-white rounded-xl shadow-md p-4 border border-teal-400 m-4">
            <div className={openEdit ? "hiden" : "block"}>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold text-teal-950 font-mono">
                    {coupon.code}
                    </span>
                    <span
                    className={`text-sm font-medium ${
                        isExpired ? "text-red-600" : "text-emerald-700"
                    }`}
                    >
                    {isExpired ? "Expirado" : "Ativo"}
                    </span>
                </div>
                <div className="flex flex-col gap-1 text-gray-700">
                    <p>
                    <span className="font-semibold text-teal-900">Desconto:</span>{" "}
                    {coupon.discount_percentage}%
                    </p>
                    <p className="text-sm text-gray-500">
                    Expira em{" "}
                    {new Date(coupon.expires_at).toLocaleDateString("pt-BR")}
                    </p>
                </div>
            </div>

            <div className={openEdit ? "block" : "hidden"}>
                <form onSubmit={handleSubmit((data) => { updateCoupon( coupon.id, Number(data.discount_percentage));})} className="flex flex-col border border-teal-400 p-2 rounded-lg my-2">
                    <label htmlFor="discount_percentage" className="text-lg text-teal-950">Porcentagem de desconto</label>
                    <input type="number" {...register("discount_percentage")} placeholder="EX: 20" required className="outline-none border-0 border-b-3 border-teal-200 py-2 pl-2 focus:border-emerald-800 hover:border-emerald-800 transition-colors duration-300 ease-in-out text-teal-950 mb-7"/>
                    <input type="submit" className="max-w-fit px-2 bg-teal-200 rounded-md hover:bg-emerald-800 hover:text-amber-100 py-2 transition-colors duration-300 ease-in-out"/>
                </form>
                {error &&<p className="text-lg text-red-600 mt-4">{error}</p>}
            </div>

            {currUser?.role === "admin" && (
                <div className="flex gap-4 my-2">
                    <button onClick={() => deleteCurrCoupon(coupon.id)} className={`text-red-500 hover:text-red-900 transition bg-white border border-red-200 rounded-lg shadow-sm hover:border-red-600 ${openEdit ? "hidden" : "block"}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash mx-3 my-2" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                        </svg>
                    </button>
                     <button className={`text-teal-950 border border-teal-200 px-2 max-w-fit rounded-lg shadow shadow-teal-200 hover:border-teal-950 ${openEdit ? "hidden" : "block"}`} onClick={() => setOpenEdit(true)}>
                        Editar desconto
                    </button>
                    {error&& (<p className="text-red-700">Erro ao manioular cupom</p>)}
                </div>
            )}

        </div>
    );
}