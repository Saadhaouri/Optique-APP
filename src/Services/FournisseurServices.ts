import axios from "axios";
import { Fournisseur } from "../Types/Fournisseur";

const API_URL = "http://localhost:5062/Fournisseur";

export const getFournisseurs = async () => {
  const response = await axios.get("http://localhost:5062/Fournisseur");
  return response.data;
};

export const getSupplierById = async (supplierId: string) => {
  const response = await axios.get(`${API_URL}/${supplierId}`);
  return response.data;
};

export const createFournisseur = async (supplierData: Fournisseur) => {
  const response = await axios.post(`${API_URL}`, supplierData);
  return response.data;
};

export const updateFournisseur = async (
  supplierId: string,
  supplierData: Fournisseur
) => {
  const response = await axios.put(`${API_URL}/${supplierId}`, supplierData);
  return response.data;
};

export const deleteFournisseur = async (supplierId: string) => {
  const response = await axios.delete(`${API_URL}/${supplierId}`);
  return response.data;
};
