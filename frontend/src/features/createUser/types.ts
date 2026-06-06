export interface CreateUserFormData {
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  identificacion: string;
  correo: string;
  celular: string;
  contrasena: string;
  calle: string;
  bloque: string;
  numerolote: string;
  tipoVivienda: string;
  casaHabilitada: boolean;
  cantidadApartamentos: string;
  apartamentosHabitados: string;
  rol: string;
}

export const INITIAL_FORM_DATA: CreateUserFormData = {
  primerNombre: "",
  segundoNombre: "",
  primerApellido: "",
  segundoApellido: "",
  identificacion: "",
  correo: "",
  celular: "",
  contrasena: "",
  calle: "",
  bloque: "",
  numerolote: "",
  tipoVivienda: "Casa",
  casaHabilitada: true,
  cantidadApartamentos: "",
  apartamentosHabitados: "",
  rol: "0",
};

export const CALLES = [
  "Calle 1", "Calle 2", "Calle 3", "Calle 4",
  "Calle 5", "Calle 6", "Calle 7", "Calle 8",
];

export const BLOQUES = [
  "Bloque A", "Bloque B", "Bloque C",
  "Bloque D", "Bloque E", "Bloque F",
];

export const INPUT_CLS =
  "h-[45.6px] w-full px-[16px] py-[10px] rounded-[10px] border-[#d1d5dc] border-[0.8px] font-['Arimo',sans-serif] text-[16px] text-[#514f4f] placeholder:text-[#abafb1] bg-white focus:outline-none focus:ring-2 focus:ring-[#308c58]/20 focus:border-[#308c58]";

export const LABEL_CLS =
  "font-['Arimo',sans-serif] font-normal text-[#364153] text-[16px]";

export const SECTION_TITLE_CLS =
  "font-['Montserrat',sans-serif] font-normal text-[#364153] text-[18px] mb-4";

export const SELECT_CLS =
  "h-[45.6px] w-full px-[16px] py-[10px] rounded-[10px] border-[#d1d5dc] border-[0.8px] font-['Arimo',sans-serif] text-[16px] text-[#514f4f] appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#308c58]/20 focus:border-[#308c58]";
