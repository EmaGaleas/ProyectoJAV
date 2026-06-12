import { useState } from "react";
import { apiFetch } from "../../services/apiClient";
import { useAuthStore } from "../auth/store/authStore";
import type { CreateUserFormData } from "./types";
import { INITIAL_FORM_DATA } from "./types";

export function useCreateUserForm(isSuperAdmin: boolean, onClose?: () => void) {
  const [formData, setFormData] = useState<CreateUserFormData>(INITIAL_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuthStore();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCelularChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (!value.startsWith("504")) value = "504" + value;
    value = value.substring(0, 11);
    let formatted = "+504";
    if (value.length > 3) formatted += " " + value.substring(3);
    setFormData((prev) => ({ ...prev, celular: formatted }));
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
    if (!formData.primerApellido.trim()) return "El primer apellido es obligatorio";
    if (!formData.segundoApellido.trim()) return "El segundo apellido es obligatorio";
    if (!formData.identificacion.trim()) return "La identificación es obligatoria";
    if (!formData.contrasena.trim()) return "La contraseña es obligatoria";
    if (formData.contrasena.length < 6) return "La contraseña debe tener al menos 6 caracteres";

    const celularDigits = formData.celular.replace(/\D/g, "");
    if (celularDigits.length !== 11) return "El celular debe tener 8 dígitos después de +504";

    const needsAddress =  formData.rol === "0";
    if (needsAddress) {
      if (!formData.calle) return "La calle es obligatoria";
      if (!formData.bloque) return "El bloque es obligatorio";
      if (!formData.numerolote || parseInt(formData.numerolote) <= 0)
        return "El número de lote es obligatorio";

      const tieneApts =
        formData.tipoVivienda === "Apartamentos" || formData.tipoVivienda === "Ambos";
      if (tieneApts) {
        const total = parseInt(formData.cantidadApartamentos);
        const habitados = parseInt(formData.apartamentosHabitados);
        if (!total || total <= 0) return "La cantidad de apartamentos debe ser mayor a 0";
        if (isNaN(habitados) || habitados < 0) return "Los apartamentos habitados no pueden ser negativos";
        if (habitados > total) return "Los apartamentos habitados no pueden exceder el total";
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Token al enviar:", token);
    setIsLoading(true);
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      const isDueñoDeCasa = formData.rol === "0";

      const tieneApts =
        isDueñoDeCasa &&
        (formData.tipoVivienda === "Apartamentos" || formData.tipoVivienda === "Ambos");

      const payload = {
        PrimerNombre: formData.primerNombre.trim(),
        SegundoNombre: formData.segundoNombre.trim() || null,
        PrimerApellido: formData.primerApellido.trim(),
        SegundoApellido: formData.segundoApellido.trim(),
        Dni: formData.identificacion.trim(),
        Correo: formData.correo.trim(),
        Telefono: formData.celular,
        Password: formData.contrasena,
        Rol: parseInt(formData.rol),
        IdTipoUsuario: 1,
        Calle: isDueñoDeCasa ? formData.calle : null,
        Bloque: isDueñoDeCasa ? formData.bloque : null,
        NumeroLote: isDueñoDeCasa ? (parseInt(formData.numerolote) || 0) : 0,
        TipoVivienda: isDueñoDeCasa ? formData.tipoVivienda : null,
        CasaHabilitada: isDueñoDeCasa && formData.tipoVivienda !== "Apartamentos"
          ? formData.casaHabilitada
          : null,
        CantidadApartamentos: tieneApts ? parseInt(formData.cantidadApartamentos) : 0,
        ApartamentosHabitados: tieneApts ? parseInt(formData.apartamentosHabitados) : 0,
      };
     

      await apiFetch("/api/usuarios", { method: "POST", body: JSON.stringify(payload) }, token || undefined);
      alert("Usuario creado exitosamente");
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
    setField,
    resetVivienda,
    handleSubmit,
  };
}
