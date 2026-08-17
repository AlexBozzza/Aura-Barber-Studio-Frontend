import { Navigate } from "react-router-dom";

import {
  isAuthenticated,
  getCurrentUser,
} from "../services/authService";


function ProtectedRoute({ children, role }) {

  // ==========================================
  // COMPROBAR SESIÓN
  // ==========================================

  if (!isAuthenticated()) {

    return <Navigate to="/login" replace />;

  }


  // ==========================================
  // OBTENER USUARIO
  // ==========================================

  const user = getCurrentUser();


  if (!user) {

    return <Navigate to="/login" replace />;

  }


  // ==========================================
  // COMPROBAR ROL
  // ==========================================

  if (role && user.role !== role) {

    if (user.role === "CLIENT") {

      return (
        <Navigate
          to="/appointments"
          replace
        />
      );

    }

    return (
      <Navigate
        to="/"
        replace
      />
    );

  }


  // ==========================================
  // ACCESO PERMITIDO
  // ==========================================

  return children;

}


export default ProtectedRoute;