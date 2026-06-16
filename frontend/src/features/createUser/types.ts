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
  rol: "DuenoDeCasa",
};

export const CALLES = [
  { value: "Calle1A", label: "Calle 1A" },
  { value: "Calle1B", label: "Calle 1B" },
  { value: "Calle2A", label: "Calle 2A" },
  { value: "Calle2B", label: "Calle 2B" },
  { value: "Calle3A", label: "Calle 3A" },
  { value: "Calle3B", label: "Calle 3B" },
  { value: "Calle4A", label: "Calle 4A" },
];

export const BLOQUES = [
  { value: "FGAD", label: "FGAD" },
  { value: "A", label: "Bloque A" },
  { value: "B", label: "Bloque B" },
  { value: "C", label: "Bloque C" },
  { value: "D", label: "Bloque D" },
  { value: "E", label: "Bloque E" },
  { value: "F", label: "Bloque F" },
  { value: "G", label: "Bloque G" },
  { value: "H", label: "Bloque H" },
  { value: "I", label: "Bloque I" },
  { value: "J", label: "Bloque J" },
];

export const INPUT_CLS =
  "h-[45.6px] w-full px-[16px] py-[10px] rounded-[10px] border-[#d1d5dc] border-[0.8px] font-['Arimo',sans-serif] text-[16px] text-[#514f4f] placeholder:text-[#abafb1] bg-white focus:outline-none focus:ring-2 focus:ring-[#308c58]/20 focus:border-[#308c58]";

export const LABEL_CLS =
  "font-['Arimo',sans-serif] font-normal text-[#364153] text-[16px]";

export const SECTION_TITLE_CLS =
  "font-['Montserrat',sans-serif] font-normal text-[#364153] text-[18px] mb-4";

export const SELECT_CLS =
  "h-[45.6px] w-full px-[16px] py-[10px] rounded-[10px] border-[#d1d5dc] border-[0.8px] font-['Arimo',sans-serif] text-[16px] text-[#514f4f] appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#308c58]/20 focus:border-[#308c58]";
