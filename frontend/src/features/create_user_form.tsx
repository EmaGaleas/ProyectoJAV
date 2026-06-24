import { X } from "lucide-react";
import { useCreateUserForm } from "./createUser/useCreateUserForm";
import { SeccionPersonal } from "./createUser/SeccionPersonal";
import { SeccionContacto } from "./createUser/SeccionContacto";
import { SeccionDireccion } from "./createUser/SeccionDireccion";
import { SeccionRol } from "./createUser/SeccionRol";
import { SeccionEstado } from "./createUser/SeccionEstado";
import type { User } from "./gestionUsuarios/GestionarUsuarios";
import type { CreateUserFormData } from "./createUser/types";

interface CreateUserFormProps {
  onClose?: () => void;
  isSuperAdmin?: boolean;
  data?: CreateUserFormData;
  onEdit?: () => void;
  mode: "create" | "edit" | "view";
  onUserCreated: (user: User) => void;
  users: User[];
}

export default function CreateUserForm({
  onClose,
  isSuperAdmin = false,
  data,
  mode,
  onUserCreated,
  onEdit,
  users,
}: CreateUserFormProps) {
  const {
    formData,
    isLoading,
    error,
    handleInputChange,
    handleCelularChange,
    handleDniChange,
    setField,
    resetVivienda,
    handleSubmit,
  } = useCreateUserForm(isSuperAdmin, onUserCreated, onClose, data, mode);

  const showAddress = !isSuperAdmin;
  console.log(mode);
  console.log(data);
  const title =
    mode === "create"
      ? "Crear Usuario"
      : mode === "edit"
        ? "Editar Usuario"
        : "Detalles de Usuario";

  const viewOnly = mode === "view";
  const hasPresidente = users.some(
    (user) => user.rol === "Presidente" && user.estado,
  );

  return (
    <>
      <div className="fixed backdrop-blur-xs inset-0 z-40 bg-black/20" />

      <div className="fixed right-0 top-0 h-full w-full md:w-150 bg-white shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 w-full flex z-50 px-4 py-1 space-x-2  ">
          <div className="w-full h-14 flex items-center max-w-125">
            <h2 className="text-gray-600 text-2xl font-light font-['Montserrat',sans-serif] pl-2">
              {title}
            </h2>
          </div>
          {mode === "view" && (
            <button
              type="button"
              onClick={onEdit}
              className="ml-auto text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors cursor-pointer p-3 h-2/3"
            >
              Editar
            </button>
          )}

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
            {isSuperAdmin ||
              (!hasPresidente && (
                <SeccionRol
                  formData={formData}
                  onChange={handleInputChange}
                  disable={viewOnly}
                  users={users}
                />
              ))}

            {mode !== "create" && (
              <SeccionEstado
                formData={formData}
                onEstadoChange={(val) => setField("estado", val)}
                disable={viewOnly}
              />
            )}

            <SeccionPersonal
              formData={formData}
              onChange={handleInputChange}
              onDniChange={handleDniChange}
              disable={viewOnly}
            />

            <SeccionContacto
              formData={formData}
              onChange={handleInputChange}
              onCelularChange={handleCelularChange}
              isEditing={mode === "create" ? false : true}
              disable={viewOnly}
            />

            {showAddress ||
              (formData.rol === "DuenoDeCasa" && (
                <SeccionDireccion
                  formData={formData}
                  onChange={handleInputChange}
                  onTipoViviendaChange={resetVivienda}
                  onCasaHabilitadaChange={(v) => setField("casaHabilitada", v)}
                  disable={viewOnly}
                />
              ))}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm font-['Arimo',sans-serif]">
                  {error}
                </p>
              </div>
            )}
            {mode !== "view" && (
              <div className="sticky bottom-0 bg-white pb-4 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[48px] bg-[#308c58] drop-shadow-[0px_4px_2px_rgba(0,0,0,0.25)] rounded-[10px] font-['Arimo',sans-serif] font-normal text-[20px] text-white hover:bg-[#267045] transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mode === "create" &&
                    (isLoading ? "Creando Usuario..." : "Crear Usuario")}
                  {mode === "edit" &&
                    (isLoading ? "Guardando Cambios..." : "Guardar Cambios")}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
