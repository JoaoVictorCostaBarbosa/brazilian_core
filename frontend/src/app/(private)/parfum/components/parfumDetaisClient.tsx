"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProductsById } from "../../../../../api/getProductById";
import RenderParfumPage from "./renderParfumDetailsPage";
import { Parfum } from "../../home/components/cart/cart";

interface Props {
  productId: string;
}

export default function ParfumDetailsClient({ productId }: Props) {
  const [parfum, setParfum] = useState<Parfum | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchParfum() {
      try {
        setLoading(true);
        const product = await getProductsById(productId);
        setParfum(product);
      } catch (err) {
        setError("Erro ao carregar produto");
      } finally {
        setLoading(false);
      }
    }

    if (productId) fetchParfum();
  }, [productId]);

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

      <div className="p-4 flex items-center">
        {loading && <p>Carregando...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {parfum && <RenderParfumPage parfum={parfum} />}
      </div>
    </div>
  );
}
