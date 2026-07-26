import { FaInstagram, FaWhatsapp } from 'react-icons/fa'

function Footer() {

return (

<footer className="bg-[#111111] py-14 border-t border-gray-800">

<div className="max-w-7xl mx-auto px-6">


<div className="grid md:grid-cols-3 gap-12 text-center md:text-left">


{/* Información */}

<div>

<h2 className="text-white text-2xl font-bold">

AuraBarberStudio

</h2>


<p className="text-gray-400 mt-4">

Alajuela, Costa Rica

</p>


<p className="text-gray-400">

+506 6003-6788

</p>

</div>




{/* Horario */}

<div>

<h2 className="text-white text-xl font-semibold">

Horario

</h2>


<div className="text-gray-400 mt-4 space-y-1">

<p>Lunes - Sábado</p>

<p>10:00 AM - 7:00 PM</p>

<p className="mt-2 text-red-400">

Domingo: Cerrado

</p>

</div>

</div>




{/* Redes */}

<div>

<h2 className="text-white text-xl font-semibold">

Síguenos

</h2>


<div className="flex justify-center md:justify-start gap-6 mt-5">


<a

href="https://instagram.com/andrey_thebarber12"

target="_blank"

rel="noopener noreferrer"

>

<FaInstagram

className="text-3xl text-white hover:text-[#B8860B] transition duration-300"

/>

</a>



<a

href="https://wa.me/50660036788"

target="_blank"

rel="noopener noreferrer"

>

<FaWhatsapp

className="text-3xl text-white hover:text-[#B8860B] transition duration-300"

/>

</a>


</div>


</div>



</div>



<div className="border-t border-gray-800 mt-10 pt-6 text-center">

<p className="text-gray-500 text-sm">

© 2026 AuraBarberStudio. Todos los derechos reservados.

</p>

</div>



</div>


</footer>

)

}

export default Footer