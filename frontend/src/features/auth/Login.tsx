import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { loginApi } from './services/authService'
import { ApiError } from '../../services/apiClient'
import { ROUTES } from '../../router/routes'
import { Eye, EyeOff } from 'lucide-react'
import logo from '../../assets/logo.png'

function Login() {
  const { setAuth } = useAuthStore()
  const navigate    = useNavigate()

  const [correo,       setCorreo]       = useState('')
  const [password,     setPassword]     = useState('')
  const [error,        setError]        = useState<string | null>(null)
  const [cargando,     setCargando]     = useState(false)
  const [mostrarPass,  setMostrarPass]  = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setCargando(true)

    try {
      const { user, token } = await loginApi(correo, password)
      setAuth(user, token)
      navigate(ROUTES.DASHBOARD)
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError('Correo o contraseña incorrectos.')
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Ocurrió un error inesperado. Intente de nuevo.')
      }
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="bg-[#308C58] h-screen flex">
      {/* Panel izquierdo */}
      <div className="bg-[#308C58] w-1/3 items-center justify-center flex flex-col">
        <div className="w-3/4 text-white text-center">
          <p className="font-bold text-[40px]">
            Junta de Agua Villalinda
          </p>
          <p>
            Panel de administración para la gestión de cobros,
            pagos, egresos y usuarios de la junta.
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
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              disabled={cargando}
              className="w-full px-4 py-2 border border-[#E5E5E5] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>

          {/* Contraseña */}
          <div className="w-full">
            <label className="block mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={mostrarPass ? 'text' : 'password'}
                placeholder="Ingrese Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={cargando}
                className="w-full px-4 py-2 pr-11 border border-[#E5E5E5] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setMostrarPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#514F4F] hover:text-[#308C58]"
                tabIndex={-1}
              >
                {mostrarPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="w-full text-red-600 text-sm text-center">
              {error}
            </p>
          )}

          {/* Botón */}
          <button
            type="submit"
            disabled={cargando}
            className="w-full h-12 bg-[#0D1273] text-white text-[18px] rounded-lg hover:bg-blue-800 transition flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
