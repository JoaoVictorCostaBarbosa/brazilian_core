"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getOrders, getOrderById } from "../../../../api/order";

interface OrderSummary {
  order_id: string;
  user_id: string;
  coupon_id: string | null;
  order_purchase_at: string;
  total_products: number;
  total_items: number;
  total_value: number;
}

interface ProductPurchased {
  id: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
  url_img: string;
}

interface OrderDetail {
  order_id: string;
  user_id: string;
  coupon_id: string | null;
  order_purchase_at: string;
  products_register: ProductPurchased[];
  purchase_value: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await getOrders();
        if (response.status !== 200) throw new Error();
        setOrders(response.data as OrderSummary[]);
      } catch {
        setError("Erro ao carregar pedidos");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  async function openDetail(orderId: string) {
    try {
      setDetailLoading(true);
      setSelectedOrder(null);
      const response = await getOrderById(orderId);
      if (response.status !== 200) throw new Error();
      setSelectedOrder(response.data as OrderDetail);
    } catch {
      setError("Erro ao carregar detalhes do pedido");
    } finally {
      setDetailLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="h-[7vh] bg-amber-200 grid grid-cols-2 items-center">
        <h1 className="ml-7 text-6xl font-extrabold text-teal-950">Brazilian core</h1>
        <div className="flex justify-end px-4">
          <Link href="/home" className="text-amber-200 bg-teal-950 py-2 px-4 rounded-lg">
            Voltar
          </Link>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-teal-950 mb-6">Meus Pedidos</h2>

        {loading && <p className="text-teal-800">Carregando pedidos...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && orders.length === 0 && (
          <p className="text-2xl font-bold text-teal-950 text-center mt-10">
            Você ainda não fez nenhum pedido.
          </p>
        )}

        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white rounded-xl shadow-md border border-teal-200 p-5"
            >
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <p className="text-sm text-teal-600 font-mono">
                    #{order.order_id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-teal-800 text-sm mt-1">
                    {new Date(order.order_purchase_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-900">
                    R$ {Number(order.total_value).toFixed(2)}
                  </p>
                  <p className="text-sm text-teal-700">
                    {order.total_products} produto(s) · {order.total_items} item(s)
                  </p>
                  {order.coupon_id && (
                    <span className="text-xs bg-emerald-100 text-emerald-800 rounded-full px-2 py-0.5 font-semibold">
                      Cupom aplicado
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => openDetail(order.order_id)}
                className="mt-4 text-sm text-teal-700 underline hover:text-teal-950 transition"
              >
                Ver detalhes
              </button>

              {detailLoading && selectedOrder === null && (
                <p className="text-sm text-teal-600 mt-2">Carregando...</p>
              )}

              {selectedOrder?.order_id === order.order_id && (
                <div className="mt-4 border-t border-teal-100 pt-4">
                  <h3 className="font-semibold text-teal-950 mb-3">Produtos</h3>
                  <div className="flex flex-col gap-3">
                    {selectedOrder.products_register.map((p) => (
                      <div key={p.id} className="flex items-center gap-4">
                        <img
                          src={p.url_img}
                          alt={p.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-teal-950">{p.name}</p>
                          <p className="text-sm text-teal-700">
                            Qtd: {p.quantity} · R$ {Number(p.price).toFixed(2)} cada
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 font-bold text-emerald-900 text-right">
                    Total: R$ {Number(selectedOrder.purchase_value).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
