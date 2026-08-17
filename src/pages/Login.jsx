import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { login } from "../services/authService";

function Login() {

  const navigate = useNavigate();
  const location = useLocation();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  // ==========================================
  // SABER SI VIENE DESDE UNA RESERVA
  // ==========================================

  const fromReservation =
    location.state?.fromReservation === true;


  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");


    // ==========================================
    // VALIDACIÓN
    // ==========================================

    if (!email || !password) {

      setError(
        "Completa todos los campos."
      );

      return;

    }


    try {

      setLoading(true);


      const data = await login(
        email,
        password
      );


      console.log(
        "Usuario autenticado:",
        data.user
      );


      // ==========================================
      // REDIRECCIÓN
      // ==========================================

      if (
        data.user.role === "BARBER"
      ) {

        navigate("/admin");

      } else {

        navigate("/appointments");

      }


    } catch (error) {

      console.error(
        "Error iniciando sesión:",
        error
      );


      const message =
        error.response?.data?.message ||
        "No se pudo iniciar sesión.";


      setError(message);


    } finally {

      setLoading(false);

    }

  };


  return (

    <section className="
      min-h-screen
      bg-[#111111]
      flex
      items-center
      justify-center
      px-5
    ">

      <div className="
        w-full
        max-w-md
      ">


        {/* ==========================================
            TÍTULO
        ========================================== */}

        <div className="
          text-center
          mb-10
        ">

          <h1 className="
            text-4xl
            font-bold
            text-white
          ">
            AuraBarberStudio
          </h1>


          <p className="
            text-gray-400
            mt-3
          ">
            Inicia sesión para continuar
          </p>

        </div>


        {/* ==========================================
            FORMULARIO
        ========================================== */}

        <div className="
          bg-[#202020]
          border
          border-gray-700
          rounded-2xl
          p-8
        ">


          <h2 className="
            text-2xl
            font-bold
            text-white
            mb-8
          ">
            Iniciar sesión
          </h2>


          {/* ==========================================
              MENSAJE DESDE RESERVA
          ========================================== */}

          {fromReservation && (

            <div className="
              bg-[#B8860B]/10
              border
              border-[#B8860B]
              text-[#DAA520]
              rounded-xl
              p-4
              text-sm
              mb-6
            ">

              🔒 Debes iniciar sesión para
              confirmar tu reserva.

            </div>

          )}


          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >


            {/* ==========================================
                EMAIL
            ========================================== */}

            <div>

              <label className="
                block
                text-gray-300
                mb-2
              ">
                Correo electrónico
              </label>


              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="correo@ejemplo.com"
                className="
                  w-full
                  bg-[#111111]
                  border
                  border-gray-700
                  rounded-xl
                  px-4
                  py-3
                  text-white
                  placeholder-gray-500
                  focus:outline-none
                  focus:border-[#B8860B]
                "
              />

            </div>


            {/* ==========================================
                CONTRASEÑA
            ========================================== */}

            <div>

              <label className="
                block
                text-gray-300
                mb-2
              ">
                Contraseña
              </label>


              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="••••••••"
                  className="
                    w-full
                    bg-[#111111]
                    border
                    border-gray-700
                    rounded-xl
                    px-4
                    py-3
                    pr-12
                    text-white
                    placeholder-gray-500
                    focus:outline-none
                    focus:border-[#B8860B]
                  "
                />


                {/* OJO */}

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                    hover:text-[#B8860B]
                    transition
                  "
                  aria-label={
                    showPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >

                  {showPassword
                    ? "🙈"
                    : "👁️"
                  }

                </button>

              </div>


              {/* ==========================================
                  RECUPERAR CONTRASEÑA
              ========================================== */}

              <div className="
                flex
                justify-end
                mt-3
              ">

                <button
                  type="button"
                  onClick={() => {
                    // Se implementará
                    // posteriormente.
                  }}
                  className="
                    text-sm
                    text-[#B8860B]
                    hover:text-[#DAA520]
                    transition
                  "
                >

                  ¿Olvidaste tu contraseña?

                </button>

              </div>

            </div>


            {/* ==========================================
                ERROR
            ========================================== */}

            {error && (

              <div className="
                bg-red-900/30
                border
                border-red-700
                text-red-400
                rounded-xl
                p-4
                text-sm
              ">

                {error}

              </div>

            )}


            {/* ==========================================
                BOTÓN
            ========================================== */}

            <button
              type="submit"
              disabled={loading}
              className={`
                w-full
                py-4
                rounded-xl
                font-bold
                text-lg
                transition-all
                duration-300

                ${
                  loading
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-[#B8860B] hover:bg-[#DAA520] text-white"
                }
              `}
            >

              {loading
                ? "Iniciando sesión..."
                : "Iniciar sesión"
              }

            </button>

          </form>


          {/* ==========================================
              REGISTRO
          ========================================== */}

          <div className="
            text-center
            mt-8
          ">

            <p className="
              text-gray-400
            ">

              ¿No tienes una cuenta?


              <button
                type="button"
                onClick={() =>
                  navigate("/register")
                }
                className="
                  ml-2
                  text-[#B8860B]
                  hover:text-[#DAA520]
                  font-semibold
                "
              >

                Registrarse

              </button>

            </p>

          </div>


        </div>

      </div>

    </section>

  );

}

export default Login;