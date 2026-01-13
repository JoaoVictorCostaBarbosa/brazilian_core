"use client";

import { useState } from "react";
import {getProductsByPrice} from "../../../../../api/getProductsByPrice";
import { useForm } from "react-hook-form";
import Cart from "./cart/cart";
import Sidebar from "./sidebar";

interface Parfum {
    id: string,
    name: string,
    price: number
    description: string,
    stock_quantity: number,
    url_img: string
}

interface HeaderProps {
  setParfum: React.Dispatch<React.SetStateAction<Parfum[]>>;
}

export default function Header( {setParfum}: HeaderProps ) {
  const { handleSubmit, register, formState: { errors } } = useForm();
  const [filteredParfum, setFilteredParfum] = useState("");
  const [openCart, setOpebCart] = useState(false)

  async function getFilteredParfum(preco: number) {
    try{
      const products = await getProductsByPrice(preco);
      setParfum(products);
    } catch (error) {
      console.error("Error fetching parfums:", error);
    }
  }

  

  return (
    <>
    <header className="w-full py-3 gap-4 flex justify-end top-0 left-0 z-20 bg-white/12 backdrop-blur-xs border outline-none shadow-md shadow-gray-600 border-white/20 rounded-b-lg">
    
    <form onSubmit={handleSubmit((data) => {
      let numberPrice = Number(data.preco);
      getFilteredParfum(numberPrice);
     })} className="flex gap-2">
            <input {...register("preco")} placeholder="Busque pelo preço" required className=" outline-none border-0 border-b-3 border-emerald-800 py-2 pl-2 focus:border-amber-200 hover:border-emerald-800 transition-colors duration-300 ease-in-out text-amber-200"/>
             <button type="submit" className="  bg-teal-950 rounded-md text-amber-200 hover:bg-amber-200 hover:text-teal-950 transition-colors duration-300 ease-in-out px-3">
              Buscar
            </button>
      </form>
     <Cart/>
    <Sidebar/>
    
    </header>
    </>
  );
}
