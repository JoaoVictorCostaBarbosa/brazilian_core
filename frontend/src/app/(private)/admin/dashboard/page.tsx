"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../user/context/userContext";
import AdminHeader from "../components/adminHeader";
import {
  getOverview,
  getTopProducts,
  getRevenueByPeriod,
  OverviewStats,
  TopProduct,
  RevenueDay,
} from "../../../../../api/stats";

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function thirtyDaysAgoISO() {
  const d = new Date();
  d.setDate(d.getDate() - 29);
  return d.toISOString().split("T")[0];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}

function StatCard({ label, value, sub, color = "teal" }: StatCardProps) {
  const ring = color === "red" ? "border-red-200" : color === "amber" ? "border-amber-200" : "border-teal-200";
  const text = color === "red" ? "text-red-700" : color === "amber" ? "text-amber-700" : "text-teal-950";
  return (
    <div className={`bg-white rounded-xl border ${ring} shadow-sm p-5 flex flex-col gap-1`}>
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{label}</span>
      <span className={`text-2xl font-extrabold ${text}`}>{value}</span>
      {sub && <span className="text-xs text-gray-400">{sub}</span>}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { getUser } = useUser();
  const router = useRouter();

  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [revenue, setRevenue] = useState<RevenueDay[]>([]);
  const [startDate, setStartDate] = useState(thirtyDaysAgoISO());
  const [endDate, setEndDate] = useState(todayISO());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const user = await getUser();
      if (!user || user.role !== "admin") {
        router.push("/home");
        return;
      }
      await fetchAll();
    }
    init();
  }, []);

  async function fetchAll() {
    setLoading(true);
    setError(null);
    try {
      const [overviewRes, topRes, revenueRes] = await Promise.all([
        getOverview(),
        getTopProducts(5),
        getRevenueByPeriod(startDate, endDate),
      ]);

      if (overviewRes.status === 200) setOverview(overviewRes.data as OverviewStats);
      if (topRes.status === 200) setTopProducts(topRes.data as TopProduct[]);
      if (revenueRes.status === 200) setRevenue(revenueRes.data as RevenueDay[]);
    } catch {
      setError("Erro ao carregar estatísticas");
    } finally {
      setLoading(false);
    }
  }

  async function handlePeriodChange() {
    setLoading(true);
    setError(null);
    try {
      const res = await getRevenueByPeriod(startDate, endDate);
      if (res.status === 200) setRevenue(res.data as RevenueDay[]);
      else setError("Erro ao buscar receita por período");
    } catch {
      setError("Erro ao buscar receita por período");
    } finally {
      setLoading(false);
    }
  }

  const maxRevenue = revenue.length > 0 ? Math.max(...revenue.map((r) => r.revenue)) : 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="p-8 max-w-6xl mx-auto flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-teal-950">Dashboard</h2>
          {loading && (
            <span className="text-sm text-teal-600 font-semibold animate-pulse">Carregando...</span>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm font-semibold">
            {error}
          </div>
        )}

        {/* Overview Cards */}
        {overview && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard
              label="Pedidos realizados"
              value={overview.total_orders.toString()}
            />
            <StatCard
              label="Receita total"
              value={formatCurrency(overview.total_revenue)}
            />
            <StatCard
              label="Ticket médio"
              value={formatCurrency(overview.avg_ticket)}
            />
            <StatCard
              label="Usuários cadastrados"
              value={overview.total_users.toString()}
            />
            <StatCard
              label="Produtos sem estoque"
              value={overview.out_of_stock.toString()}
              color={overview.out_of_stock > 0 ? "red" : "teal"}
              sub="stock = 0"
            />
            <StatCard
              label="Estoque crítico"
              value={overview.low_stock.toString()}
              color={overview.low_stock > 0 ? "amber" : "teal"}
              sub="1 a 5 unidades"
            />
          </div>
        )}

        {/* Revenue by period */}
        <div className="bg-white rounded-xl border border-teal-200 shadow-sm p-6 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <h3 className="text-lg font-bold text-teal-950">Receita por período</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="outline-none rounded-lg border border-teal-200 px-3 py-1.5 text-sm text-teal-950 focus:ring-2 focus:ring-teal-700"
              />
              <span className="text-sm text-gray-400">até</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="outline-none rounded-lg border border-teal-200 px-3 py-1.5 text-sm text-teal-950 focus:ring-2 focus:ring-teal-700"
              />
              <button
                onClick={handlePeriodChange}
                disabled={loading}
                className="bg-teal-950 text-amber-200 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-teal-800 transition disabled:opacity-60"
              >
                Filtrar
              </button>
            </div>
          </div>

          {revenue.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">
              Nenhum pedido no período selecionado.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {revenue.map((day) => (
                <div key={day.day} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-24 shrink-0">
                    {new Date(day.day + "T00:00:00").toLocaleDateString("pt-BR")}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                    <div
                      className="h-5 bg-teal-700 rounded-full transition-all"
                      style={{ width: `${(day.revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-teal-950 w-28 text-right shrink-0">
                    {formatCurrency(day.revenue)}
                  </span>
                  <span className="text-xs text-gray-400 w-20 text-right shrink-0">
                    {day.orders_count} pedido{day.orders_count !== 1 ? "s" : ""}
                  </span>
                </div>
              ))}
            </div>
          )}

          {revenue.length > 0 && (
            <div className="flex justify-end pt-2 border-t border-gray-100">
              <span className="text-sm font-bold text-teal-950">
                Total:{" "}
                {formatCurrency(revenue.reduce((acc, d) => acc + d.revenue, 0))}
              </span>
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-teal-200 shadow-sm p-6 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-teal-950">Top 5 produtos mais vendidos</h3>

          {topProducts.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">
              Nenhuma venda registrada ainda.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {topProducts.map((product, index) => (
                <div
                  key={product.product_id}
                  className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-teal-200 transition"
                >
                  <span className="text-lg font-extrabold text-teal-200 w-6 text-center shrink-0">
                    {index + 1}
                  </span>
                  <img
                    src={product.product_url_img}
                    alt={product.product_name}
                    className="w-14 h-14 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-teal-950 truncate">{product.product_name}</p>
                    <p className="text-xs text-gray-400">{product.total_sold} unidades vendidas</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-emerald-700 text-sm">
                      {formatCurrency(product.total_revenue)}
                    </p>
                    <p className="text-xs text-gray-400">em receita</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
