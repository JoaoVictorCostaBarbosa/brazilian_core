"use client";
import { useState } from "react";
import Link from "next/link";

export default function Sidebar(){
      const [isOpen, setOpen] = useState(false);
    
    return(
        <div >
        <button
          className="bg-teal-950 mr-0 p-2 rounded-l-lg pr-4 cursor-pointer hover:shadow-lg hover:shadow-amber-200 transition-all duration-300"
          onClick={() => setOpen(!isOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            className="bi bi-list text-amber-200"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5 m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5 m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
          </svg>
        </button>

      {isOpen && (
        <aside
          className={`fixed top-0 right-0 w-64 bg-teal-950 z-20 transform transition-transform duration-300 h-screen`}>
          <button
            className="text-amber-200 text-xl p-4"
            onClick={() => setOpen(!isOpen)}
          >
            ✕
          </button>

          <div className="p-6 bg-teal-950">
            <nav className="flex flex-col gap-4 mt-6">
              <Link href={"/user"} className="hover:text-amber-400 cursor-pointer text-amber-200 hover:border-b hover:border-amber-400 transition duration-300">Perfil</Link>
              <Link href={"/userReview"} className="hover:text-amber-400 cursor-pointer text-amber-200 hover:border-b hover:border-amber-400 transition duration-300">Ver minhas avaliações</Link>
              <a className="hover:text-amber-400 cursor-pointer text-amber-200 hover:border-b hover:border-amber-400 transition duration-300">Configurações</a>
              <a className="hover:text-amber-400 cursor-pointer text-amber-200 hover:border-b hover:border-amber-400 transition duration-300">Sair</a>
            </nav>
          </div>
        </aside>
      )}

        </div>
    )
}