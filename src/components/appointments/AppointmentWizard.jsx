import StepIndicator from "./StepIndicator";

import ServiceSelector from "./ServiceSelector";

function AppointmentWizard(){

return(

<section className="bg-[#111111] py-20">

<div className="max-w-7xl mx-auto px-5">

<StepIndicator/>

<ServiceSelector/>

</div>

</section>

)

}

export default AppointmentWizard;