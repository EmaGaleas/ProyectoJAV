import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import type { Role } from './types';
import { ROUTES } from '../../router/routes';
import logo from '../../assets/logo.png';

function Login() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  //TEMPORAL sin backend ─
  const [rolDePrueba, setRolDePrueba] = useState<Role>('Tesorero');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    setAuth({
      id: '1',
      nombre: 'Usuario de prueba',
      rol: rolDePrueba,
    });

    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className="bg-[#308C58] h-screen flex">
      {/* Panel izquierdo */}
      <div className="bg-[#308C58] w-1/3 items-center justify-center flex flex-col">
        <div className="w-3/4 text-white text-center">
          <p className="font-bold text-[40px]">
            ¡Agua pura para su hogar!
          </p>

          <p>
            Acceda a su portal de residente para gestionar sus
            pagos, revisar su consumo y reportar incidencias con
            la rapidez y precisión que su familia merece.
          </p>
        </div>
      </div>

      {/* Panel derecho */}
      <div className="bg-[#F2F2F2] w-2/3 rounded-l-4xl items-center justify-center flex flex-col gap-7">
        {/* Logo */}
        <div className="mb-10">
          <img
            src={logo}
            alt="Logo"
            width="200"
            height="200"
            className="object-contain"
          />
        </div>

        {/* Título */}
        <div>
          <p className="font-bold text-[40px] text-[#514F4F]">
            Bienvenido
          </p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleLogin}
          className="bg-[#F2F2F2] items-center p-8 w-full max-w-sm flex flex-col text-[18px] gap-6"
        >
          {/* Correo */}
          <div className="w-full">
            <label className="block mb-2">
              Correo Electrónico
            </label>

            <input
              type="email"
              placeholder="Ingrese Correo Electrónico"
              className="w-full px-4 py-2 border border-[#E5E5E5] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Contraseña */}
          <div className="w-full">
            <label className="block mb-2">
              Contraseña
            </label>

            <input
              type="password"
              placeholder="Ingrese Contraseña"
              className="w-full px-4 py-2 border border-[#E5E5E5] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Selector de rol */}
          <div className="w-full">
            <label className="block mb-2">
              Rol de prueba
            </label>

            <select
              value={rolDePrueba}
              onChange={(e) =>
                setRolDePrueba(e.target.value as Role)
              }
              className="w-full px-4 py-2 border border-[#E5E5E5] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="SuperAdministrador">
                Super Administrador
              </option>

              <option value="Administrador">
                Administrador
              </option>

              <option value="Tesorero">
                Tesorero
              </option>

              <option value="Fiscal">
                Fiscal
              </option>
            </select>
          </div>

          {/* Texto temporal */}
          <p className="text-gray-500 text-sm">
            Rol activo (temporal):{' '}
            <strong>{rolDePrueba}</strong>
          </p>

          {/* Botón */}
          <button
            type="submit"
            className="w-full h-12 bg-[#0D1273] text-white text-[18px] rounded-lg hover:bg-blue-800 transition flex items-center justify-center"
          >
            Iniciar Sesión
          </button>

          {/* Recuperar contraseña */}
          <p className="text-[#514F4F] font-extralight self-center">
            ¿Olvidaste tu contraseña?
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;