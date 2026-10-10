import { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
} from "react-icons/fa";

import api from "../services/api";


// ============================================================
// INPUT DE CONTRASEÑA
// IMPORTANTE: ESTE COMPONENTE ESTÁ FUERA DE Profile()
// para evitar que el input pierda el foco al escribir.
// ============================================================

function PasswordInput({
  name,
  value,
  onChange,
  placeholder,
  visible,
  setVisible,
}) {
  return (
    <div className="relative">

      <input
        type={visible ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full
          bg-[#181818]
          border
          border-gray-700
          rounded-xl
          px-4
          py-3
          pr-12
          text-white
          placeholder-gray-600
          outline-none
          focus:border-[#B8860B]
          transition
        "
      />

      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          text-gray-500
          hover:text-white
          transition
        "
      >
        {visible ? (
          <FaEyeSlash />
        ) : (
          <FaEye />
        )}
      </button>

    </div>
  );
}


// ============================================================
// REQUISITO DE CONTRASEÑA
// ============================================================

function PasswordRequirement({ valid, text }) {
  return (
    <div className="flex items-center gap-2">

      <span
        className={
          valid
            ? "text-green-400"
            : "text-gray-600"
        }
      >
        {valid ? "✓" : "○"}
      </span>

      <span
        className={
          valid
            ? "text-green-400 text-sm"
            : "text-gray-500 text-sm"
        }
      >
        {text}
      </span>

    </div>
  );
}


// ============================================================
// PERFIL
// ============================================================

function Profile() {

  // ============================================================
  // DATOS DEL PERFIL
  // ============================================================

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });


  // ============================================================
  // DATOS DE CONTRASEÑA
  // ============================================================

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });


  // ============================================================
  // VISIBILIDAD DE CONTRASEÑAS
  // ============================================================

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);


  // ============================================================
  // ESTADOS
  // ============================================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  // ============================================================
  // OBTENER PERFIL
  // ============================================================

  useEffect(() => {

    const loadProfile = async () => {

      try {

        const response =
          await api.get("/auth/profile");

        const user =
          response.data.data;

        setFormData({
          first_name:
            user.first_name || "",

          last_name:
            user.last_name || "",

          email:
            user.email || "",

          phone:
            user.phone || "",
        });

      } catch (err) {

        console.error(
          "Error obteniendo perfil:",
          err
        );

        setError(
          err.response?.data?.message ||
          "No se pudo cargar tu perfil."
        );

      } finally {

        setLoading(false);

      }

    };

    loadProfile();

  }, []);


  // ============================================================
  // CAMBIAR INFORMACIÓN PERSONAL
  // ============================================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;

    setFormData((previous) => ({

      ...previous,

      [name]: value,

    }));

  };


  // ============================================================
  // CAMBIAR CONTRASEÑA
  // ============================================================

  const handlePasswordChange = (e) => {

    const {
      name,
      value
    } = e.target;

    setPasswordData((previous) => ({

      ...previous,

      [name]: value,

    }));

  };


  // ============================================================
  // REQUISITOS DE CONTRASEÑA
  // ============================================================

  const passwordRequirements = {

    length:
      passwordData.newPassword.length >= 8 &&
      passwordData.newPassword.length <= 128,

    lowercase:
      /[a-z]/.test(
        passwordData.newPassword
      ),

    uppercase:
      /[A-Z]/.test(
        passwordData.newPassword
      ),

    number:
      /[0-9]/.test(
        passwordData.newPassword
      ),

    special:
      /[@$!%*?&]/.test(
        passwordData.newPassword
      ),

  };


  const isPasswordValid =
    passwordRequirements.length &&
    passwordRequirements.lowercase &&
    passwordRequirements.uppercase &&
    passwordRequirements.number &&
    passwordRequirements.special;


  // ============================================================
  // GUARDAR CAMBIOS
  // ============================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");


    // ----------------------------------------------------------
    // SI QUIERE CAMBIAR CONTRASEÑA
    // ----------------------------------------------------------

    if (passwordData.newPassword) {

      if (!passwordData.currentPassword) {

        setError(
          "Debes introducir tu contraseña actual para cambiarla."
        );

        return;

      }


      if (!isPasswordValid) {

        setError(
          "La nueva contraseña no cumple con los requisitos de seguridad."
        );

        return;

      }


      if (
        passwordData.newPassword !==
        passwordData.confirmPassword
      ) {

        setError(
          "Las nuevas contraseñas no coinciden."
        );

        return;

      }

    }


    // ----------------------------------------------------------
    // GUARDAR
    // ----------------------------------------------------------

    setSaving(true);

    try {

      const payload = {

        first_name:
          formData.first_name,

        last_name:
          formData.last_name,

        email:
          formData.email,

        phone:
          formData.phone,

      };


      // Solo enviar contraseña
      // si realmente se quiere cambiar.

      if (passwordData.newPassword) {

        payload.currentPassword =
          passwordData.currentPassword;

        payload.newPassword =
          passwordData.newPassword;

      }


      const response =
        await api.put(
          "/auth/profile",
          payload
        );


      const updatedUser =
        response.data.data;


      // --------------------------------------------------------
      // ACTUALIZAR FORMULARIO
      // --------------------------------------------------------

      setFormData({

        first_name:
          updatedUser.first_name || "",

        last_name:
          updatedUser.last_name || "",

        email:
          updatedUser.email || "",

        phone:
          updatedUser.phone || "",

      });


      // --------------------------------------------------------
      // LIMPIAR CONTRASEÑAS
      // --------------------------------------------------------

      setPasswordData({

        currentPassword: "",

        newPassword: "",

        confirmPassword: "",

      });


      // --------------------------------------------------------
      // ACTUALIZAR LOCALSTORAGE
      // --------------------------------------------------------

      const storedUser =
        JSON.parse(
          localStorage.getItem("user") || "{}"
        );


      localStorage.setItem(

        "user",

        JSON.stringify({

          ...storedUser,

          ...updatedUser,

        })

      );


      setMessage(
        "Perfil actualizado correctamente."
      );


    } catch (err) {

      console.error(
        "Error actualizando perfil:",
        err
      );


      // --------------------------------------------------------
      // ERRORES DE VALIDACIÓN DEL BACKEND
      // --------------------------------------------------------

      if (
        err.response?.data?.errors &&
        Array.isArray(
          err.response.data.errors
        )
      ) {

        const validationMessages =
          err.response.data.errors
            .map(
              (item) => item.msg
            )
            .filter(Boolean);


        if (
          validationMessages.length > 0
        ) {

          setError(
            validationMessages.join(" ")
          );

          return;

        }

      }


      setError(
        err.response?.data?.message ||
        "No se pudo actualizar tu perfil."
      );

    } finally {

      setSaving(false);

    }

  };


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {

    return (

      <div className="
        min-h-screen
        bg-[#111111]
        text-white
        flex
        items-center
        justify-center
      ">

        <p className="text-gray-400">
          Cargando perfil...
        </p>

      </div>

    );

  }


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <div className="
      min-h-screen
      bg-[#111111]
      text-white
    ">

      <main className="
        max-w-5xl
        mx-auto
        px-6
        pt-32
        pb-20
      ">


        {/* ====================================================
            ENCABEZADO
        ==================================================== */}

        <div className="mb-10">

          <div className="
            flex
            items-center
            gap-4
            mb-3
          ">

            <div className="
              w-14
              h-14
              rounded-full
              bg-[#B8860B]/10
              border
              border-[#B8860B]/30
              flex
              items-center
              justify-center
            ">

              <FaUser className="
                text-[#B8860B]
                text-xl
              " />

            </div>


            <div>

              <h1 className="
                text-3xl
                font-bold
              ">
                Mi perfil
              </h1>

              <p className="
                text-gray-400
                mt-1
              ">
                Administra tu información personal y seguridad.
              </p>

            </div>

          </div>

        </div>


        {/* ====================================================
            MENSAJES
        ==================================================== */}

        {message && (

          <div className="
            mb-6
            flex
            items-center
            gap-3
            bg-green-900/20
            border
            border-green-800
            text-green-400
            rounded-xl
            px-5
            py-4
          ">

            <FaCheckCircle />

            <span>
              {message}
            </span>

          </div>

        )}


        {error && (

          <div className="
            mb-6
            bg-red-900/20
            border
            border-red-800
            text-red-400
            rounded-xl
            px-5
            py-4
          ">

            {error}

          </div>

        )}


        {/* ====================================================
            FORMULARIO
        ==================================================== */}

        <form onSubmit={handleSubmit}>


          {/* ==================================================
              INFORMACIÓN PERSONAL
          ================================================== */}

          <section className="
            bg-[#202020]
            border
            border-gray-700
            rounded-2xl
            p-6
            md:p-8
            mb-6
          ">

            <div className="
              flex
              items-center
              gap-3
              mb-6
            ">

              <FaUser className="
                text-[#B8860B]
              " />

              <div>

                <h2 className="
                  text-xl
                  font-bold
                ">
                  Información personal
                </h2>

                <p className="
                  text-gray-500
                  text-sm
                  mt-1
                ">
                  Actualiza los datos asociados a tu cuenta.
                </p>

              </div>

            </div>


            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-6
            ">


              {/* NOMBRE */}

              <div>

                <label className="
                  block
                  text-sm
                  text-gray-400
                  mb-2
                ">
                  Nombre
                </label>

                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="
                    w-full
                    bg-[#181818]
                    border
                    border-gray-700
                    rounded-xl
                    px-4
                    py-3
                    text-white
                    outline-none
                    focus:border-[#B8860B]
                    transition
                  "
                />

              </div>


              {/* APELLIDO */}

              <div>

                <label className="
                  block
                  text-sm
                  text-gray-400
                  mb-2
                ">
                  Apellido
                </label>

                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="
                    w-full
                    bg-[#181818]
                    border
                    border-gray-700
                    rounded-xl
                    px-4
                    py-3
                    text-white
                    outline-none
                    focus:border-[#B8860B]
                    transition
                  "
                />

              </div>


              {/* EMAIL */}

              <div>

                <label className="
                  block
                  text-sm
                  text-gray-400
                  mb-2
                ">
                  Correo electrónico
                </label>

                <div className="relative">

                  <FaEnvelope className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-600
                  " />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="
                      w-full
                      bg-[#181818]
                      border
                      border-gray-700
                      rounded-xl
                      pl-11
                      pr-4
                      py-3
                      text-white
                      outline-none
                      focus:border-[#B8860B]
                      transition
                    "
                  />

                </div>

              </div>


              {/* TELÉFONO */}

              <div>

                <label className="
                  block
                  text-sm
                  text-gray-400
                  mb-2
                ">
                  Teléfono
                </label>

                <div className="relative">

                  <FaPhone className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-600
                  " />

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="
                      w-full
                      bg-[#181818]
                      border
                      border-gray-700
                      rounded-xl
                      pl-11
                      pr-4
                      py-3
                      text-white
                      outline-none
                      focus:border-[#B8860B]
                      transition
                    "
                  />

                </div>

              </div>

            </div>

          </section>


          {/* ==================================================
              SEGURIDAD
          ================================================== */}

          <section className="
            bg-[#202020]
            border
            border-gray-700
            rounded-2xl
            p-6
            md:p-8
            mb-6
          ">

            <div className="
              flex
              items-center
              gap-3
              mb-2
            ">

              <FaLock className="
                text-[#B8860B]
              " />

              <h2 className="
                text-xl
                font-bold
              ">
                Seguridad
              </h2>

            </div>


            <p className="
              text-gray-500
              text-sm
              mb-6
            ">
              Si no deseas cambiar tu contraseña, deja estos campos vacíos.
            </p>


            <div className="space-y-6">


              {/* CONTRASEÑA ACTUAL */}

              <div>

                <label className="
                  block
                  text-sm
                  text-gray-400
                  mb-2
                ">
                  Contraseña actual
                </label>

                <PasswordInput
                  name="currentPassword"
                  value={
                    passwordData.currentPassword
                  }
                  onChange={
                    handlePasswordChange
                  }
                  placeholder="Tu contraseña actual"
                  visible={
                    showCurrentPassword
                  }
                  setVisible={
                    setShowCurrentPassword
                  }
                />

              </div>


              <div className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-6
              ">


                {/* NUEVA CONTRASEÑA */}

                <div>

                  <label className="
                    block
                    text-sm
                    text-gray-400
                    mb-2
                  ">
                    Nueva contraseña
                  </label>

                  <PasswordInput
                    name="newPassword"
                    value={
                      passwordData.newPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    placeholder="Nueva contraseña"
                    visible={
                      showNewPassword
                    }
                    setVisible={
                      setShowNewPassword
                    }
                  />

                </div>


                {/* CONFIRMAR */}

                <div>

                  <label className="
                    block
                    text-sm
                    text-gray-400
                    mb-2
                  ">
                    Confirmar contraseña
                  </label>

                  <PasswordInput
                    name="confirmPassword"
                    value={
                      passwordData.confirmPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    placeholder="Repite la nueva contraseña"
                    visible={
                      showConfirmPassword
                    }
                    setVisible={
                      setShowConfirmPassword
                    }
                  />

                </div>

              </div>


              {/* ==================================================
                  REQUISITOS
              ================================================== */}

              {passwordData.newPassword && (

                <div className="
                  bg-[#181818]
                  border
                  border-gray-800
                  rounded-xl
                  p-5
                ">

                  <p className="
                    text-sm
                    font-semibold
                    text-gray-300
                    mb-3
                  ">
                    Requisitos de contraseña
                  </p>


                  <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-2
                  ">

                    <PasswordRequirement
                      valid={
                        passwordRequirements.length
                      }
                      text="Entre 8 y 128 caracteres"
                    />

                    <PasswordRequirement
                      valid={
                        passwordRequirements.lowercase
                      }
                      text="Una letra minúscula"
                    />

                    <PasswordRequirement
                      valid={
                        passwordRequirements.uppercase
                      }
                      text="Una letra mayúscula"
                    />

                    <PasswordRequirement
                      valid={
                        passwordRequirements.number
                      }
                      text="Un número"
                    />

                    <PasswordRequirement
                      valid={
                        passwordRequirements.special
                      }
                      text="Un carácter especial (@$!%*?&)"
                    />

                  </div>

                </div>

              )}

            </div>

          </section>


          {/* ==================================================
              GUARDAR
          ================================================== */}

          <div className="
            flex
            justify-end
          ">

            <button
              type="submit"
              disabled={saving}
              className="
                bg-[#B8860B]
                hover:bg-[#9f7408]
                disabled:opacity-50
                disabled:cursor-not-allowed
                text-white
                font-semibold
                px-8
                py-3
                rounded-xl
                transition
              "
            >

              {saving
                ? "Guardando..."
                : "Guardar cambios"}

            </button>

          </div>

        </form>

      </main>

    </div>

  );

}


export default Profile;