
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/authService";

function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);


  // ==========================================
  // ENVIAR SOLICITUD DE RECUPERACIÓN
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Ingresa tu correo electrónico.");
      return;
    }

    try {

      setLoading(true);

      await forgotPassword(email.trim());

      setSuccess(true);

    } catch (error) {

      console.error(
        "Error solicitando recuperación:",
        error
      );

      setError(
        error.response?.data?.message ||
        "No se pudo procesar la solicitud. Inténtalo nuevamente."
      );

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
            Recuperación de contraseña
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

          {success ? (

            /* ==========================================
                SOLICITUD ENVIADA
            ========================================== */

            <div className="text-center">

              <div className="
                text-5xl
                mb-6
              ">
                📧
              </div>

              <h2 className="
                text-2xl
                font-bold
                text-white
                mb-4
              ">
                Revisa tu correo
              </h2>

              <p className="
                text-gray-400
                leading-relaxed
                mb-6
              ">
                Si existe una cuenta asociada a ese correo,
                recibirás un enlace para restablecer tu
                contraseña. Revisa también la carpeta de spam.
              </p>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="
                  w-full
                  bg-[#B8860B]
                  hover:bg-[#DAA520]
                  text-white
                  py-4
                  rounded-xl
                  font-bold
                  transition
                "
              >
                Volver al inicio de sesión
              </button>

            </div>

          ) : (

            <>
              <h2 className="
                text-2xl
                font-bold
                text-white
                mb-4
              ">
                ¿Olvidaste tu contraseña?
              </h2>

              <p className="
                text-gray-400
                mb-8
                leading-relaxed
              ">
                Ingresa el correo electrónico asociado a tu
                cuenta y te enviaremos un enlace para crear
                una nueva contraseña.
              </p>


              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >

                {/* ==========================================
                    CORREO ELECTRÓNICO
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
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    autoComplete="email"
                    required
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
                    ? "Enviando..."
                    : "Enviar enlace de recuperación"
                  }

                </button>

              </form>


              {/* ==========================================
                  VOLVER AL LOGIN
              ========================================== */}

              <div className="
                text-center
                mt-8
              ">

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="
                    text-[#B8860B]
                    hover:text-[#DAA520]
                    font-semibold
                    transition
                  "
                >
                  ← Volver al inicio de sesión
                </button>

              </div>

            </>

          )}

        </div>

      </div>

    </section>

  );

}

export default ForgotPassword;
