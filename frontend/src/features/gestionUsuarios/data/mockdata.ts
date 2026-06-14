export type UserRole = "Presidente" | "Residente" | "Vigilante";
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

export const MOCK_USERS: User[] = [];

export const fmtDate = (d: string) => {
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
};
