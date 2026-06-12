export type UserRole   = 'Admin' | 'Residente' | 'Vigilante'
export type UserStatus = 'Activo' | 'Inactivo'

export interface User {
  id: string
  name: string
  dni: string
  role: UserRole
  status: UserStatus
}

export const MOCK_USERS: User[] = [
  { id: '1',  name: 'Sandro Fernandez',  dni: '1804-2004-02712', role: 'Admin',      status: 'Activo' },
  { id: '2',  name: 'Ema Castellanos',   dni: '0501-1990-67890', role: 'Residente',  status: 'Activo' },
  { id: '3',  name: 'Lorenzo Flores',    dni: '0101-1978-11223', role: 'Residente',  status: 'Inactivo' },
  { id: '4',  name: 'Jose Abraham',      dni: '0301-1982-44556', role: 'Vigilante',  status: 'Activo' },
  { id: '5',  name: 'Ana Torres',        dni: '0701-1995-77889', role: 'Residente',  status: 'Activo' },
  { id: '6',  name: 'María López',       dni: '0201-1988-33445', role: 'Residente',  status: 'Activo' },
  { id: '7',  name: 'Carlos Mendoza',    dni: '0601-1975-99001', role: 'Vigilante',  status: 'Inactivo' },
  { id: '8',  name: 'Pedro Castillo',    dni: '0401-1980-22334', role: 'Residente',  status: 'Activo' },
  { id: '9',  name: 'Lucía Herrera',     dni: '0901-1993-55667', role: 'Admin',      status: 'Activo' },
  { id: '10', name: 'Roberto Díaz',      dni: '1501-1970-88990', role: 'Residente',  status: 'Inactivo' },
  { id: '11', name: 'Gabriela Ramos',    dni: '0801-1991-66778', role: 'Residente',  status: 'Activo' },
  { id: '12', name: 'Fernando Aguilar',  dni: '1001-1983-44321', role: 'Vigilante',  status: 'Activo' },
]

export const fmtDate = (d: string) => { const [y, m, day] = d.split('-'); return `${day}/${m}/${y}` }
