"use client"; 
import { useEffect, useState } from "react"; 
import RenderCartItems from "./renderCartItems";
import { useCart } from "./cartContext";
import { CartItemProps } from "./cartContext";

export interface Parfum {
    id: string,
    name: string,
    price: number
    description: string,
    stock_quantity: number,
    url_img: string
}


export default function Cart(){ 
  const [isOpen, setOpen] = useState(false); 
  const { cartItems, getCartItems, getCurrCartItems } = useCart();

  useEffect(() => {
    getCurrCartItems();
  }, [cartItems]);

  const hasItems = cartItems.length;

  return (
    <div>
    <button className="bg-teal-950 mr-0 p-2 rounded-lg cursor-pointer hover:shadow-lg hover:shadow-amber-200 transition-all duration-300" onClick={()=> setOpen(!isOpen)} > <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-cart text-amber-200 hover:text-teal-950" viewBox="0 0 16 16"> <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/> </svg> </button>
      
      {isOpen && (
        <aside
          className="fixed top-1 right-1 h-full w-64 bg-teal-950 z-20
                     transform transition-transform duration-300 rounded-lg"
        >
          <button
            className="text-amber-200 text-xl p-4"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>

          <div className="p-6 bg-amber-50 rounded-b-lg">
            {hasItems
            ? <RenderCartItems cartItems={cartItems} />
            : <p>Carrinho vazio</p>
          }
          </div>
        </aside>
      )}
    </div>
  );
}
