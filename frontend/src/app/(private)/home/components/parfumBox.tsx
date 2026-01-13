import { Parfum } from "./cart/cart";
import { useCart } from "./cart/cartContext";

interface ParfumBoxProps {
    parfum: Parfum;
}


export default function ParfumBox({ parfum }: ParfumBoxProps){
    const {addToCart} = useCart();

    return(
        <div className="h-150 w-full bg-white/12 backdrop-blur-xs border outline-none shadow-md shadow-gray-600 border-white/20 rounded-lg cursor-pointer text-blue-300">
            <div>
                <img src={parfum.url_img} alt={parfum.name} className="w-full h-100 object-cover rounded-t-lg"/>
            </div>
            <div className="flex justify-center items-center flex-col h-50">
                <h2 className="text-xl text-emerald-900 text-center plaster-regular">{parfum.name}</h2>
                <p className="text-center text-emerald-900">{parfum.description}</p>
                <h3 className="text-center text-emerald-900 font-bold">R$ {parfum.price}</h3>
                <button className="bg-amber-200 hover:bg-emerald-900 hover:text-amber-200 rounded-md p-2 text-center shadow-md shadow-gray-600 transition-colors duration-300 ease-in-out mt-2" onClick={() => {
                    let id = parfum.id
                     addToCart(id)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart text-emerald-900 hover:text-amber-200 w-30" viewBox="0 0 16 16">
                         <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                    </svg>
                </button>
            </div>    
        </div>
    )
}