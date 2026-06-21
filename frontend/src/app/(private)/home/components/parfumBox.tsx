import { Parfum } from "../../cart/page";
import { useCart } from "../../cart/cartContext";
import Link from "next/link";

interface ParfumBoxProps {
    parfum: Parfum;
}

function StockBadge({ qty }: { qty: number }) {
    if (qty === 0) return <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Esgotado</span>;
    if (qty <= 5) return <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Últimas {qty} unidades</span>;
    return <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Em estoque</span>;
}

export default function ParfumBox({ parfum }: ParfumBoxProps){
    const {addToCart} = useCart();

    return(
        <Link href={`/parfum/${parfum.id}`}  className="h-150 w-full bg-white/12 backdrop-blur-xs border outline-none shadow-md shadow-gray-600 border-white/20 rounded-lg cursor-pointer text-blue-300">
            <div className="relative">
                <img src={parfum.url_img} alt={parfum.name} className="w-full h-100 object-cover rounded-t-lg"/>
                <div className="absolute top-2 left-2">
                    <StockBadge qty={parfum.stock_quantity} />
                </div>
            </div>
            <div className="flex justify-center items-center flex-col h-50">
                <h2 className="text-4xl font-extrabold text-emerald-900 text-center ">{parfum.name}</h2>
                <p className="text-center text-emerald-900">{parfum.description}</p>
                <h3 className="text-center text-emerald-900 font-bold">R$ {parfum.price}</h3>
            </div>
        </Link>
    )
}