export interface CreateUserFormData {
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  dni: string;
  correo: string;
  telefono: string;
  contrasena: string;
  domicilios: {
    calle: string;
    codigoBloque: string;
    loteCasa: string;
    estructura: string;
  };
  tipoVivienda: string;
  casaHabilitada: boolean;
  cantidadApartamentos: string;
  apartamentosHabitados: string;
  rol: string;
  idUsuario: number;
  estado?: boolean;
}

export const INITIAL_FORM_DATA: CreateUserFormData = {
  primerNombre: "",
  segundoNombre: "",
  primerApellido: "",
  segundoApellido: "",
  dni: "",
  correo: "",
  telefono: "",
  contrasena: "",
  domicilios: {
    calle: "",
    codigoBloque: "",
    loteCasa: "",
    estructura: "",
  },
  tipoVivienda: "Casa",
  casaHabilitada: true,
  cantidadApartamentos: "",
  apartamentosHabitados: "",
  rol: "DuenoDeCasa",
  idUsuario: -1,
  estado: true,
};

export const CALLES = [
  { value: "Calle1A", calle: "Calle1A", label: "Calle 1A" },
  { value: "Calle1B", calle: "Calle1B", label: "Calle 1B" },
  { value: "Calle2A", calle: "Calle2A", label: "Calle 2A" },
  { value: "Calle2B", calle: "Calle2B", label: "Calle 2B" },
  { value: "Calle3A", calle: "Calle3A", label: "Calle 3A" },
  { value: "Calle3B", calle: "Calle3B", label: "Calle 3B" },
  { value: "Calle4A", calle: "Calle4A", label: "Calle 4A" },
];

export const BLOQUES = [
  { value: "FGAD", label: "FGAD" },
  { value: "A", codigoBloque: "A", label: "Bloque A" },
  { value: "B", codigoBloque: "B", label: "Bloque B" },
  { value: "C", codigoBloque: "C", label: "Bloque C" },
  { value: "D", codigoBloque: "D", label: "Bloque D" },
  { value: "E", codigoBloque: "E", label: "Bloque E" },
  { value: "F", codigoBloque: "F", label: "Bloque F" },
  { value: "G", codigoBloque: "G", label: "Bloque G" },
  { value: "H", codigoBloque: "H", label: "Bloque H" },
  { value: "I", codigoBloque: "I", label: "Bloque I" },
  { value: "J", codigoBloque: "J", label: "Bloque J" },
];

export const INPUT_CLS =
  "h-[45.6px] w-full px-[16px] py-[10px] rounded-[10px] border-[#d1d5dc] border-[0.8px] font-['Arimo',sans-serif] text-[16px] text-[#514f4f] placeholder:text-[#abafb1] bg-white focus:outline-none focus:ring-2 focus:ring-[#308c58]/20 focus:border-[#308c58]";

export const LABEL_CLS =
  "font-['Arimo',sans-serif] font-normal text-[#364153] text-[16px]";

export const SECTION_TITLE_CLS =
  "font-['Montserrat',sans-serif] font-normal text-[#364153] text-[18px] mb-4";

export const SELECT_CLS =
  "h-[45.6px] w-full px-[16px] py-[10px] rounded-[10px] border-[#d1d5dc] border-[0.8px] font-['Arimo',sans-serif] text-[16px] text-[#514f4f] appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#308c58]/20 focus:border-[#308c58]";
