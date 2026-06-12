import type { User } from "./data/mockdata";

interface Props {
  user: User;
}

export default function UserCard({ user }: Props) {
  const isActive = user.status === "Activo";

  return (
    <div className="flex flex-row bg-white justify-between h-28 shadow-md rounded-2xl p-4">
      {/**Nombre y dni */}
      <div className="flex flex-col gap-1">
        <p>Nombre: {user.name}</p>
        <p>DNI: {user.dni}</p>
        <p>Rol: {user.role.toUpperCase()}</p>
      </div>
      {/**Badge Activo/Inactivo */}
      <div
        className={`flex rounded-3xl ${isActive ? "bg-[#308C58]" : "bg-[#8C3F40]"} h-1/2 w-1/6 items-center justify-center`}
      >
        <p className="text-white text-center">{user.status.toUpperCase()}</p>
      </div>
    </div>
  );
}
