
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { verifyEmail, resendVerification } from "../services/authService";

function VerifyEmail() {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [loading, setLoading] = useState(!!token);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  // ==========================================
  // VERIFICAR CORREO ELECTRÓNICO
  // ==========================================

  useEffect(() => {
    const confirmEmail = async () => {

      // Si no hay token, el usuario viene del registro
      // y debe revisar su bandeja de entrada.

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        await verifyEmail(token);

        setSuccess(true);

      } catch (error) {
        console.error("Error verificando correo:", error);

        setError(
          error.response?.data?.message ||
          "No se pudo verificar tu correo. Es posible que el enlace haya expirado o no sea válido."
        );

      } finally {
        setLoading(false);
      }
    };

    confirmEmail();
  }, [token]);

  // ==========================================
  // REENVIAR CORREO DE VERIFICACIÓN
  // ==========================================

  const handleResend = async () => {

    if (!email) {
      setError(
        "No encontramos tu correo electrónico. Regresa al registro o contacta con nosotros."
      );
      return;
    }

    try {
      setResending(true);
      setResendMessage("");
      setError("");

      const response = await resendVerification(email);

      setResendMessage(
        response.message ||
        "Si la cuenta necesita verificación, recibirás un nuevo correo."
      );

    } catch (error) {
      console.error("Error reenviando correo:", error);

      setError(
        error.response?.data?.message ||
        "No se pudo reenviar el correo. Inténtalo nuevamente."
      );

    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4 py-20">

      <div className="w-full max-w-lg">

        {/* ==========================================
            ENCABEZADO
        ========================================== */}

        <div className="text-center mb-10">

          <Link
            to="/"
            className="text-3xl font-bold text-white"
          >
            AuraBarberStudio
          </Link>

          <h1 className="text-4xl font-bold text-white mt-8">
            Verificación de correo
          </h1>

          <p className="text-gray-400 mt-3">
            Confirma tu dirección de correo electrónico.
          </p>

        </div>

        {/* ==========================================
            CONTENIDO
        ========================================== */}

        <div className="bg-[#202020] border border-gray-700 rounded-2xl p-8 shadow-xl text-center">

          {/* CARGANDO */}

          {loading && (

            <div className="space-y-5">

              <div className="text-5xl animate-pulse">
                📧
              </div>

              <h2 className="text-2xl font-bold text-white">
                Verificando tu correo...
              </h2>

              <p className="text-gray-400">
                Estamos comprobando tu enlace de verificación.
                Por favor espera un momento.
              </p>

            </div>

          )}

          {/* ESPERANDO VERIFICACIÓN */}

          {!loading && !token && !success && (

            <div className="space-y-5">

              <div className="text-5xl">
                📩
              </div>

              <h2 className="text-2xl font-bold text-white">
                ¡Revisa tu correo electrónico!
              </h2>

              <p className="text-gray-300">
                Te hemos enviado un enlace para verificar
                tu dirección de correo electrónico.
              </p>

              {email && (

                <p className="text-gray-400">
                  Enviamos el correo a:
                  <br />

                  <span className="text-[#DAA520] font-semibold">
                    {email}
                  </span>
                </p>

              )}

              <p className="text-gray-400">
                Abre el mensaje y haz clic en el enlace
                para activar tu cuenta.
              </p>

              <p className="text-gray-500 text-sm">
                Si no encuentras el mensaje, revisa también
                tu carpeta de spam o correo no deseado.
              </p>

              {email && (

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="w-full py-4 rounded-xl bg-[#B8860B] hover:bg-[#DAA520] transition-all duration-300 text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resending
                    ? "Enviando..."
                    : "Reenviar correo de verificación"
                  }
                </button>

              )}

              {resendMessage && (

                <div className="bg-green-900/30 border border-green-500/40 text-green-400 rounded-xl p-3 text-sm">
                  {resendMessage}
                </div>

              )}

              {error && (

                <div className="bg-red-900/30 border border-red-500/40 text-red-400 rounded-xl p-3 text-sm">
                  {error}
                </div>

              )}

            </div>

          )}

          {/* VERIFICACIÓN EXITOSA */}

          {!loading && success && (

            <div className="space-y-5">

              <div className="text-5xl">
                ✅
              </div>

              <h2 className="text-2xl font-bold text-white">
                ¡Correo verificado!
              </h2>

              <p className="text-gray-300">
                Tu dirección de correo electrónico ha sido
                verificada correctamente.
              </p>

              <p className="text-gray-400">
                Ahora puedes iniciar sesión y comenzar a
                reservar tus citas.
              </p>

              <Link
                to="/login"
                className="block w-full py-4 rounded-xl bg-[#B8860B] hover:bg-[#DAA520] transition-all duration-300 text-white font-bold text-lg"
              >
                Iniciar sesión
              </Link>

            </div>

          )}

          {/* ERROR DE VERIFICACIÓN */}

          {!loading && token && !success && error && (

            <div className="space-y-5">

              <div className="text-5xl">
                ⚠️
              </div>

              <h2 className="text-2xl font-bold text-white">
                No pudimos verificar tu correo
              </h2>

              <p className="text-red-400">
                {error}
              </p>

              {email && (

                <div className="space-y-4">

                  <p className="text-gray-400">
                    Correo electrónico:
                    <br />

                    <span className="text-[#DAA520] font-semibold">
                      {email}
                    </span>
                  </p>

                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="w-full py-4 rounded-xl bg-[#B8860B] hover:bg-[#DAA520] transition-all duration-300 text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resending
                      ? "Enviando..."
                      : "Reenviar correo de verificación"
                    }
                  </button>

                </div>

              )}

              {resendMessage && (

                <div className="bg-green-900/30 border border-green-500/40 text-green-400 rounded-xl p-3 text-sm">
                  {resendMessage}
                </div>

              )}

            </div>

          )}

          {/* VOLVER */}

          {!loading && !success && (

            <div className="mt-6">

              <Link
                to="/login"
                className="text-[#B8860B] hover:text-[#DAA520] transition"
              >
                Volver al inicio de sesión
              </Link>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default VerifyEmail;
