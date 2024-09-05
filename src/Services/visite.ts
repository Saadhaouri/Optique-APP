import axios from "axios";

type VisiteBase = {
  fullname: string; // Full name of the client
  telephone: string; // Telephone number of the client
  dateVisite: string; // Date of the visit

  oD_Sphere: string; // Right eye sphere
  oD_Cylinder: string; // Right eye cylinder
  oD_Axis: number; // Right eye axis

  oS_Sphere: string; // Left eye sphere
  oS_Cylinder: string; // Left eye cylinder
  oS_Axis: number; // Left eye axis

  add: number; // Addition
  pd: string; // Pupillary distance

  verreOD: string; // Verre for the right eye
  verreOS: string; // Verre for the left eye

  priceOD: number; // Price for the right eye
  priceOS: number; // Price for the left eye

  prixmonture: number; // Price for the frame

  total: number; // Total amount
  avance: number; // Advance payment
  reste: number; // Remaining balance

  remise: number; // Discount
  doctor: string; // Name of the doctor
};

type Visite = VisiteBase & {
  id: string;
};

const API_URL = "http://localhost:5062/Visite";

export const createVisite = (data: VisiteBase) => {
  return axios.post(API_URL, data);
};

export const updateVisite = (visiteId: string, data: Visite) => {
  return axios.put(`${API_URL}/${visiteId}`, data);
};

export const deleteVisite = (visiteId: string) => {
  return axios.delete(`${API_URL}/${visiteId}`);
};

export const getVisites = () => {
  return axios.get(API_URL);
};

export const getVisiteById = (visiteId: string) => {
  return axios.get(`${API_URL}/${visiteId}`);
};

// New methods

export const getVisitesOfCurrentDay = () => {
  return axios.get(`${API_URL}/current-day`);
};

export const getVisitesOfCurrentWeek = () => {
  return axios.get(`${API_URL}/current-week`);
};

export const getVisitesOfCurrentMonth = () => {
  return axios.get(`${API_URL}/current-month`);
};

export const getClientsDueForVisiteBeforeMonthEnd = () => {
  return axios.get(`${API_URL}/clients-due`);
};

export const getTotalOfCurrentWeek = () => {
  return axios.get(`${API_URL}/total/current-week`);
};

export const getTotalOfCurrentMonth = () => {
  return axios.get(`${API_URL}/total/current-month`);
};

export const getVisiteByClientId = (clientId: string) => {
  return axios.get(`${API_URL}/by-client/${clientId}`);
};
