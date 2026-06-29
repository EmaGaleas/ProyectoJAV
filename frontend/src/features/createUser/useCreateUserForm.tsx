import { useState } from "react";
import { toast } from "react-toastify";
import { api } from "../../services/api";
import type { CreateUserFormData } from "./types";
import { INITIAL_FORM_DATA } from "./types";
import type { User } from "../gestionUsuarios/GestionarUsuarios";

export function useCreateUserForm(
  isSuperAdmin: boolean,
  onUserCreated: (user: User) => void,
  onClose?: () => void,
  initialData?: CreateUserFormData,
  mode?: string,
) {
  console.log(isSuperAdmin);
  const [formData, setFormData] = useState<CreateUserFormData>(
    initialData ?? INITIAL_FORM_DATA,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.replace(/\s/g, "") }));
  };

  const handleCelularChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    value = value.replace(/\D/g, "");

    if (value.startsWith("504")) {
      value = value.slice(3);
    }

    value = value.substring(0, 8);

    const formatted = value.length ? `+504 ${value}` : "+504 ";

    setFormData((prev) => ({
      ...prev,
      telefono: formatted,
    }));
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
      dni: formatted,
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

    if (!formData.dni.trim()) return "La identificación es obligatoria";
    const needsPassword = mode === "create";
    if (needsPassword) {
      if (!formData.contrasena.trim()) return "La contraseña es obligatoria";
      if (formData.contrasena.length < 6)
        return "La contraseña debe tener al menos 6 caracteres";
    }

    const celularDigits = formData.telefono.replace(/\D/g, "");
    if (celularDigits.length !== 11)
      return "El celular debe tener 8 dígitos después de +504";
    if (!formData.correo.trim()) return "El correo electronico es obligatorio";

    const dni = formData.dni.trim().replace(/-/g, "");
    if (dni.length !== 13)
      return "El numero de identificacion debe tener 13 digitos";
    if (!formData.dni.trim())
      return "El numero de identificacion es obligatorio";

    const needsAddress = formData.rol === "DuenoDeCasa";
    if (needsAddress) {
      if (!formData.domicilios.calle) return "La calle es obligatoria";
      if (!formData.domicilios.codigoBloque) return "El bloque es obligatorio";
      if (
        !formData.domicilios.loteCasa ||
        parseInt(formData.domicilios.loteCasa) <= 0
      )
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
      const telefono = formData.telefono.replace("+504 ", "");
      const tieneApts =
        formData.tipoVivienda === "Apartamentos" ||
        formData.tipoVivienda === "Ambos";

      const payload: Record<string, unknown> = {
        primerNombre: formData.primerNombre.trim(),
        segundoNombre: formData.segundoNombre?.trim() || "",
        primerApellido: formData.primerApellido.trim(),
        segundoApellido: formData.segundoApellido?.trim() || "",
        dni: formData.dni.trim().replace(/-/g, ""),
        correo: formData.correo.trim(),
        telefono: telefono,
        password: formData.contrasena,
        rol: formData.rol,
        Estado: formData.estado !== undefined ? formData.estado : true,

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
          calle: formData.domicilios.calle,
          codigoBloque: formData.domicilios.codigoBloque,
          loteCasa: parseInt(formData.domicilios.loteCasa) || 0,
          estructura: 1,
        };
      }
      console.log(payload);

      let response;

      if (mode === "create") {
        response = await api.post("/api/usuarios", payload);
        toast.success("Usuario creado exitosamente ");
      } else {
        const idUsuario = formData.idUsuario;
        response = await api.patch(`/api/usuarios/${idUsuario}`, payload);
        toast.success("Usuario actualizado exitosamente ");
      }

      const { data } = response;

      onUserCreated(data);
      if (onClose) onClose();
    } catch (err: any) {
      console.error("Error al crear usuario:", err);
      toast.error("Ocurrió un error al crear el usuario.");
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