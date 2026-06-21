"use client";

import { useState } from "react";
import { filterProducts, FilterParams } from "../../../../../api/filterProducts";
import { Parfum } from "../../cart/page";

interface FilterPanelProps {
  setParfum: React.Dispatch<React.SetStateAction<Parfum[]>>;
  onClear: () => void;
}

export default function FilterPanel({ setParfum, onClear }: FilterPanelProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [inStock, setInStock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);

  async function handleFilter() {
    setLoading(true);
    try {
      const params: FilterParams = {};
      if (name.trim()) params.name = name.trim();
      if (maxPrice) params.max_price = parseFloat(maxPrice);
      if (minRating) params.min_rating = parseFloat(minRating);
      if (inStock) params.in_stock = true;

      const results = await filterProducts(params);
      setParfum(results);
      setActive(true);
      setOpen(false);
    } catch {
      console.error("Erro ao filtrar produtos");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setName("");
    setMaxPrice("");
    setMinRating("");
    setInStock(false);
    setActive(false);
    onClear();
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 border-2 px-3 py-1.5 rounded-md font-semibold text-sm transition-colors duration-200 ${
          active
            ? "bg-amber-400 text-teal-950 border-amber-400"
            : "bg-teal-950 text-amber-200 border-transparent hover:bg-teal-800"
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>
        </svg>
        Filtros{active ? " (ativo)" : ""}
      </button>

      {open && (
        <div className="absolute top-10 right-0 z-30 bg-white border border-teal-200 rounded-xl shadow-xl p-5 w-72 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-teal-950 border-b border-gray-100 pb-2">
            Filtrar produtos
          </h3>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-teal-900">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Chanel"
              className="outline-none rounded-lg border border-teal-200 p-2 text-sm text-teal-950 focus:ring-2 focus:ring-teal-700"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-teal-900">Preço máximo (R$)</label>
            <input
              type="number"
              step="0.01"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Ex: 300"
              className="outline-none rounded-lg border border-teal-200 p-2 text-sm text-teal-950 focus:ring-2 focus:ring-teal-700"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-teal-900">
              Avaliação mínima (1–5)
            </label>
            <input
              type="number"
              step="0.5"
              min="1"
              max="5"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              placeholder="Ex: 4"
              className="outline-none rounded-lg border border-teal-200 p-2 text-sm text-teal-950 focus:ring-2 focus:ring-teal-700"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="w-4 h-4 accent-teal-950"
            />
            <span className="text-sm font-semibold text-teal-900">Apenas em estoque</span>
          </label>

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleFilter}
              disabled={loading}
              className="flex-1 bg-teal-950 text-amber-200 py-2 rounded-lg font-semibold text-sm hover:bg-teal-800 transition disabled:opacity-60"
            >
              {loading ? "Buscando..." : "Aplicar"}
            </button>
            <button
              onClick={handleClear}
              className="flex-1 bg-gray-100 text-teal-950 py-2 rounded-lg font-semibold text-sm hover:bg-gray-200 transition"
            >
              Limpar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
