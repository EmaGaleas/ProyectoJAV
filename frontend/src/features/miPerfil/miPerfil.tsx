import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useAuthStore } from "../auth/store/authStore";

interface ProfileForm {
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  correo: string;
  telefono: string;
  rol: string;
}

interface PasswordForm {
  current: string;
}
type FormErrors<T> = Partial<Record<keyof T, string>>;

export function MiPerfil() {
  const [profile, setProfile] = useState<ProfileForm>({
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    correo: "",
    telefono: "",
    rol: "",
  });
  const [editProfile, setEditProfile] = useState<ProfileForm>({
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    correo: "",
    telefono: "",
    rol: "",
  });
  const [loading, setLoading] = useState(true);
  const [profileErrors, setProfileErrors] = useState<FormErrors<ProfileForm>>(
    {},
  );

  const [passwords, setPasswords] = useState<PasswordForm>({
    current: "123456",
  });
  const [originalPassword, setOriginalPassword] = useState<PasswordForm>({
    current: "123456",
  });
  const [passwordErrors, setPasswordErrors] = useState<
    FormErrors<PasswordForm>
  >({});

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [isEditing, setIsEditing] = useState(false);

  function showToast(message: string, type: "success" | "error") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }
  function setField<T>(
    setter: React.Dispatch<React.SetStateAction<T>>,
    key: keyof T,
  ) {
    return (value: string) => setter((prev) => ({ ...prev, [key]: value }));
  }

  function validateProfile(): boolean {
    const errors: FormErrors<ProfileForm> = {};
    if (!profile.primerNombre.trim())
      errors.primerNombre = "El nombre es requerido";
    if (!profile.primerApellido.trim())
      errors.primerApellido = "El apellido es requerido";
    if (!profile.correo.trim()) {
      errors.correo = "El correo es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.correo)) {
      errors.correo = "Ingrese un correo válido";
    }
    if (profile.telefono && !/^[\+\d\s\-\(\)]{7,}$/.test(profile.telefono)) {
      errors.telefono = "Ingrese un teléfono válido";
    }
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function validatePasswords(): boolean {
    const errors: FormErrors<PasswordForm> = {};
    if (!passwords.current) errors.current = "La contraseña es obligatoria";

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  }
  const saveChanges = async () => {
    const id = user?.id;
    await api.patch(`/api/usuarios/${id}`, profile);
  };
  function handleSaveProfile() {
    if (validateProfile() && validatePasswords()) {
      setIsEditing(false);
      saveChanges();
      showToast("Perfil actualizado exitosamente", "success");
    } else {
      showToast("Por favor corrija los errores del formulario", "error");
    }
  }

  function handleCancelProfile() {
    setIsEditing(false);
    setProfile(editProfile);
    setPasswords(originalPassword);
    setProfileErrors({});
  }

  const passwordStrength = (() => {
    const pw = passwords.current;
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  })();

  const strengthLabel =
    ["", "Débil", "Regular", "Buena", "Fuerte"][passwordStrength] || "";
  const strengthColor =
    ["", "#d55f5a", "#f59e0b", "#308c58", "#0d1273"][passwordStrength] || "";

  const { user } = useAuthStore();
  console.log(user);
  useEffect(() => {
    const fetchUserInfo = async () => {
      const id = user?.id;
      try {
        const { data } = await api.get<ProfileForm>(`api/Usuarios/${id}`);

        console.log(data);
        setProfile(data);
        setEditProfile(data);
        setOriginalPassword({
          current: "123456",
        });
        setLoading(false);
        console.log(profile);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserInfo();
  }, []);

  if (loading) {
    return <div>Cargando perfil...</div>;
  }

  if (!profile) {
    return <div>No se pudo cargar el perfil.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-[16px] shadow-sm p-[32px] flex items-center gap-[28px]">
        <div className="flex flex-col gap-[4px]">
          <h1 className="font-['Inter',sans-serif] font-medium text-[22px] leading-[1.3] ">
            {profile.primerNombre} {profile.primerApellido}
          </h1>
          <div className="flex items-center gap-[8px]">
            <span className="font-['Inter',sans-serif] font-medium text-[13px] text-[#8ebfa3] uppercase tracking-[0.4px]">
              {profile.rol}
            </span>
            <span className="w-[4px] h-[4px] rounded-full bg-[#8ebfa3]" />
          </div>
          <span className="font-['Inter',sans-serif] text-[13px] text-[#717182] mt-[2px]">
            {profile.correo}
          </span>
        </div>
      </div>
      <div className="bg-white rounded-[16px] shadow-sm overflow-hidden">
        <div className="px-[32px] py-[20px] border-b border-[rgba(0,0,0,0.06)] flex flex-row justify-between">
          <div className="flex flex-col">
            <h2 className="font-['Inter',sans-serif] font-medium text-[16px] ">
              Información Personal
            </h2>
            <p className="font-['Inter',sans-serif] text-[13px] text-[#717182] mt-[2px]">
              Actualice sus datos personales de la cuenta
            </p>
          </div>
          {!isEditing && (
            <div>
              <button
                className="px-6 py-2 bg-gray-600 text-white rounded-lg"
                onClick={() => setIsEditing(true)}
              >
                Editar
              </button>
            </div>
          )}
          {
            /* Actions */
            isEditing && (
              <div className="  flex items-center justify-end gap-[12px]">
                <button
                  onClick={handleCancelProfile}
                  className="px-[20px] py-[9px] rounded-[8px] border border-[rgba(0,0,0,0.15)] font-['Inter',sans-serif] font-medium text-[14px] text-[#3f438c] hover:bg-[#f2f2f2] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-[20px] py-[9px] rounded-[8px] bg-[#308c58] font-['Inter',sans-serif] font-medium text-[14px] text-white hover:bg-[#256e47] transition-colors shadow-sm"
                >
                  Guardar Cambios
                </button>
              </div>
            )
          }
        </div>

        <div className="px-[32px] py-[28px] flex flex-col gap-[20px]">
          <div className="grid grid-cols-2 gap-[20px]">
            <FormField
              label="Primer Nombre"
              value={profile.primerNombre}
              onChange={setField(setProfile, "primerNombre")}
              error={profileErrors.primerNombre}
              placeholder="Ej. Jimena"
              disabled={!isEditing}
            />
            <FormField
              label="Segundo Nombre"
              value={profile.segundoNombre}
              onChange={setField(setProfile, "segundoNombre")}
              error={profileErrors.segundoNombre}
              placeholder="Ej. Sofia"
              disabled={!isEditing}
            />
          </div>
          <div className="grid grid-cols-2 gap-[20px]">
            <FormField
              label="Primer Apellido"
              type="tel"
              value={profile.primerApellido}
              onChange={setField(setProfile, "primerApellido")}
              error={profileErrors.primerApellido}
              placeholder="Ej. Martinez"
              disabled={!isEditing}
            />
            <FormField
              label="Segundo Apellido"
              value={profile.segundoApellido}
              onChange={setField(setProfile, "segundoApellido")}
              error={profileErrors.segundoApellido}
              placeholder="Ej. Rodriguez"
              disabled={!isEditing}
            />
          </div>

          <div className="grid grid-cols-2 gap-[20px]">
            <FormField
              label="Teléfono"
              type="tel"
              value={profile.telefono}
              onChange={setField(setProfile, "telefono")}
              error={profileErrors.telefono}
              placeholder="+504 0000-0000"
              disabled={!isEditing}
            />
            <FormField
              label="Correo Electrónico"
              type="email"
              value={profile.correo}
              onChange={setField(setProfile, "correo")}
              error={profileErrors.correo}
              placeholder="correo@ejemplo.com"
              disabled={!isEditing}
            />
          </div>
          <FormField
            label="Contraseña"
            type="password"
            value={passwords.current}
            onChange={setField(setPasswords, "current")}
            error={passwordErrors.current}
            placeholder="••••••••"
            disabled={!isEditing}
          />
          {/* Strength indicator */}
          {passwords.current && isEditing && (
            <div className="flex flex-col gap-[8px] -mt-[8px]">
              <div className="flex gap-[6px]">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex-1 h-[4px] rounded-full transition-colors"
                    style={{
                      background:
                        i <= passwordStrength ? strengthColor : "#ececf0",
                    }}
                  />
                ))}
              </div>
              <span
                className="font-['Inter',sans-serif] text-[12px] font-medium"
                style={{ color: strengthColor }}
              >
                Seguridad: {strengthLabel}
              </span>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

function FormField({
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  disabled,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-[6px]">
      <label className="font-['Inter',sans-serif] font-medium text-[13px] leading-[20px] text-[#3f438c]">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-[8px] border px-[14px] py-[10px] font-['Inter',sans-serif] font-normal text-[14px] leading-[22px] outline-none transition-colors placeholder:text-[#bdbdbd] ${
          disabled ? "text-[#717182]" : "text-[#1a1a1a]"
        } ${
          error
            ? "border-[#d55f5a] bg-[#fff5f5] focus:border-[#d55f5a]"
            : "border-[rgba(0,0,0,0.15)] bg-white focus:border-[#308c58]"
        }`}
      />
      {error && (
        <span className="font-['Inter',sans-serif] text-[12px] text-[#d55f5a]">
          {error}
        </span>
      )}
    </div>
  );
}

function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  return (
    <div
      className={`fixed top-[24px] right-[24px] z-50 flex items-center gap-[12px] px-[20px] py-[14px] rounded-[10px] shadow-lg font-['Inter',sans-serif] text-[14px] font-medium transition-all ${
        type === "success"
          ? "bg-[#308c58] text-white"
          : "bg-[#8c3f40] text-white"
      }`}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-[4px] opacity-70 hover:opacity-100 transition-opacity text-[18px] leading-none"
      >
        ×
      </button>
    </div>
  );
}
