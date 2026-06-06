import { X } from "lucide-react";
import { useCreateUserForm } from "./createUser/useCreateUserForm";
import { SeccionPersonal } from "./createUser/SeccionPersonal";
import { SeccionContacto } from "./createUser/SeccionContacto";
import { SeccionDireccion } from "./createUser/SeccionDireccion";
import { SeccionRol } from "./createUser/SeccionRol";

interface CreateUserFormProps {
  onClose?: () => void;
  isSuperAdmin?: boolean;
}

export default function CreateUserForm({
  onClose,
  isSuperAdmin = false,
}: CreateUserFormProps) {
  const {
    formData,
    isLoading,
    error,
    handleInputChange,
    handleCelularChange,
    setField,
    resetVivienda,
    handleSubmit,
  } = useCreateUserForm(isSuperAdmin, onClose);

  const showAddress = !isSuperAdmin || formData.rol === "0";

  return (
    <>
      <div
        className="fixed backdrop-blur-sm inset-0 z-40 bg-black/20"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-full md:w-150 bg-white shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 w-full flex z-50 px-4">
          <div className="w-full h-14 flex items-center max-w-125">
            <h2 className="text-gray-600 text-2xl font-light font-['Montserrat',sans-serif] pl-2">
              Crear Usuario
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto text-gray-500 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer p-2"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="flex justify-center w-full">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 px-6 py-6 w-full max-w-125"
          >
            <SeccionPersonal formData={formData} onChange={handleInputChange} />

            <SeccionContacto
              formData={formData}
              onChange={handleInputChange}
              onCelularChange={handleCelularChange}
            />

            {showAddress && (
              <SeccionDireccion
                formData={formData}
                onChange={handleInputChange}
                onTipoViviendaChange={resetVivienda}
                onCasaHabilitadaChange={(v) => setField("casaHabilitada", v)}
              />
            )}

            {isSuperAdmin && (
              <SeccionRol formData={formData} onChange={handleInputChange} />
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm font-['Arimo',sans-serif]">{error}</p>
              </div>
            )}

            <div className="sticky bottom-0 bg-white pb-4 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[48px] bg-[#308c58] drop-shadow-[0px_4px_2px_rgba(0,0,0,0.25)] rounded-[10px] font-['Arimo',sans-serif] font-normal text-[20px] text-white hover:bg-[#267045] transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creando Usuario..." : "Crear Usuario"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
