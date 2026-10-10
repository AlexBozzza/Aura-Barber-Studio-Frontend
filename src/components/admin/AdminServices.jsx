import { useEffect, useState } from "react";
import api from "../../services/api";

function AdminServices() {

  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
    image: "",
  });

  // ==========================================
  // OBTENER SERVICIOS
  // ==========================================

  const fetchServices = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await api.get("/services");

      setServices(response.data.data || []);

    } catch (error) {

      console.error("Error obteniendo servicios:", error);

      setError("No se pudieron cargar los servicios.");

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchServices();

  }, []);


  // ==========================================
  // ABRIR MODAL CREAR
  // ==========================================

  const handleCreate = () => {

    setEditingService(null);

    setForm({
      name: "",
      description: "",
      duration: "",
      price: "",
      image: "",
    });

    setShowModal(true);

  };


  // ==========================================
  // ABRIR MODAL EDITAR
  // ==========================================

  const handleEdit = (service) => {

    setEditingService(service);

    setForm({
      name: service.name || "",
      description: service.description || "",
      duration: service.duration || "",
      price: service.price || "",
      image: service.image || "",
    });

    setShowModal(true);

  };


  // ==========================================
  // CAMBIAR INPUT
  // ==========================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  // ==========================================
  // GUARDAR SERVICIO
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (!form.name || !form.duration || !form.price) {

        alert(
          "Completa el nombre, duración y precio del servicio."
        );

        return;

      }


      if (editingService) {

        await api.put(
          `/services/${editingService.id}`,
          {
            name: form.name,
            description: form.description,
            duration: Number(form.duration),
            price: Number(form.price),
            image: form.image,
          }
        );

        alert("Servicio actualizado correctamente.");

      } else {

        await api.post(
          "/services",
          {
            name: form.name,
            description: form.description,
            duration: Number(form.duration),
            price: Number(form.price),
            image: form.image,
          }
        );

        alert("Servicio creado correctamente.");

      }


      setShowModal(false);

      setEditingService(null);

      await fetchServices();

    } catch (error) {

      console.error("Error guardando servicio:", error);

      alert(
        error.response?.data?.error ||
        "No se pudo guardar el servicio."
      );

    }

  };


  // ==========================================
  // DESACTIVAR
  // ==========================================

  const handleDeactivate = async (id) => {

    const confirmAction = window.confirm(
      "¿Estás seguro de que deseas desactivar este servicio?"
    );

    if (!confirmAction) return;

    try {

      await api.patch(
     `/services/${id}/deactivate`,
     {},
      {
       headers: {
        "Content-Type": "application/json"
       }
      }
);

      await fetchServices();

    } catch (error) {

     console.error(
    "Error desactivando servicio:",
    error
     );

    alert("No se pudo desactivar el servicio.");
    }

  };


  // ==========================================
  // ACTIVAR
  // ==========================================

