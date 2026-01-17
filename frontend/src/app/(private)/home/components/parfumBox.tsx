import { Parfum } from "./cart/cart";
import { useCart } from "./cart/cartContext";
import Link from "next/link";

interface ParfumBoxProps {
    parfum: Parfum;
}


export default function ParfumBox({ parfum }: ParfumBoxProps){
    const {addToCart} = useCart();

    return(
        <Link href={`/parfum/${parfum.id}`}  className="h-150 w-full bg-white/12 backdrop-blur-xs border outline-none shadow-md shadow-gray-600 border-white/20 rounded-lg cursor-pointer text-blue-300">
            <div>
                <img src={parfum.url_img} alt={parfum.name} className="w-full h-100 object-cover rounded-t-lg"/>
            </div>
            <div className="flex justify-center items-center flex-col h-50">
                <h2 className="text-xl text-emerald-900 text-center plaster-regular">{parfum.name}</h2>
                <p className="text-center text-emerald-900">{parfum.description}</p>
                <h3 className="text-center text-emerald-900 font-bold">R$ {parfum.price}</h3>
            </div>    
        </Link>
    )
}