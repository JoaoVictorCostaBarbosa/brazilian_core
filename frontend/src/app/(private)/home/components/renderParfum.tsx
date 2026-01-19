"use client";

import ParfumBox from "./parfumBox";
import { Parfum } from "../../cart/page";

interface RenderParfumProps {
  parfum: Parfum[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function RenderParfum({
  parfum,
  currentPage,
  setCurrentPage,
}: RenderParfumProps) {
  if (parfum.length === 0) {
    return (
      <h1 className="text-6xl font-bold text-teal-950 text-center p-10">
        Sem perfumes disponíveis.
      </h1>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-10 m-10">
        {parfum.map((item) => (
          <ParfumBox key={item.id} parfum={item} />
        ))}
      </div>

      <div className="flex justify-center gap-4 mb-10 items-center">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-4 py-2 bg-amber-200 text-teal-950 rounded disabled:opacity-50"
        >
          ⬅
        </button>

        <span className="font-semibold text-teal-950">
          Página {currentPage}
        </span>

        <button
          disabled={parfum.length < 6}
          onClick={() => {setCurrentPage((prev) => prev + 1)}}
          className="px-4 py-2 bg-amber-200 text-teal-950 rounded disabled:opacity-50"
        >
          ➡
        </button>
      </div>
    </div>
  );
}
