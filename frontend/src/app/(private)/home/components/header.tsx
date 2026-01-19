"use client";

import {getProductsByPrice} from "../../../../../api/getProductsByPrice";
import { useForm } from "react-hook-form";
import Link from "next/link";
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
      getFilteredParfum(data.preco);
     })} className="flex gap-2">
          <input type="number" {...register("preco", { pattern: /^\d+(,\d{1,2})?$/})} placeholder="Busque pelo preço" className=" outline-none border-0 border-b-3 border-teal-950 py-2 pl-2 focus:border-teal-700 hover:border-teal-700 transition-colors duration-300 ease-in-out text-teal-950"/>
          <button type="submit" className=" border-2 border-transparent bg-teal-950 rounded-md text-amber-200 hover:bg-amber-200 hover:text-teal-950 hover:border-2 hover:border-teal-950 hover:shadow transition-colors duration-300 ease-in-out px-3">
            Buscar
          </button>
      </form>
      <Link href={"/cart"} className="flex justify-center items-center border-2 border-transparent bg-teal-950 rounded-md text-amber-200 hover:bg-amber-200 hover:text-teal-950 hover:border-2 hover:border-teal-950 hover:shadow transition-colors duration-300 ease-in-out px-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16">
          <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
        </svg>
      </Link>
    <Sidebar/>
    
    </header>
    </>
  );
}
