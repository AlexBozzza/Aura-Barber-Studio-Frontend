import { Link } from 'react-router-dom'

function Navbar() {
  return (

    <nav className="fixed top-0 left-0 w-full z-50">

      <div className="w-full flex items-center justify-between px-20 py-6">


        <h1 className="text-3xl font-bold text-white">

          AuraBarberStudio

        </h1>


        <ul className="flex gap-10 text-white uppercase text-sm tracking-widest">


          <Link
            to="/"
            className="hover:text-yellow-500 transition duration-300"
          >

            Inicio

          </Link>



          <Link
            to="/services"
            className="hover:text-yellow-500 transition duration-300"
          >

            Servicios

          </Link>



          <Link
            to="/appointments"
            className="hover:text-yellow-500 transition duration-300"
          >

            Reservar

          </Link>



          <Link
            to="/contact"
            className="hover:text-yellow-500 transition duration-300"
          >

            Contacto

          </Link>



        </ul>


        <Link
        to="/login"
        className="border border-yellow-500 px-4 py-2 rounded-md text-white hover:bg-yellow-500 hover:text-black transition"
        >

        Iniciar sesión

      </Link>



      </div>


    </nav>

  )
}

export default Navbar