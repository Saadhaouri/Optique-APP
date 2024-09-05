// Services/clientServices.ts

import axios from "axios";
import { CreateClient } from "../Types/Client";

const API_URL = "http://localhost:5062/Client";

export const createClient = (data: CreateClient) => {
  return axios.post(API_URL, data);
};

export const updateClient = (clientId: string, data: CreateClient) => {
  return axios.put(`${API_URL}/${clientId}`, data);
};

export const deleteClient = (clientId: string) => {
  return axios.delete(`${API_URL}/${clientId}`);
};

export const getClients = () => {
  return axios.get(API_URL);
};
 
