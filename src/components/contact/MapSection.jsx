function MapSection(){

return(

<section className="bg-[#111111] py-16">

<div className="max-w-7xl mx-auto">


<h2 className="text-4xl font-bold text-white text-center mb-10">

¿Dónde encontrarnos?

</h2>



<div className="overflow-hidden rounded-xl shadow-lg">


<iframe

src="https://maps.google.com/maps?q=Aura%20Barber%20Studio%20Alajuela&t=&z=15&ie=UTF8&iwloc=&output=embed"

className="w-full h-[500px] border-0"

loading="lazy"

allowFullScreen

referrerPolicy="no-referrer-when-downgrade"

>

</iframe>



</div>



</div>


</section>

)

}

export default MapSection