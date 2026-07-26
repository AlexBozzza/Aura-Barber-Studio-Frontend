import {

FaMapMarkerAlt,
FaPhoneAlt,
FaInstagram,
FaWhatsapp,
FaEnvelope

}

from 'react-icons/fa'


function ContactInfo(){

return(

<section className="bg-[#111111] py-24">


<div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 text-center">



{/* Ubicación */}

<div>

<div className="bg-yellow-600 w-16 h-16 rounded-md flex justify-center items-center mx-auto">

<FaMapMarkerAlt
size={28}
className="text-white"
/>

</div>


<h2 className="text-white text-3xl font-bold mt-8">

UBICACIÓN

</h2>


<p className="text-gray-400 mt-8">

Costado noroeste de

</p>

<p className="text-gray-400">

Pollo Macho

</p>

<p className="text-gray-400">

Alajuela Centro

</p>


</div>




{/* Teléfono */}

<div>

<div className="bg-yellow-600 w-16 h-16 rounded-md flex justify-center items-center mx-auto">

<FaPhoneAlt
size={24}
className="text-white"
/>

</div>


<h2 className="text-white text-3xl font-bold mt-8">

LLÁMANOS

</h2>


<p className="text-gray-400 mt-8">

Costa Rica

</p>

<p className="text-gray-400">

+506 6003-6788

</p>


</div>




{/* Correo y Redes */}

<div>

<div className="bg-yellow-600 w-16 h-16 rounded-md flex justify-center items-center mx-auto">

<FaEnvelope
size={24}
className="text-white"
/>

</div>


<h2 className="text-white text-3xl font-bold mt-8">

ESCRÍBENOS

</h2>


<p className="text-gray-400 mt-8">

andreyjvl1999@gmail.com

</p>



<div className="flex justify-center gap-8 mt-8">


<a

href="https://instagram.com/andrey_thebarber12"

target="_blank"

rel="noopener noreferrer"

>

<FaInstagram

size={35}

className="text-white hover:text-yellow-500 transition"

/>

</a>




<a

href="https://wa.me/50660036788"

target="_blank"

rel="noopener noreferrer"

>

<FaWhatsapp

size={35}

className="text-white hover:text-yellow-500 transition"

/>

</a>


</div>



</div>




</div>


</section>

)

}

export default ContactInfo