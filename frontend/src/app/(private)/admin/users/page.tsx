"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../user/context/userContext";
import AdminHeader from "../components/adminHeader";
import { listUsers, updateUserRole, AdminUser } from "../../../../../api/adminUsers";

const ROLE_LABEL: Record<string, string> = {
  admin: "Admin",
  user: "Usuário",
};

export default function AdminUsersPage() {
  const { getUser, currUser } = useUser();
  const router = useRouter();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const user = await getUser();
      if (!user || user.role !== "admin") {
        router.push("/home");
        return;
      }
      await fetchUsers();
    }
    init();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    setError(null);
    try {
      const res = await listUsers();
      if (res.status === 200) {
        setUsers(res.data as AdminUser[]);
      } else {
        setError("Erro ao carregar usuários");
      }
    } catch {
      setError("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleRole(user: AdminUser) {
    if (user.id === currUser?.id) return;
    const newRole = user.role === "admin" ? "user" : "admin";
    setUpdatingId(user.id);
    try {
      const res = await updateUserRole(user.id, newRole);
      if (res.status === 200) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
        );
        setFeedback(`Role de ${user.name} alterada para ${ROLE_LABEL[newRole]}.`);
        setTimeout(() => setFeedback(null), 3000);
      } else {
        setError("Erro ao alterar role");
      }
    } catch {
      setError("Erro ao alterar role");
    } finally {
      setUpdatingId(null);
    }
  }

  const admins = users.filter((u) => u.role === "admin");
  const regularUsers = users.filter((u) => u.role === "user");

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="p-8 max-w-4xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-teal-950">Gerenciar Usuários</h2>
          {loading && (
            <span className="text-sm text-teal-600 animate-pulse">Carregando...</span>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm font-semibold">
            {error}
          </div>
        )}

        {feedback && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-800 text-sm font-semibold">
            {feedback}
          </div>
        )}

        <div className="bg-white rounded-xl border border-teal-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-teal-950 text-amber-200 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-200 inline-block" />
            Administradores ({admins.length})
          </div>
          <UserTable
            users={admins}
            currentUserId={currUser?.id ?? ""}
            updatingId={updatingId}
            onToggleRole={handleToggleRole}
          />
        </div>

        <div className="bg-white rounded-xl border border-teal-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-gray-100 text-teal-950 text-xs font-bold uppercase tracking-widest">
            Usuários comuns ({regularUsers.length})
          </div>
          <UserTable
            users={regularUsers}
            currentUserId={currUser?.id ?? ""}
            updatingId={updatingId}
            onToggleRole={handleToggleRole}
          />
        </div>
      </div>
    </div>
  );
}

interface UserTableProps {
  users: AdminUser[];
  currentUserId: string;
  updatingId: string | null;
  onToggleRole: (user: AdminUser) => void;
}

function UserTable({ users, currentUserId, updatingId, onToggleRole }: UserTableProps) {
  if (users.length === 0) {
    return (
      <p className="text-sm text-gray-400 px-5 py-4">Nenhum usuário nesta categoria.</p>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {users.map((user) => {
        const isSelf = user.id === currentUserId;
        const isUpdating = updatingId === user.id;
        return (
          <div
            key={user.id}
            className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition"
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-teal-950 truncate">
                {user.name}
                {isSelf && (
                  <span className="ml-2 text-xs font-normal text-gray-400">(você)</span>
                )}
              </p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                user.role === "admin"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {ROLE_LABEL[user.role]}
            </span>
            <button
              onClick={() => onToggleRole(user)}
              disabled={isSelf || isUpdating}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${
                user.role === "admin"
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-amber-100 text-amber-800 hover:bg-amber-200"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {isUpdating
                ? "Salvando..."
                : user.role === "admin"
                ? "Remover admin"
                : "Tornar admin"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
