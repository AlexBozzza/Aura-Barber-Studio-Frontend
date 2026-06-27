import heroImage from '../../assets/hero.png'

function Hero() {

return(

<section

className="relative h-screen bg-cover bg-center"

style={{backgroundImage:`url(${heroImage})`}}


>

<div className="absolute inset-0 bg-black/70"/>


<div className="relative z-10 flex flex-col items-center justify-center h-full">


<h1 className="text-7xl font-bold text-white">

AuraBarberStudio

</h1>


<p className="mt-5 text-xl text-gray-300">

Experiencia premium en cada corte


</p>



<button className="mt-10 bg-yellow-600 hover:bg-yellow-500 px-8 py-4 rounded-md text-white text-lg">


Reservar cita


</button>



</div>



</section>



)

}

export default Hero