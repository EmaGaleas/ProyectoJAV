import type { CreateUserFormData } from "./types";
import { INPUT_CLS, LABEL_CLS, SECTION_TITLE_CLS } from "./types";

interface Props {
  formData: CreateUserFormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onDniChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disable?: boolean;
}

export function SeccionPersonal({
  formData,
  onChange,
  onDniChange,
  disable,
}: Props) {
  return (
    <div>
      <h3 className={SECTION_TITLE_CLS}>Información Personal</h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col gap-2">
          <label className={LABEL_CLS}>
            Primer Nombre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="primerNombre"
            value={formData.primerNombre}
            onChange={onChange}
            placeholder="Ej: Juan"
            required
            className={INPUT_CLS}
            disabled={disable}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={LABEL_CLS}>Segundo Nombre</label>
          <input
            type="text"
            name="segundoNombre"
            value={formData.segundoNombre}
            onChange={onChange}
            placeholder="Ej: Carlos"
            className={INPUT_CLS}
            disabled={disable}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col gap-2">
          <label className={LABEL_CLS}>
            Primer Apellido <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="primerApellido"
            value={formData.primerApellido}
            onChange={onChange}
            placeholder="Ej: López"
            required
            className={INPUT_CLS}
            disabled={disable}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={LABEL_CLS}>Segundo Apellido</label>
          <input
            type="text"
            name="segundoApellido"
            value={formData.segundoApellido}
            onChange={onChange}
            placeholder="Ej: García"
            className={INPUT_CLS}
            disabled={disable}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className={LABEL_CLS}>
          Identificación (DNI) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="identificacion"
          value={formData.dni}
          onChange={onDniChange}
          placeholder="Ej: 0801199912345"
          required
          className={INPUT_CLS}
          disabled={disable}
        />
      </div>
    </div>
  );
}