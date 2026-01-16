"use client";

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
    <header className="w-full py-3 gap-4 flex justify-end top-0 left-0 z-20 backdrop-blur-xs border outline-none shadow-md shadow-gray-600 border-white/20 rounded-b-lg bg-amber-200">
    
    <form onSubmit={handleSubmit( async(data) => {
      if(!data.preco){
        return
      }

      let formatedPrice = data.preco.replace(",", ".");
      let numberPrice = Number(formatedPrice);
      getFilteredParfum(numberPrice);
     })} className="flex gap-2">
          <input {...register("preco", { pattern: /^\d+(,\d{1,2})?$/})} placeholder="Busque pelo preço" className=" outline-none border-0 border-b-3 border-teal-950 py-2 pl-2 focus:border-teal-700 hover:border-teal-700 transition-colors duration-300 ease-in-out text-teal-950"/>
          <button type="submit" className=" border-2 border-transparent bg-teal-950 rounded-md text-amber-200 hover:bg-amber-200 hover:text-teal-950 hover:border-2 hover:border-teal-950 hover:shadow transition-colors duration-300 ease-in-out px-3">
            Buscar
          </button>
      </form>
     <Cart/>
    <Sidebar/>
    
    </header>
    </>
  );
}
