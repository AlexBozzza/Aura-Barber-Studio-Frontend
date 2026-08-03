import api from "./api";

export const getAvailableBarbers = async () => {

  const response = await api.get("/barbers/available");

  return response.data.data;

};