const handleActivate = async (id) => {

  try {

    await api.patch(
      `/services/${id}/activate`,
      {},
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    await fetchServices();

  } catch (error) {

    console.error(
      "Error activando servicio:",
      error
    );

    console.error(
      "Respuesta del servidor:",
      error.response?.data
    );

    alert(
      error.response?.data?.error ||
      error.response?.data?.message ||
      "No se pudo activar el servicio."
    );
  }
};


  // ==========================================
  // ELIMINAR DEFINITIVAMENTE
  // ==========================================

  const handleDelete = async (id) => {

    const confirmAction = window.confirm(
      "⚠️ ¿Estás seguro de eliminar este servicio definitivamente?\n\nEsta acción no se puede deshacer."
    );

    if (!confirmAction) return;

    try {

      await api.delete(
        `/services/${id}`
      );

      await fetchServices();

    } catch (error) {

      console.error(
        "Error eliminando servicio:",
        error
      );

      alert(
        error.response?.data?.error ||
        "No se pudo eliminar el servicio."
      );

    }

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="py-20 text-center">

        <p className="text-gray-400">
          Cargando servicios...
        </p>

      </div>

    );

  }


  return (

    <div className="w-full">

      {/* ==========================================
          ENCABEZADO
      ========================================== */}

      <div className="
        flex
        flex-col
        md:flex-row
        md:items-center
        md:justify-between
        gap-4
        mb-8
      ">

        <div>

          <h1 className="
            text-3xl
            font-bold
            text-white
          ">
            Servicios
          </h1>

          <p className="
            text-gray-400
            mt-2
          ">
            Administra los servicios disponibles en la barbería.
          </p>

        </div>


        <button
          onClick={handleCreate}
          className="
            bg-[#B8860B]
            hover:bg-[#DAA520]
            text-white
            font-bold
            px-6
            py-3
            rounded-xl
            transition
          "
        >

          + Nuevo servicio

        </button>

      </div>


      {/* ==========================================
          ERROR
      ========================================== */}

      {error && (

        <div className="
          mb-6
          bg-red-900/30
          border
          border-red-700
          text-red-400
          rounded-xl
          p-4
        ">

          {error}

        </div>

      )}


      {/* ==========================================
          CONTADOR
      ========================================== */}

      <div className="
        mb-6
        bg-[#202020]
        border
        border-gray-700
        rounded-2xl
        p-5
      ">

        <p className="text-gray-400 text-sm">
          Total de servicios
        </p>

        <p className="
          text-3xl
          font-bold
          text-[#B8860B]
          mt-1
        ">
          {services.length}
        </p>

      </div>


      {/* ==========================================
          SERVICIOS
      ========================================== */}

      {services.length === 0 ? (

        <div className="
          bg-[#202020]
          border
          border-gray-700
          rounded-2xl
          p-12
          text-center
        ">

          <div className="text-5xl mb-4">
            ✂️
          </div>

          <h2 className="
            text-xl
            font-bold
            text-white
          ">
            No hay servicios
          </h2>

          <p className="
            text-gray-400
            mt-2
          ">
            Crea el primer servicio de la barbería.
          </p>

        </div>

      ) : (

        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-6
        ">

          {services.map((service) => (

            <div
              key={service.id}
              className="
                bg-[#202020]
                border
                border-gray-700
                rounded-2xl
                overflow-hidden
                flex
                flex-col
              "
            >

              {/* IMAGEN */}

              <div className="
                h-48
                bg-[#111111]
                overflow-hidden
              ">

                {service.image ? (

                  <img
                    src={service.image}
                    alt={service.name}
                    className="
                      w-full
                      h-full
                      object-cover
                    "
                  />

                ) : (

                  <div className="
                    w-full
                    h-full
                    flex
                    items-center
                    justify-center
                    text-5xl
                  ">

                    ✂️

                  </div>

                )}

              </div>


              {/* INFORMACIÓN */}

              <div className="p-6 flex-1">

                <div className="
                  flex
                  items-start
                  justify-between
                  gap-3
                ">

                  <h2 className="
                    text-xl
                    font-bold
                    text-white
                  ">
                    {service.name}
                  </h2>


                  {/* ESTADO */}

                  <span
                    className={`
                      px-3
                      py-1.5
                      rounded-full
                      text-xs
                      font-semibold
                      whitespace-nowrap

                      ${
                        Number(service.is_active) === 1
                          ? "bg-green-900/30 text-green-400 border border-green-700"
                          : "bg-red-900/30 text-red-400 border border-red-700"
                      }
                    `}
                  >

                    {Number(service.is_active) === 1
                      ? "Activo"
                      : "Inactivo"
                    }

                  </span>

                </div>


                {/* DESCRIPCIÓN */}

                <p className="
                  text-gray-400
                  text-sm
                  mt-3
                  min-h-[40px]
                ">

                  {service.description ||
                    "Sin descripción."
                  }

                </p>


                {/* DATOS */}

                <div className="
                  mt-6
                  space-y-3
                ">

                  <div className="
                    flex
                    justify-between
                    border-b
                    border-gray-700
                    pb-3
                  ">

                    <span className="text-gray-400">
                      Duración
                    </span>

                    <span className="
                      text-white
                      font-semibold
                    ">

                      {service.duration} min

                    </span>

                  </div>


                  <div className="
                    flex
                    justify-between
                  ">

                    <span className="text-gray-400">
                      Precio
                    </span>

                    <span className="
                      text-[#B8860B]
                      font-bold
                      text-lg
                    ">

                      ₡{Number(service.price).toLocaleString("es-CR")}

                    </span>

                  </div>

                </div>

              </div>


              {/* BOTONES */}

              <div className="
                p-6
                pt-0
                space-y-3
              ">

                <button
                  onClick={() =>
                    handleEdit(service)
                  }
                  className="
                    w-full
                    py-3
                    rounded-xl
                    bg-[#292929]
                    hover:bg-[#333333]
                    text-white
                    font-semibold
                    transition
                  "
                >

                  ✏️ Editar

                </button>


                {Number(service.is_active) === 1 ? (

                  <button
                    onClick={() =>
                      handleDeactivate(service.id)
                    }
                    className="
                      w-full
                      py-3
                      rounded-xl
                      bg-orange-900/20
                      hover:bg-orange-900/40
                      border
                      border-orange-700
                      text-orange-400
                      font-semibold
                      transition
                    "
                  >

                    ⏸️ Desactivar

                  </button>

                ) : (

                  <button
                    onClick={() =>
                      handleActivate(service.id)
                    }
                    className="
                      w-full
                      py-3
                      rounded-xl
                      bg-green-900/20
                      hover:bg-green-900/40
                      border
                      border-green-700
                      text-green-400
                      font-semibold
                      transition
                    "
                  >

                    ▶️ Activar

                  </button>

                )}


                <button
                  onClick={() =>
                    handleDelete(service.id)
                  }
                  className="
                    w-full
                    py-3
                    rounded-xl
                    bg-red-900/20
                    hover:bg-red-900/40
                    border
                    border-red-700
                    text-red-400
                    font-semibold
                    transition
                  "
                >

                  🗑️ Eliminar definitivamente

                </button>

              </div>

            </div>

          ))}

        </div>

      )}


      {/* ==========================================
          MODAL CREAR / EDITAR
      ========================================== */}

      {showModal && (

        <div className="
          fixed
          inset-0
          z-[100]
          bg-black/70
          flex
          items-center
          justify-center
          px-4
        ">

          <div className="
            w-full
            max-w-2xl
            bg-[#202020]
            border
            border-gray-700
            rounded-2xl
            p-8
            max-h-[90vh]
            overflow-y-auto
          ">

            {/* CABECERA */}

            <div className="
              flex
              items-center
              justify-between
              mb-8
            ">

              <div>

                <h2 className="
                  text-2xl
                  font-bold
                  text-white
                ">

                  {editingService
                    ? "Editar servicio"
                    : "Nuevo servicio"
                  }

                </h2>

                <p className="
                  text-gray-400
                  text-sm
                  mt-1
                ">

                  {editingService
                    ? "Modifica la información del servicio."
                    : "Agrega un nuevo servicio a la barbería."
                  }

                </p>

              </div>


              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="
                  text-gray-400
                  hover:text-white
                  text-2xl
                "
              >

                ✕

              </button>

            </div>


            {/* FORMULARIO */}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* NOMBRE */}

              <div>

                <label className="
                  block
                  text-gray-300
                  mb-2
                  font-semibold
                ">

                  Nombre del servicio

                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ej. Protocolo de la Navaja"
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


              {/* DESCRIPCIÓN */}

              <div>

                <label className="
                  block
                  text-gray-300
                  mb-2
                  font-semibold
                ">

                  Descripción

                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe el servicio..."
                  className="
                    w-full
                    bg-[#111111]
                    border
                    border-gray-700
                    rounded-xl
                    px-4
                    py-3
                    text-white
                    resize-none
                    focus:outline-none
                    focus:border-[#B8860B]
                  "
                />

              </div>


              {/* DURACIÓN + PRECIO */}

              <div className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-5
              ">

                <div>

                  <label className="
                    block
                    text-gray-300
                    mb-2
                    font-semibold
                  ">

                    Duración (minutos)

                  </label>

                  <input
                    type="number"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    min="1"
                    placeholder="30"
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

                  <label className="
                    block
                    text-gray-300
                    mb-2
                    font-semibold
                  ">

                    Precio (₡)

                  </label>

                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    placeholder="5000"
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


              {/* IMAGEN */}

              <div>

                <label className="
                  block
                  text-gray-300
                  mb-2
                  font-semibold
                ">

                  Imagen

                </label>

                <input
                  type="text"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="/images/services/servicio.jpg"
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

                <p className="
                  text-gray-500
                  text-xs
                  mt-2
                ">

                  Puedes colocar la ruta de la imagen almacenada en tu proyecto.

                </p>

              </div>


              {/* BOTONES */}

              <div className="
                flex
                flex-col
                md:flex-row
                gap-4
                pt-4
              ">

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="
                    flex-1
                    py-3
                    rounded-xl
                    bg-[#292929]
                    hover:bg-[#333333]
                    text-gray-300
                    font-semibold
                    transition
                  "
                >

                  Cancelar

                </button>


                <button
                  type="submit"
                  className="
                    flex-1
                    py-3
                    rounded-xl
                    bg-[#B8860B]
                    hover:bg-[#DAA520]
                    text-white
                    font-bold
                    transition
                  "
                >

                  {editingService
                    ? "Guardar cambios"
                    : "Crear servicio"
                  }

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );

}

export default AdminServices;