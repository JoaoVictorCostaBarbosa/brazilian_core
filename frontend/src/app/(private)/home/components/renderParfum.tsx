"use client";

import { useState } from "react";
import ParfumBox from "./parfumBox";
import { Parfum } from "./cart/cart";

interface RenderParfumProps {
  parfum: Parfum[];
}

export default function RenderParfum({ parfum }: RenderParfumProps) {
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  if (parfum.length === 0) {
    return <h1 className="text-6xl font-bold text-teal-950 text-center p-10">Sem perfumes disponíveis.</h1>;
  }

  const totalPages = Math.ceil(parfum.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const currentParfums = parfum.slice(startIndex, endIndex);

  return (
    <div>
      <div className="grid grid-cols-3 gap-10 m-10">
        {currentParfums.map((item) => (
          <ParfumBox key={item.id} parfum={item} />
        ))}
      </div>

      <div className="flex justify-center gap-4 mb-10 items-center">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)} className="px-4 py-2 bg-amber-200 text-teal-950 rounded disabled:opacity-50">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
        </svg>
        </button>

        <span className="font-semibold text-teal-950">
          Página {currentPage} de {totalPages}
        </span>

        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)} className="px-4 py-2 bg-amber-200 text-teal-950 rounded disabled:opacity-50">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
