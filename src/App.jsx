import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Contact from './pages/Contact'
import Services from './pages/Services'

function App() {

  return (

    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/contact" element={<Contact />} />

      <Route path="/services" element={<Services />} />

    </Routes>

  )

}

export default App