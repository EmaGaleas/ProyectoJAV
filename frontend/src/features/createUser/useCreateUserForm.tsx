import { useState } from "react";
import { api } from "../../services/api";
import type { CreateUserFormData } from "./types";
import { INITIAL_FORM_DATA } from "./types";
import type { User } from "../gestionUsuarios/GestionarUsuarios";

export function useCreateUserForm(
  isSuperAdmin: boolean,
  onUserCreated: (user: User) => void,
  onClose?: () => void,
) {
  const [formData, setFormData] =
    useState<CreateUserFormData>(INITIAL_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.replace(/\s/g, "") }));
  };

  const handleCelularChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (!value.startsWith("504")) value = "504" + value;
    value = value.substring(0, 11);
    let formatted = "+504";
    if (value.length > 3) formatted += " " + value.substring(3);
    setFormData((prev) => ({ ...prev, celular: formatted }));
  };

  const handleDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    value = value.substring(0, 13);

    let formatted = "";

    if (value.length > 0) {
      formatted += value.substring(0, 4);
    }
    if (value.length > 4) {
      formatted += "-" + value.substring(4, 8);
    }
    if (value.length > 8) {
      formatted += "-" + value.substring(8, 13);
    }

    setFormData((prev) => ({
      ...prev,
      identificacion: formatted,
    }));
  };

  const setField = <K extends keyof CreateUserFormData>(
    key: K,
    value: CreateUserFormData[K],
  ) => setFormData((prev) => ({ ...prev, [key]: value }));

  const resetVivienda = (tipoVivienda: string) =>
    setFormData((prev) => ({
      ...prev,
      tipoVivienda,
      casaHabilitada: true,
      cantidadApartamentos: "",
      apartamentosHabitados: "",
    }));

  const validate = (): string | null => {
    if (!formData.primerNombre.trim()) return "El primer nombre es obligatorio";
    if (!formData.primerApellido.trim())
      return "El primer apellido es obligatorio";

    if (!formData.identificacion.trim())
      return "La identificación es obligatoria";
    if (!formData.contrasena.trim()) return "La contraseña es obligatoria";
    if (formData.contrasena.length < 6)
      return "La contraseña debe tener al menos 6 caracteres";

    const celularDigits = formData.celular.replace(/\D/g, "");
    if (celularDigits.length !== 11)
      return "El celular debe tener 8 dígitos después de +504";
    if (!formData.correo.trim()) return "El correo electronico es obligatorio";

    const dni = formData.identificacion.trim().replace(/-/g, "");
    if (dni.length != 14)
      return "El numero de identificacion debe tener 13 digitos";
    if (!formData.identificacion.trim())
      return "El numero de identificacion es obligatorio";

    const needsAddress = !isSuperAdmin || formData.rol === "DuenoDeCasa";
    if (needsAddress) {
      if (!formData.calle) return "La calle es obligatoria";
      if (!formData.bloque) return "El bloque es obligatorio";
      if (!formData.numerolote || parseInt(formData.numerolote) <= 0)
        return "El número de lote es obligatorio";

      const tieneApts =
        formData.tipoVivienda === "Apartamentos" ||
        formData.tipoVivienda === "Ambos";
      if (tieneApts) {
        const total = parseInt(formData.cantidadApartamentos);
        const habitados = parseInt(formData.apartamentosHabitados);
        if (!total || total <= 0)
          return "La cantidad de apartamentos debe ser mayor a 0";
        if (isNaN(habitados) || habitados < 0)
          return "Los apartamentos habitados no pueden ser negativos";
        if (habitados > total)
          return "Los apartamentos habitados no pueden exceder el total";
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      const isDuenoDeCasa = formData.rol === "DuenoDeCasa";
      const tieneApts =
        formData.tipoVivienda === "Apartamentos" ||
        formData.tipoVivienda === "Ambos";

      const payload: Record<string, unknown> = {
        primerNombre: formData.primerNombre.trim(),
        segundoNombre: formData.segundoNombre.trim() || null,
        primerApellido: formData.primerApellido.trim(),
        segundoApellido: formData.segundoApellido.trim(),
        dni: formData.identificacion.trim().replace(/-/g, ""),
        correo: formData.correo.trim(),
        telefono: formData.celular,
        password: formData.contrasena,
        rol: formData.rol,

        TipoVivienda: formData.tipoVivienda,
        CasaHabilitada:
          formData.tipoVivienda !== "Apartamentos"
            ? formData.casaHabilitada
            : null,
        CantidadApartamentos: tieneApts
          ? parseInt(formData.cantidadApartamentos)
          : 0,
        ApartamentosHabitados: tieneApts
          ? parseInt(formData.apartamentosHabitados)
          : 0,
      };

      if (isDuenoDeCasa) {
        payload.domicilio = {
          calle: formData.calle,
          codigoBloque: formData.bloque,
          loteCasa: parseInt(formData.numerolote) || 0,
          estructura: 1,
        };
      }
      console.log(payload);
      const { data } = await api.post("/api/usuarios", payload);
      alert("Usuario creado exitosamente");
      onUserCreated(data);
      if (onClose) onClose();
    } catch (err: any) {
      console.error("Error al crear usuario:", err);
      setError(err.message || "Ocurrió un error al crear el usuario.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    error,
    handleInputChange,
    handleCelularChange,
    handleDniChange,
    setField,
    resetVivienda,
    handleSubmit,
  };
}
