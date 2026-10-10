import { useEffect, useState } from "react";
import api from "../../services/api";

function AdminProfile() {

  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

        const response = await api.get("/auth/profile");

        const data = response.data.data;

        setUser(data);

        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone: data.phone || ""
        });

      } catch (err) {

        console.error("Error obteniendo perfil:", err);

        setError(
          err.response?.data?.message ||
          "No se pudo cargar el perfil."
        );

      } finally {

        setLoading(false);

      }

    };

    loadProfile();

  }, []);


  // ============================================================
  // CAMBIAR DATOS DEL FORMULARIO
  // ============================================================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  // ============================================================
  // CAMBIAR CONTRASEÑA
  // ============================================================

  const handlePasswordChange = (e) => {

    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });

    // Limpiar error mientras escribe
    if (error) {
      setError("");
    }

  };


  // ============================================================
  // VALIDAR CONTRASEÑA
  // ============================================================

  const validatePassword = () => {

    const errors = [];

    const {
      currentPassword,
      newPassword,
      confirmPassword
    } = passwordData;


    // Si no quiere cambiar contraseña
    if (
      !currentPassword &&
      !newPassword &&
      !confirmPassword
    ) {

      return errors;

    }


    // Debe introducir contraseña actual
    if (!currentPassword) {

      errors.push(
        "Debes introducir tu contraseña actual."
      );

    }


    // Debe introducir nueva contraseña
    if (!newPassword) {

      errors.push(
        "Debes introducir una nueva contraseña."
      );

    }


    // Validaciones de nueva contraseña
    if (newPassword) {

      if (newPassword.length < 8) {

        errors.push(
          "La nueva contraseña debe tener al menos 8 caracteres."
        );

      }

      if (!/[A-Z]/.test(newPassword)) {

        errors.push(
          "La nueva contraseña debe contener al menos una letra mayúscula."
        );

      }

      if (!/[a-z]/.test(newPassword)) {

        errors.push(
          "La nueva contraseña debe contener al menos una letra minúscula."
        );

      }

      if (!/[0-9]/.test(newPassword)) {

        errors.push(
          "La nueva contraseña debe contener al menos un número."
        );

      }

    }


    // Confirmación
    if (
      newPassword &&
      confirmPassword !== newPassword
    ) {

      errors.push(
        "Las nuevas contraseñas no coinciden."
      );

    }


    return errors;

  };


  // ============================================================
  // GUARDAR PERFIL
  // ============================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");


    // ============================================================
    // VALIDAR CONTRASEÑA ANTES DE ENVIAR
    // ============================================================

    const passwordErrors = validatePassword();

    if (passwordErrors.length > 0) {

      setError(
        passwordErrors.join(" ")
      );

      return;

    }


    setSaving(true);


    try {

      const payload = {

        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone

      };


      // Solo enviar contraseña si quiere cambiarla
      if (passwordData.newPassword) {

        payload.currentPassword =
          passwordData.currentPassword;

        payload.newPassword =
          passwordData.newPassword;

      }


      const response = await api.put(
        "/auth/profile",
        payload
      );


      const updatedUser = response.data.data;

      setUser(updatedUser);


      setFormData({

        first_name:
          updatedUser.first_name || "",

        last_name:
          updatedUser.last_name || "",

        email:
          updatedUser.email || "",

        phone:
          updatedUser.phone || ""

      });


      // Limpiar contraseña
      setPasswordData({

        currentPassword: "",
        newPassword: "",
        confirmPassword: ""

      });


      // Ocultar contraseñas
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);


      // Actualizar usuario guardado en localStorage

      const storedUser =
        JSON.parse(
          localStorage.getItem("user") || "{}"
        );


      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          ...updatedUser
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


      /*
       * Intentamos mostrar el mensaje específico
       * enviado por el backend.
       */

      const backendMessage =
        err.response?.data?.message;


      if (backendMessage) {

        setError(backendMessage);

      } else {

        setError(
          "No se pudo actualizar el perfil."
        );

      }

    } finally {

      setSaving(false);

    }

  };


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {

    return (

      <div className="text-gray-400">

        Cargando perfil...

      </div>

    );

  }


  return (

    <div className="max-w-4xl">


      {/* ========================================================
          TÍTULO
      ======================================================== */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-white">
          Mi perfil
        </h1>

        <p className="text-gray-400 mt-2">
          Administra tu información personal y seguridad.
        </p>

      </div>


      {/* ========================================================
          MENSAJE DE ÉXITO
      ======================================================== */}

      {message && (

        <div className="
          mb-6
          bg-green-900/20
          border
          border-green-800
          text-green-400
          rounded-xl
          px-5
          py-4
        ">

          {message}

        </div>

      )}


      {/* ========================================================
          MENSAJE DE ERROR
      ======================================================== */}

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

          <p className="font-semibold mb-1">
            No se pudo actualizar el perfil
          </p>

          <p className="text-sm">
            {error}
          </p>

        </div>

      )}


      {/* ========================================================
          FORMULARIO
      ======================================================== */}

      <form onSubmit={handleSubmit}>


        {/* ======================================================
            INFORMACIÓN PERSONAL
        ====================================================== */}

        <div className="
          bg-[#202020]
          border
          border-gray-700
          rounded-2xl
          p-8
          mb-6
        ">

          <h2 className="
            text-xl
            font-bold
            text-white
            mb-6
          ">
            Información personal
          </h2>


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
                  px-4
                  py-3
                  text-white
                  outline-none
                  focus:border-[#B8860B]
                "
              />

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
                  px-4
                  py-3
                  text-white
                  outline-none
                  focus:border-[#B8860B]
                "
              />

            </div>

          </div>

        </div>


        {/* ======================================================
            SEGURIDAD
        ====================================================== */}

        <div className="
          bg-[#202020]
          border
          border-gray-700
          rounded-2xl
          p-8
          mb-6
        ">

          <h2 className="
            text-xl
            font-bold
            text-white
            mb-2
          ">
            Seguridad
          </h2>

          <p className="
            text-gray-500
            text-sm
            mb-6
          ">
            Si no deseas cambiar tu contraseña, deja estos campos vacíos.
          </p>


          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6
          ">


            {/* ==================================================
                CONTRASEÑA ACTUAL
            ================================================== */}

            <div className="md:col-span-2">

              <label className="
                block
                text-sm
                text-gray-400
                mb-2
              ">
                Contraseña actual
              </label>


              <div className="relative">

                <input
                  type={
                    showCurrentPassword
                      ? "text"
                      : "password"
                  }
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Necesaria para cambiar contraseña"
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
                    outline-none
                    focus:border-[#B8860B]
                  "
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword(
                      !showCurrentPassword
                    )
                  }
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                    hover:text-white
                    transition
                  "
                  aria-label={
                    showCurrentPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >
                  {showCurrentPassword ? "🙈" : "👁️"}
                </button>

              </div>

            </div>


            {/* ==================================================
                NUEVA CONTRASEÑA
            ================================================== */}

            <div>

              <label className="
                block
                text-sm
                text-gray-400
                mb-2
              ">
                Nueva contraseña
              </label>


              <div className="relative">

                <input
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Nueva contraseña"
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
                    outline-none
                    focus:border-[#B8860B]
                  "
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword(
                      !showNewPassword
                    )
                  }
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                    hover:text-white
                    transition
                  "
                  aria-label={
                    showNewPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >
                  {showNewPassword ? "🙈" : "👁️"}
                </button>

              </div>

            </div>


            {/* ==================================================
                CONFIRMAR CONTRASEÑA
            ================================================== */}

            <div>

              <label className="
                block
                text-sm
                text-gray-400
                mb-2
              ">
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
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Repite la nueva contraseña"
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
                    outline-none
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
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                    hover:text-white
                    transition
                  "
                  aria-label={
                    showConfirmPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>

              </div>

            </div>


          </div>

        </div>


        {/* ======================================================
            GUARDAR
        ====================================================== */}

        <div className="flex justify-end">

          <button
            type="submit"
            disabled={saving}
            className="
              bg-[#B8860B]
              hover:bg-[#9f7408]
              disabled:opacity-50
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
              : "Guardar cambios"
            }

          </button>

        </div>


      </form>

    </div>

  );

}


export default AdminProfile;