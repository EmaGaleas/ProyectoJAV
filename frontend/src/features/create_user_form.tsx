import { useState } from "react";
import { X } from "lucide-react";
import { apiFetch } from "../services/apiClient";
import { useAuthStore } from "./auth/store/authStore";

interface CreateUserFormProps {
  onClose?: () => void;
  isSuperAdmin?: boolean;
}

export default function Create_user_form({
  onClose,
  isSuperAdmin = false,
}: CreateUserFormProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    identificacion: "",
    telefono: "",
    email: "",
    rol: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [apartamentos, setApartamentos] = useState("0");
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuthStore();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const [primerNombre, ...restNombres] = formData.nombre.trim().split(" ");
      const [primerApellido, ...restApellidos] = formData.apellido
        .trim()
        .split(" ");

      const payload = {
        PrimerNombre: primerNombre || "",
        SegundoNombre: restNombres.join(" ") || null,
        PrimerApellido: primerApellido || "",
        SegundoApellido: restApellidos.join(" ") || null,
        Dni: formData.identificacion,
        Correo: formData.email,
        Telefono: formData.telefono,
        Password: formData.identificacion, // Usa DNI como contraseña por defecto
        Rol: formData.rol ? parseInt(formData.rol) : 0,
        IdTipoUsuario: 1, // Por defecto 1
      };

      await apiFetch(
        "/api/usuarios",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
        token || undefined,
      );

      alert("Usuario creado exitosamente");
      if (onClose) onClose();
    } catch (err: any) {
      console.error("Error al crear usuario:", err);
      setError(err.message || "Ocurrió un error al crear el usuario.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed backdrop-blur-sm inset-0 z-40 bg-black/20"
        onClick={onClose}
      />

      {/* Side Panel */}
      <div className="fixed right-0 top-0 h-full w-full md:w-150 bg-white shadow-2xl z-50 overflow-y-auto gap-6">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 w-full flex z-50 px-4">
          <div className="w-full h-14 flex items-center justify-between max-w-125">
            <h2 className="text-gray-600 text-2xl font-light font-['Montserrat',sans-serif] max-w-125 pl-2">
              Crear Usuario
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto text-gray-500 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X size={40} className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="flex justify-center w-full h-11/12">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 px-6 py-6 w-full max-w-125 h-full"
          >
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="flex flex-col gap-2 items-start">
                <label className="font-['Arimo',sans-serif] font-normal leading-[20px] text-[#364153] text-[16px]">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ingrese el nombre"
                  className="h-[45.6px] w-full px-[16px] py-[10px] rounded-[10px] border-[#d1d5dc] border-[0.8px] border-solid font-['Arimo',sans-serif] font-normal text-[16px] text-[#514f4f] placeholder:text-[#514f4f] bg-white focus:outline-none focus:ring-2 focus:ring-[#308c58]/20 focus:border-[#308c58]"
                />
              </div>

              {/* Apellido */}
              <div className="flex flex-col gap-2 items-start">
                <label className="font-['Arimo',sans-serif] font-normal leading-[20px] text-[#364153] text-[16px]">
                  Apellido
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  placeholder="Ingrese el apellido"
                  className="h-[45.6px] w-full px-[16px] py-[10px] rounded-[10px] border-[#d1d5dc] border-[0.8px] border-solid font-['Arimo',sans-serif] font-normal text-[16px] text-[#514f4f] placeholder:text-[#514f4f] bg-white focus:outline-none focus:ring-2 focus:ring-[#308c58]/20 focus:border-[#308c58]"
                />
              </div>
            </div>

            {/* Identificación y Rol */}
            <div className="grid grid-cols-2 gap-4">
              {/* Identificación */}
              <div className="flex flex-col gap-2 items-start">
                <label className="font-['Arimo',sans-serif] font-normal leading-[20px] text-[#364153] text-[16px]">
                  Identificación (DNI/ID)
                </label>
                <input
                  type="text"
                  name="identificacion"
                  value={formData.identificacion}
                  onChange={handleInputChange}
                  placeholder="Ingrese el número de identificación"
                  className="h-[45px] w-full px-[16px] py-[10px] rounded-[10px] border-[#d1d5dc] border-[0.8px] border-solid font-['Arimo',sans-serif] font-normal text-[16px] text-[#514f4f] placeholder:text-[#514f4f] bg-white focus:outline-none focus:ring-2 focus:ring-[#308c58]/20 focus:border-[#308c58]"
                />
              </div>

              {/* Correo */}

              <div className="flex flex-col gap-2 items-start">
                <label className="font-['Arimo',sans-serif] font-normal leading-[20px] text-[#364153] text-[16px]">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="cliente@email.com"
                  className="h-[45.6px] w-full px-[16px] py-[10px] rounded-[10px] border-[#d1d5dc] border-[0.8px] border-solid font-['Arimo',sans-serif] font-normal text-[16px] text-[#514f4f] placeholder:text-[#514f4f] bg-white focus:outline-none focus:ring-2 focus:ring-[#308c58]/20 focus:border-[#308c58]"
                />
              </div>
            </div>

            {/* Teléfono y Rol */}
            <div className="grid grid-cols-2 gap-4">
              {/* Teléfono */}
              <div className="flex flex-col gap-2 items-start">
                <label className="font-['Arimo',sans-serif] font-normal leading-[20px] text-[#364153] text-[16px]">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="+1 555-0000"
                  className="h-[45.6px] w-full px-[16px] py-[10px] rounded-[10px] border-[#d1d5dc] border-[0.8px] border-solid font-['Arimo',sans-serif] font-normal text-[16px] text-[#514f4f] placeholder:text-[#514f4f] bg-white focus:outline-none focus:ring-2 focus:ring-[#308c58]/20 focus:border-[#308c58]"
                />
              </div>

              {
                /* Rol*/
                isSuperAdmin && (
                  <>
                    <div className="flex flex-col gap-2 items-start">
                      <label className="font-['Arimo',sans-serif] font-normal leading-[20px] text-[#364153] text-[16px]">
                        Rol:
                      </label>
                      <div className="relative w-full">
                        <select
                          name="rol"
                          value={formData.rol}
                          onChange={handleInputChange}
                          className="h-[45.6px] w-full px-[15.2px] py-[10px] rounded-[10px] border-[#d1d5dc] border-[0.8px] border-solid font-['Arimo',sans-serif] font-normal text-[16px] text-[#514f4f] appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#308c58]/20 focus:border-[#308c58]"
                        >
                          <option value="">Seleccione el rol</option>
                          <option value="0">Dueño de Casa</option>
                          <option value="1">Tesorero</option>
                          <option value="2">Secretario</option>
                          <option value="3">Vocal</option>
                          <option value="4">Vicepresidente</option>
                          <option value="5">Presidente</option>
                          <option value="6">Fiscal</option>
                        </select>
                        <div className="absolute right-[15.2px] top-1/2 -translate-y-1/2 pointer-events-none rotate-90"></div>
                      </div>
                    </div>
                  </>
                )
              }
            </div>
            {isSuperAdmin && (
              <>
                <div className="flex flex-col gap-2 items-start">
                  <label className="font-['Arimo',sans-serif] font-normal leading-[20px] text-[#364153] text-[16px]">
                    Tipo de Usuario:
                  </label>
                  <div className="relative w-full">
                    <select
                      name="rol"
                      value={formData.rol}
                      onChange={handleInputChange}
                      className="h-[45.6px] w-full px-[15.2px] py-[10px] rounded-[10px] border-[#d1d5dc] border-[0.8px] border-solid font-['Arimo',sans-serif] font-normal text-[16px] text-[#514f4f] appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#308c58]/20 focus:border-[#308c58]"
                    >
                      <option value="">Seleccione el Tipo de Usuario</option>
                      <option value="0">Dueño de Casa</option>
                      <option value="1">Tesorero</option>
                      <option value="2">Secretario</option>
                      <option value="3">Vocal</option>
                      <option value="4">Vicepresidente</option>
                      <option value="5">Presidente</option>
                      <option value="6">Fiscal</option>
                    </select>
                    <div className="absolute right-[15.2px] top-1/2 -translate-y-1/2 pointer-events-none rotate-90"></div>
                  </div>
                </div>
              </>
            )}
            {
              !isSuperAdmin && (
                <>
                  <label className="font-['Arimo',sans-serif] font-normal leading-[20px] text-[#364153] text-[20px]">
                    Direccion
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {/* No. de Bloque */}
                    <div className="flex flex-col gap-2 items-start">
                      <label className="font-['Arimo',sans-serif] font-normal leading-[20px] text-[#364153] text-[16px]">
                        No. de Bloque
                      </label>
                      <input
                        type="text"
                        name="identificacion"
                        value={formData.identificacion}
                        onChange={handleInputChange}
                        placeholder=""
                        className="h-[45px] w-full px-[16px] py-[10px] rounded-[10px] border-[#d1d5dc] border-[0.8px] border-solid font-['Arimo',sans-serif] font-normal text-[16px] text-[#514f4f] placeholder:text-[#514f4f] bg-white focus:outline-none focus:ring-2 focus:ring-[#308c58]/20 focus:border-[#308c58]"
                      />
                    </div>

                    {/* Lote */}
                    <div className="flex flex-col gap-2 items-start">
                      <label className="font-['Arimo',sans-serif] font-normal leading-[20px] text-[#364153] text-[16px]">
                        Lote
                      </label>
                      <input
                        type="text"
                        name="lote"
                        value={formData.identificacion}
                        onChange={handleInputChange}
                        placeholder=""
                        className="h-[45px] w-full px-[16px] py-[10px] rounded-[10px] border-[#d1d5dc] border-[0.8px] border-solid font-['Arimo',sans-serif] font-normal text-[16px] text-[#514f4f] placeholder:text-[#514f4f] bg-white focus:outline-none focus:ring-2 focus:ring-[#308c58]/20 focus:border-[#308c58]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Calle */}
                    <div className="flex flex-col gap-2 items-start">
                      <label className="font-['Arimo',sans-serif] font-normal leading-[20px] text-[#364153] text-[16px]">
                        Calle
                      </label>
                      <input
                        type="text"
                        name="calle"
                        value={formData.identificacion}
                        onChange={handleInputChange}
                        placeholder=""
                        className="h-[45px] w-full px-[16px] py-[10px] rounded-[10px] border-[#d1d5dc] border-[0.8px] border-solid font-['Arimo',sans-serif] font-normal text-[16px] text-[#514f4f] placeholder:text-[#514f4f] bg-white focus:outline-none focus:ring-2 focus:ring-[#308c58]/20 focus:border-[#308c58]"
                      />
                    </div>
                    {/* Apartamentos */}
                    <div className="flex flex-col gap-2 items-start">
                      <label className="font-['Arimo',sans-serif] font-normal leading-[20px] text-[#364153] text-[16px]">
                        Apartamentos
                      </label>
                      <input
                        type="number"
                        name="apartamentos"
                        min="0"
                        value={apartamentos}
                        onChange={(e) => setApartamentos(e.target.value)}
                        placeholder="Numero de apartamentos"
                        step="1"
                        className="h-[45px] w-full px-[16px] py-[10px] rounded-[10px] border-[#d1d5dc] border-[0.8px] border-solid font-['Arimo',sans-serif] font-normal text-[16px] text-[#514f4f] placeholder:text-[#514f4f] bg-white focus:outline-none focus:ring-2 focus:ring-[#308c58]/20 focus:border-[#308c58]"
                      />
                    </div>
                  </div>
                </>
              )
              //Direccion si es dueño de casa
            }

            {/* Propiedades Section */}

            {/* Error Display */}
            {error && (
              <div className="text-red-500 text-sm mt-2 text-center font-['Arimo',sans-serif]">
                {error}
              </div>
            )}

            {/* Botón Submit */}
            <div className="pt-4 mt-auto">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[48px] bg-[#308c58] drop-shadow-[0px_4px_2px_rgba(0,0,0,0.25)] rounded-[10px] font-['Arimo',sans-serif] font-normal text-[20px] text-center text-white hover:bg-[#267045] transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creando..." : "Crear Usuario"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
