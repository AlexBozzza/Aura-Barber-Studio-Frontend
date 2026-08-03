import api from "./api";

export const getActiveServices = async () => {

  const response = await api.get("/services/active");

  return response.data.data;

};