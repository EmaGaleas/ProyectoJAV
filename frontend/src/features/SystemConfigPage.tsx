import { MonitorCog } from "lucide-react";

export default function SystemConfigPage() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full max-w-6xl">
      <div className="p-8 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8  pb-4">
          <MonitorCog size={28} className="text-green-700" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Configuración de Parámetros del Sistema
            </h1>
            <p className="text-sm text-gray-500">
              Administra los parámetros generales utilizados por el sistema.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Monto mensual */}
          <div className="border-t-2  border-gray-200  p-5 ">
            <div className="mb-4">
              <h2 className="font-semibold text-gray-800">
                Monto de Cobros Mensuales
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Este es el monto que se cobrará en cada mensualidad a los
                propietarios.
              </p>
            </div>

            <input
              type="number"
              min="0"
              step="100"
              placeholder="Ingrese el monto"
              className="
                w-full
                max-w-sm
                border
                rounded-md
                px-3
                py-2
                focus:outline-none
                focus:ring-2
                focus:ring-green-600
              "
            />
          </div>

          {/* Fecha de cobro */}
          <div className=" p-5 ">
            <div className="mb-4">
              <h2 className="font-semibold text-gray-800">Fecha de Cobro</h2>

              <p className="text-sm text-gray-500 mt-1">
                Selecciona la fecha en la que se realizarán los cobros.
              </p>
            </div>

            <input
              type="date"
              className="
                border
                rounded-md
                px-3
                py-2
                focus:outline-none
                focus:ring-2
                focus:ring-green-600
              "
            />
          </div>
        </div>

        {/* Botón guardar */}
        <div className="flex justify-end mt-8">
          <button
            className="
              bg-green-700
              hover:bg-green-800
              text-white
              px-6
              py-2
              rounded-md
              font-medium
            "
          >
            Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  );
}
