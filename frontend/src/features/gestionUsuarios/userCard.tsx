import type { User } from "./GestionarUsuarios";

interface Props {
  user: User;
}

export default function UserCard({ user }: Props) {
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

  return (
    <div className="flex flex-row bg-white justify-between h-28 shadow-md rounded-2xl p-4">
      {/**Nombre y dni */}
      <div className="flex flex-col gap-1">
        <p>Nombre: {nombre}</p>
        <p>DNI: {user.dni}</p>
        <p>Rol: {user.rol === "DuenoDeCasa" ? "Dueño de Casa" : user.rol}</p>
      </div>
      {/**Badge Activo/Inactivo */}
      <div
        className={`flex rounded-3xl ${isActive ? "bg-[#308C58]" : "bg-[#8C3F40]"} h-1/2 w-1/6 items-center justify-center`}
      >
        <p className="text-white text-center">{estado.toUpperCase()}</p>
      </div>
    </div>
  );
}