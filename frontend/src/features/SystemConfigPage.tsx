import { MonitorCog } from "lucide-react";
import { useState } from "react";

export default function SystemConfigPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [monto, setMonto] = useState("200");
  const [fecha, setFecha] = useState("12/06/26");
  const handleSave = () => {
    setIsEditing(!isEditing);
    //Enviar a backend monto y fecha
  };

  {
    /*useEffect para fetch del backend*/
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full max-w-6xl">
      <div className="flex flex-col ">
        {/* Header */}
        <div className="flex items-center gap-3 p-2">
          <MonitorCog size={40} className="text-green-700" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Configuración de Parámetros del Sistema
            </h1>
            <p className="text-sm text-gray-500">
              Administra los parámetros generales utilizados por el sistema.
            </p>
          </div>
          {!isEditing && (
            <button
              className="
              bg-gray-700
              hover:bg-gray-800
              text-white
              px-6
              py-2
              rounded-md
              font-medium
              ml-auto
            "
              onClick={() => setIsEditing(!isEditing)}
            >
              Editar
            </button>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {/* Monto mensual */}
          <div className=" border-t-2 border-gray-200 p-5 ">
            <div className="mb-4">
              <h2 className="font-semibold text-gray-800">
                Monto de Cobros Mensuales
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Este es el monto que se cobrará en cada mensualidad a los
                propietarios.
              </p>
            </div>
            <div className="gap-4">
              <input
                type="number"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                min="0"
                step="100"
                placeholder="Ingrese el monto"
                className="
                w-full
                max-w-sm
                border
                rounded-md
                px-1
                py-2
                focus:outline-none
                focus:ring-2
                focus:ring-green-600
                
              "
                disabled={!isEditing}
              />{" "}
              <label className="text-lg">Lps</label>
            </div>
          </div>

          {/* Fecha de cobro */}
          <div className=" border-t-2 border-gray-200  p-5">
            <div className="mb-4">
              <h2 className="font-semibold text-gray-800">Fecha de Cobro</h2>

              <p className="text-sm text-gray-500 mt-1">
                Selecciona la fecha en la que se realizarán los cobros.
              </p>
            </div>
            <div className="flex flex-row">
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="
                border
                rounded-md
                px-3
                py-2
                focus:outline-none
                focus:ring-2
                focus:ring-green-600
                
              "
                disabled={!isEditing}
              />
              {isEditing && (
                <button
                  className="
              bg-green-700
              hover:bg-green-800
              text-white
              px-6
              py-2
              rounded-md
              font-medium
              ml-auto
              justify-end
            "
                  onClick={handleSave}
                >
                  Guardar Configuración
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Botón guardar */}
      </div>
    </div>
  );
}
