import api from "./api";

// ==========================================
// OBTENER DATOS DEL DASHBOARD
// ==========================================

export const getDashboardData = async () => {

    const response = await api.get(
        "/dashboard"
    );

    return response.data.data;
};