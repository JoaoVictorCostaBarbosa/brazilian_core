"use client"; 
import { useEffect, useState } from "react"; 
import RenderCartItems from "./renderCartItems";
import { useCart } from "./cartContext";
import { CartItemProps } from "./cartContext";
import Link from "next/link";

export interface Parfum {
    id: string,
    name: string,
    price: number
    description: string,
    stock_quantity: number,
    url_img: string
}


export default function Cart(){ 
  const { cartItems, getCartItems, getCurrCartItems } = useCart();

  useEffect(() => {
    getCurrCartItems();
  }, [cartItems]);

  const hasItems = cartItems.length;

  return (
    <div>

    <div className="h-[7vh] bg-amber-200 grid grid-cols-2 items-center">
        <h1 className="ml-7 text-6xl font-extrabold text-teal-950">
          Brazilian core
        </h1>

        <div className="flex justify-end px-4">
          <Link
            href="/home"
            className="text-amber-200 bg-teal-950 py-2 px-4 rounded-lg"
          >
            Voltar
          </Link>
        </div>
      </div>

      <div className="p-6 rounded-b-lg">
        {hasItems
        ? <RenderCartItems cartItems={cartItems} />
        : <p>Carrinho vazio</p>
      }
      </div>
    </div>
  );
}
