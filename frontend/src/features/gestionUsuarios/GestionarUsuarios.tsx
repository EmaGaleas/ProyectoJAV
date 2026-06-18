import { useState, useMemo, useEffect } from "react";
import UserCard from "./userCard";
import { UserFilters, DEFAULT_FILTERS } from "./UserFilters";
import type { Filters } from "./UserFilters";
import { useIsTablet } from "../historial/ingresos/useBreakpoint";
import CreateUserForm from "../create_user_form";
import { useAuthStore } from "../auth/store/authStore";
import { api } from "../../services/api";

const CARDS_PER_PAGE = 4;
export type UserRole = "Presidente" | "MiembroJav";
export type UserStatus = "Activo" | "Inactivo";
export interface User {
  idUsuario: number;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  dni: string;
  rol: string;
  estado: boolean;
}

export default function GestionarUsuarios() {
  const isTablet = useIsTablet();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [activeFilters, setActiveFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { user, token } = useAuthStore();
  const isSuperAdmin = ["SuperAdministrador", "Secretario"].includes(
    user?.rol ?? "",
  );
  console.log(user);
  console.log(token);

  const filtered = useMemo(
    () =>
      users.filter((user) => {
        const nombre = [
          user.primerNombre,
          user.segundoNombre,
          user.primerApellido,
          user.segundoApellido,
        ]
          .filter(Boolean)
          .join(" ");
        const estado = user.estado ? "Activo" : "Inactivo";
        const rol = user.rol === "DuenoDeCasa" ? "Dueño de Casa" : user.rol;
        const q = search.toLowerCase();
        const matchSearch =
          !search ||
          nombre.toLowerCase().includes(q) ||
          user.dni.toLowerCase().includes(q);
        const matchRole = !activeFilters.role || rol === activeFilters.role;
        const matchStatus =
          !activeFilters.status || estado === activeFilters.status;

        return matchSearch && matchRole && matchStatus;
      }),
    [search, activeFilters, users],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / CARDS_PER_PAGE));

  // Reset to page 1 when filtered results change
  useEffect(() => {
    setCurrentPage(1);
  }, [filtered.length]);

  const paginatedUsers = filtered.slice(
    (currentPage - 1) * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE,
  );

  const [showCreateUser, setShowCreateUser] = useState(false);

  const handleApply = () => {
    setActiveFilters(filters);
    setFiltersOpen(false);
  };
  const handleCrearUsuario = (newUser: User) => {
    setUsers((prev) => [...prev, newUser]);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get<User[]>("api/Usuarios");

        console.log(data);
        setUsers(data);
        console.log(users);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    console.log("users actualizados:", users);
  }, [users]);

  return (
    <div className="flex gap-5 items-stretch">
      {/* Contenido principal: barra de búsqueda + cards */}
      <div className="flex flex-col gap-4 flex-1 min-w-0">
        {/* Barra de búsqueda */}
        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o DNI..."
            className="flex-1 h-10 px-4 text-sm rounded-xl border border-[rgba(0,0,0,0.12)] bg-white focus:outline-none focus:ring-2 focus:ring-[#308C58] focus:ring-opacity-30"
          />
          <button
            className="flex items-center justify-center rounded-xl shrink-0 text-white"
            style={{ width: 160, height: 40, background: "#308C58" }}
            onClick={() => setShowCreateUser(true)}
          >
            Crear Usuario +
          </button>
          {isTablet && (
            <button
              onClick={() => setFiltersOpen((p) => !p)}
              className="flex items-center gap-2 px-3 rounded-xl shrink-0 border transition-colors"
              style={{
                height: 40,
                borderColor: filtersOpen ? "#308C58" : "rgba(0,0,0,0.12)",
                background: filtersOpen ? "#F0FAF4" : "#fff",
                fontSize: 13,
                fontWeight: 600,
                color: filtersOpen ? "#308C58" : "#555",
              }}
            >
              <div
                style={{
                  width: 13,
                  height: 13,
                  background: filtersOpen ? "#308C58" : "#8EBFA3",
                  borderRadius: 3,
                }}
              />
              Filtros
            </button>
          )}
        </div>

        {/* Cards de usuarios */}
        <div className="flex flex-col gap-4">
          {paginatedUsers.map((user) => (
            <UserCard key={user.idUsuario} user={user} />
          ))}
          {filtered.length === 0 && (
            <div
              className="text-center py-10 text-sm"
              style={{ color: "#8EBFA3" }}
            >
              No se encontraron usuarios
            </div>
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center justify-center rounded-lg border transition-colors"
              style={{
                width: 36,
                height: 36,
                borderColor: currentPage === 1 ? "rgba(0,0,0,0.08)" : "#308C58",
                color: currentPage === 1 ? "#ccc" : "#308C58",
                background: currentPage === 1 ? "#fafafa" : "#F0FAF4",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className="flex items-center justify-center rounded-lg transition-colors"
                style={{
                  width: 36,
                  height: 36,
                  fontWeight: 600,
                  fontSize: 14,
                  border:
                    page === currentPage
                      ? "2px solid #308C58"
                      : "1px solid rgba(0,0,0,0.08)",
                  background: page === currentPage ? "#308C58" : "#fff",
                  color: page === currentPage ? "#fff" : "#555",
                  cursor: "pointer",
                }}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center rounded-lg border transition-colors"
              style={{
                width: 36,
                height: 36,
                borderColor:
                  currentPage === totalPages ? "rgba(0,0,0,0.08)" : "#308C58",
                color: currentPage === totalPages ? "#ccc" : "#308C58",
                background: currentPage === totalPages ? "#fafafa" : "#F0FAF4",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              ›
            </button>
          </div>
        )}
      </div>

      {/* Panel de filtros */}
      {isTablet ? (
        <>
          {filtersOpen && (
            <div
              className="fixed inset-0 z-30"
              style={{ background: "rgba(0,0,0,0.25)" }}
              onClick={() => setFiltersOpen(false)}
            />
          )}
          <div
            className="fixed top-0 right-0 h-full z-40 p-4"
            style={{
              width: 270,
              transform: filtersOpen ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.25s ease",
              pointerEvents: filtersOpen ? "auto" : "none",
            }}
          >
            <UserFilters
              filters={filters}
              onChange={setFilters}
              onApply={handleApply}
            />
          </div>
        </>
      ) : (
        <UserFilters
          filters={filters}
          onChange={setFilters}
          onApply={handleApply}
        />
      )}
      {showCreateUser && (
        <CreateUserForm
          onClose={() => setShowCreateUser(false)}
          isSuperAdmin={isSuperAdmin}
          onUserCreated={handleCrearUsuario}
        />
      )}
    </div>
  );
}