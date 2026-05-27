import logo from "./assets/logo.png";

function Login() {
  return (
    <>
      <div className=" bg-[#308C58] h-screen flex">
        <div className="bg-[#308C58] w-1/3 items-center justify-center flex flex-col">
          <div className="w-3/4 text-white text-center">
            <p className="font-bold text-[40px]">¡Agua pura para su hogar!</p>
            <p>
              Acceda a su portal de residente para gestionar sus pagos, revisar
              su consumo y reportar incidencias con la rapidez y precisión que
              su familia merece.
            </p>
          </div>
        </div>

        <div className="bg-[#F2F2F2] w-2/3 rounded-l-4xl items-center justify-center flex flex-col gap-7">
          <div className="mb-10">
            <img
              src={logo}
              alt="Logo"
              width="200"
              height="200"
              className="object-contain "
            />
          </div>
          <div className="">
            <p className="font-bold text-[40px] text-[#514F4F]">Bienvenido</p>
          </div>

          <form className=" bg-[#F2F2F2] items-center p-8 w-full max-w-sm max-w-sm flex flex-col text-[18px] gap-6">
            <div className="mb-4 gap-4 w-full">
              <label className="block  mb-2">Correo Electronico</label>
              <input
                type="email"
                placeholder="Ingrese Correo Electronico"
                className="w-full px-4 py-2 border-[#E5E5E5]  focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6 gap-4 w-full">
              <label className="block mb-2">Contraseña</label>
              <input
                type="password"
                placeholder="Ingrese Contraseña"
                className="w-full px-4 py-2 border-[#E5E5E5]  focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#0D1273] text-white text-[18px] rounded-lg hover:bg-blue-800 transition p-12"
            >
              Iniciar Sesion
            </button>

            <p className="text-[#514F4F] font-extralight self-center">
              ¿Olvidaste tu contraseña?
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
