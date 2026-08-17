import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);


  // ==========================================
  // CAMBIAR INPUT
  // ==========================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

  };


  // ==========================================
  // REGISTRAR USUARIO
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");


    // Validar campos

    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {

      setError("Por favor completa todos los campos.");

      return;
    }


    // Validar contraseña

    if (formData.password !== formData.confirmPassword) {

      setError("Las contraseñas no coinciden.");

      return;
    }


    // Validar longitud

    if (formData.password.length < 8) {

      setError(
        "La contraseña debe tener al menos 8 caracteres."
      );

      return;
    }


    // Validar requisitos de seguridad

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;


    if (!passwordRegex.test(formData.password)) {

      setError(
        "La contraseña debe contener al menos 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial."
      );

      return;
    }


    try {

      setLoading(true);


      await register(
        formData.first_name,
        formData.last_name,
        formData.email,
        formData.phone,
        formData.password
      );


      setSuccess(
        "Cuenta creada correctamente. Redirigiendo al login..."
      );


      // Esperar un momento para mostrar el mensaje

      setTimeout(() => {

        navigate("/login");

      }, 1500);


    } catch (error) {

      console.error(
        "Error registrando usuario:",
        error
      );


      if (error.response?.data?.message) {

        setError(
          error.response.data.message
        );

      } else {

        setError(
          "No se pudo crear la cuenta. Inténtalo nuevamente."
        );

      }

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4 py-20">

      <div className="w-full max-w-lg">


        {/* ==========================================
            TÍTULO
        ========================================== */}

        <div className="text-center mb-10">

          <Link
            to="/"
            className="text-3xl font-bold text-white"
          >
            AuraBarberStudio
          </Link>

          <h1 className="text-4xl font-bold text-white mt-8">
            Crear una cuenta
          </h1>

          <p className="text-gray-400 mt-3">
            Regístrate para poder reservar tus citas.
          </p>

        </div>


        {/* ==========================================
            FORMULARIO
        ========================================== */}

        <div className="bg-[#202020] border border-gray-700 rounded-2xl p-8 shadow-xl">


          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >


            {/* NOMBRE Y APELLIDO */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


              <div>

                <label className="block text-gray-300 mb-2">
                  Nombre
                </label>

                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Fabricio"
                  className="
                    w-full
                    bg-[#111111]
                    border
                    border-gray-700
                    rounded-xl
                    px-4
                    py-3
                    text-white
                    focus:outline-none
                    focus:border-[#B8860B]
                  "
                />

              </div>


              <div>

                <label className="block text-gray-300 mb-2">
                  Apellido
                </label>

                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Barboza"
                  className="
                    w-full
                    bg-[#111111]
                    border
                    border-gray-700
                    rounded-xl
                    px-4
                    py-3
                    text-white
                    focus:outline-none
                    focus:border-[#B8860B]
                  "
                />

              </div>

            </div>


            {/* EMAIL */}

            <div>

              <label className="block text-gray-300 mb-2">
                Correo electrónico
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                  focus:outline-none
                  focus:border-[#B8860B]
                "
              />

            </div>


            {/* TELÉFONO */}

            <div>

              <label className="block text-gray-300 mb-2">
                Teléfono
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="88888888"
                className="
                  w-full
                  bg-[#111111]
                  border
                  border-gray-700
                  rounded-xl
                  px-4
                  py-3
                  text-white
                  focus:outline-none
                  focus:border-[#B8860B]
                "
              />

            </div>


            {/* CONTRASEÑA */}

            <div>

              <label className="block text-gray-300 mb-2">
                Contraseña
              </label>


              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 8 caracteres"
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
                    focus:outline-none
                    focus:border-[#B8860B]
                  "
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
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

                  {showPassword ? "🙈" : "👁️"}

                </button>

              </div>

            </div>


            {/* CONFIRMAR CONTRASEÑA */}

            <div>

              <label className="block text-gray-300 mb-2">
                Confirmar contraseña
              </label>


              <div className="relative">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repite tu contraseña"
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
                    focus:outline-none
                    focus:border-[#B8860B]
                  "
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
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
                    showConfirmPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >

                  {showConfirmPassword
                    ? "🙈"
                    : "👁️"
                  }

                </button>

              </div>

            </div>


            {/* ERROR */}

            {error && (

              <div className="
                bg-red-900/30
                border
                border-red-500/40
                text-red-400
                rounded-xl
                p-3
                text-sm
              ">

                {error}

              </div>

            )}


            {/* ÉXITO */}

            {success && (

              <div className="
                bg-green-900/30
                border
                border-green-500/40
                text-green-400
                rounded-xl
                p-3
                text-sm
              ">

                {success}

              </div>

            )}


            {/* BOTÓN */}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                py-4
                mt-4
                rounded-xl
                bg-[#B8860B]
                hover:bg-[#DAA520]
                transition-all
                duration-300
                text-white
                font-bold
                text-lg
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >

              {loading
                ? "Creando cuenta..."
                : "Crear cuenta"
              }

            </button>


          </form>


          {/* LOGIN */}

          <div className="text-center mt-6">

            <p className="text-gray-400">

              ¿Ya tienes una cuenta?{" "}

              <Link
                to="/login"
                className="
                  text-[#B8860B]
                  hover:text-[#DAA520]
                  transition
                "
              >

                Iniciar sesión

              </Link>

            </p>

          </div>


        </div>

      </div>

    </div>

  );

}

export default Register;