import { useState } from "react";
import { toast } from "react-toastify";
import { api } from "../../services/api";
import type { User } from "./GestionarUsuarios";

interface Props {
  user: User;
  onClick?: () => void;
  onEstadoCambiado: (id: number, nuevoEstado: boolean) => void;
}

export default function UserCard({ user, onClick, onEstadoCambiado }: Props) {
  const [cargando, setCargando] = useState(false);
  const isActive = user.estado === true;
  const estado = isActive ? "Activo" : "Inactivo";
  const nombre = [
    user.primerNombre,
    user.segundoNombre,
    user.primerApellido,
    user.segundoApellido,
  ]
    .filter(Boolean)
    .join(" ");

  const handleToggleEstado = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setCargando(true);
    try {
      await api.patch(`api/Usuarios/${user.idUsuario}/estado`, !isActive);
      onEstadoCambiado(user.idUsuario, !isActive);
      toast.success(
        `Usuario ${!isActive ? "activado" : "desactivado"} correctamente.`
      );
    } catch {
      toast.error("No se pudo cambiar el estado del usuario.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div
      className="flex flex-row bg-white justify-between h-28 shadow-md rounded-2xl p-4"
      onClick={onClick}
    >
      {/**Nombre y dni */}
      <div className="flex flex-col gap-1">
        <p>Nombre: {nombre}</p>
        <p>DNI: {user.dni}</p>
        <p>Rol: {user.rol === "DuenoDeCasa" ? "Dueño de Casa" : user.rol}</p>
      </div>

      <div className="flex flex-col items-end gap-2 justify-center">
        {/**Badge Activo/Inactivo */}
        <div
          className={`flex rounded-3xl ${isActive ? "bg-[#308C58]" : "bg-[#8C3F40]"} h-8 w-24 items-center justify-center`}
        >
          <p className="text-white text-center text-sm">{estado.toUpperCase()}</p>
        </div>

        {/**Botón Activar/Desactivar */}
        <button
          onClick={handleToggleEstado}
          disabled={cargando}
          className={`text-xs px-3 py-1 rounded-lg text-white transition-colors disabled:opacity-50 ${
            isActive
              ? "bg-[#8C3F40] hover:bg-red-700"
              : "bg-[#308C58] hover:bg-green-700"
          }`}
        >
          {cargando ? "..." : isActive ? "Desactivar" : "Activar"}
        </button>
      </div>
    </div>
  );
}
