"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  ProductFormData,
} from "../../../../../api/products";
import getProducts from "../../../../../api/getAllProducts";
import { Parfum } from "../../cart/page";
import { useUser } from "../../user/context/userContext";
import { useRouter } from "next/navigation";
import AdminHeader from "../components/adminHeader";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Parfum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Parfum | null>(null);

  const { currUser, getUser } = useUser();
  const router = useRouter();

  const { register, handleSubmit, reset, setValue } = useForm<ProductFormData>();

  useEffect(() => {
    async function init() {
      const user = await getUser();
      if (!user || user.role !== "admin") {
        router.push("/home");
        return;
      }
      await fetchProducts();
    }
    init();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const data = await getProducts(0, 9999);
      setProducts(data ?? []);
    } catch {
      setError("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(product: Parfum) {
    setEditingProduct(product);
    setValue("name", product.name);
    setValue("price", product.price);
    setValue("description", product.description);
    setValue("stock_quantity", product.stock_quantity);
    setValue("url_img", product.url_img);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingProduct(null);
    reset();
  }

  async function onSubmit(data: ProductFormData) {
    try {
      setError(null);
      setLoading(true);

      if (editingProduct) {
        const response = await updateProduct(editingProduct.id, data);
        if (response.status !== 200) throw new Error("Erro ao atualizar produto");
        setEditingProduct(null);
      } else {
        const response = await createProduct(data);
        if (response.status !== 201) throw new Error("Erro ao criar produto");
      }

      reset();
      await fetchProducts();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao salvar produto");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      setError(null);
      const response = await deleteProduct(id);
      if (response.status !== 204) throw new Error("Erro ao excluir produto");
      await fetchProducts();
    } catch {
      setError("Erro ao excluir produto");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="p-8 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-teal-950 mb-6">
          {editingProduct ? `Editando produto` : "Gerenciar Produtos"}
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-xl shadow-sm border border-teal-200 p-6 mb-8 flex flex-col gap-4"
        >
          <span className="text-base font-semibold text-teal-950 font-mono border-b border-teal-100 pb-2">
            {editingProduct ? `Editando: ${editingProduct.name}` : "Novo produto"}
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-teal-900">Nome</label>
              <input {...register("name")} required placeholder="Nome do produto" className="outline-none rounded-lg border border-teal-200 p-3 text-teal-950 focus:ring-2 focus:ring-teal-700 transition" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-teal-900">Preço (R$)</label>
              <input type="number" step="0.01" {...register("price", { valueAsNumber: true })} required placeholder="99.90" className="outline-none rounded-lg border border-teal-200 p-3 text-teal-950 focus:ring-2 focus:ring-teal-700 transition" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-teal-900">Estoque</label>
              <input type="number" {...register("stock_quantity", { valueAsNumber: true })} required placeholder="100" className="outline-none rounded-lg border border-teal-200 p-3 text-teal-950 focus:ring-2 focus:ring-teal-700 transition" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-teal-900">URL da imagem</label>
              <input {...register("url_img")} required placeholder="https://..." className="outline-none rounded-lg border border-teal-200 p-3 text-teal-950 focus:ring-2 focus:ring-teal-700 transition" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-teal-900">Descrição</label>
            <textarea {...register("description")} required rows={3} placeholder="Descrição do produto" className="outline-none rounded-lg border border-teal-200 p-3 text-teal-950 focus:ring-2 focus:ring-teal-700 transition resize-none" />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="bg-teal-950 px-5 py-2 text-amber-200 rounded-lg font-semibold hover:bg-teal-800 transition disabled:opacity-60">
              {editingProduct ? "Salvar alterações" : "Criar produto"}
            </button>
            {editingProduct && (
              <button type="button" onClick={cancelEdit} className="bg-gray-100 px-5 py-2 text-teal-950 rounded-lg font-semibold hover:bg-gray-200 transition">
                Cancelar
              </button>
            )}
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-teal-950">
            Catálogo ({products.length} produtos)
          </h3>
          {loading && <span className="text-sm text-teal-600">Carregando...</span>}
        </div>

        <div className="flex flex-col gap-3">
          {products.map((product) => (
            <div
              key={product.id}
              className={`bg-white rounded-xl border p-4 flex items-center gap-4 transition ${editingProduct?.id === product.id ? "border-teal-500 shadow-md" : "border-gray-200 shadow-sm"}`}
            >
              <img
                src={product.url_img}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-teal-950 truncate">{product.name}</p>
                <p className="text-sm text-gray-500 truncate">{product.description}</p>
                <div className="flex gap-3 mt-1 items-center">
                  <span className="text-emerald-800 font-semibold text-sm">
                    R$ {Number(product.price).toFixed(2)}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    product.stock_quantity === 0
                      ? "bg-red-100 text-red-700"
                      : product.stock_quantity <= 5
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {product.stock_quantity === 0 ? "Esgotado" : `${product.stock_quantity} em estoque`}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => startEdit(product)}
                  className="text-sm bg-teal-50 text-teal-900 border border-teal-200 px-3 py-1.5 rounded-lg hover:bg-teal-100 transition font-semibold"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-sm bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition font-semibold"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
