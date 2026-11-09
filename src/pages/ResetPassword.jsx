
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/authService";

function ResetPassword() {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);


  // ==========================================
  // RESTABLECER CONTRASEÑA
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    // VALIDAR TOKEN

    if (!token) {
      setError(
        "El enlace de recuperación no es válido o está incompleto."
      );
      return;
    }

    // VALIDAR CONTRASEÑA

    if (!password || !confirmPassword) {
      setError("Completa todos los campos.");
      return;
    }

    if (password.length < 8 || password.length > 128) {
  setError(
    "La contraseña debe tener entre 8 y 128 caracteres."
  );
  return;
}

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!*?&])[A-Za-z\d@$!*?&]+$/;

if (!passwordRegex.test(password)) {
  setError(
    "La contraseña debe contener al menos una minúscula, una mayúscula, un número y un carácter especial (@$!*?&)."
  );
  return;
}

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {

      setLoading(true);

      await resetPassword(token, password);

      setSuccess(true);

    } catch (error) {

      console.error(
        "Error restableciendo contraseña:",
        error
      );

      setError(
        error.response?.data?.message ||
        "El enlace ha expirado o no es válido. Solicita uno nuevo."
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
            Seguridad de tu cuenta
          </p>

        </div>


        {/* ==========================================
            CONTENIDO
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
                CONTRASEÑA ACTUALIZADA
            ========================================== */

            <div className="text-center">

              <div className="
                text-5xl
                mb-6
              ">
                ✅
              </div>

              <h2 className="
                text-2xl
                font-bold
                text-white
                mb-4
              ">
                ¡Contraseña actualizada!
              </h2>

              <p className="
                text-gray-400
                leading-relaxed
                mb-6
              ">
                Tu contraseña se ha cambiado correctamente.
                Ahora puedes iniciar sesión con tu nueva contraseña.
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
                Ir al inicio de sesión
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
                Crear nueva contraseña
              </h2>

              <p className="
                text-gray-400
                mb-8
                leading-relaxed
              ">
                Ingresa tu nueva contraseña y confírmala
                para recuperar el acceso a tu cuenta.
              </p>


              {!token && (

                <div className="
                  bg-red-900/30
                  border
                  border-red-700
                  text-red-400
                  rounded-xl
                  p-4
                  text-sm
                  mb-6
                ">
                  No se encontró un token de recuperación.
                  Solicita un nuevo enlace.
                </div>

              )}


              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >

                {/* ==========================================
                    NUEVA CONTRASEÑA
                ========================================== */}

                <div>

                  <label className="
                    block
                    text-gray-300
                    mb-2
                  ">
                    Nueva contraseña
                  </label>

                  <div className="relative">

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres, mayúscula, número y símbolo"
                      autoComplete="new-password"
                      minLength={8}
                      maxLength={128}
                      required
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

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
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
                      👁️
                    </button>

                  </div>

                </div>


                {/* ==========================================
                    CONFIRMAR CONTRASEÑA
                ========================================== */}

                <div>

                  <label className="
                    block
                    text-gray-300
                    mb-2
                  ">
                    Confirmar nueva contraseña
                  </label>

                  <div className="relative">

                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repite tu contraseña"
                      autoComplete="new-password"
                      required
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

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
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
                        showConfirmPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                    >
                      👁️
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
                  disabled={loading || !token}
                  className={`
                    w-full
                    py-4
                    rounded-xl
                    font-bold
                    text-lg
                    transition-all
                    duration-300

                    ${
                      loading || !token
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-[#B8860B] hover:bg-[#DAA520] text-white"
                    }
                  `}
                >

                  {loading
                    ? "Actualizando..."
                    : "Restablecer contraseña"
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

export default ResetPassword;
