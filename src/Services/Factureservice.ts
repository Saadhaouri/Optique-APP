import axios from "axios";
import { Facture } from "../Types/Facture"; // Import the Facture type

const API_URL = "http://localhost:5062/Facture"; // Adjust the URL if necessary

// Fetch all factures
export const getFactures = async () => {
  const response = await axios.get<Facture[]>(API_URL);
  return response.data;
};

// Fetch a single facture by ID
export const getFactureById = async (id: string) => {
  const response = await axios.get<Facture>(`${API_URL}/${id}`);
  return response.data;
};

// Create a new facture

export const createFacture = async (factureData: Facture) => {
  const response = await axios.post(`${API_URL}`, factureData);
  return response.data;
};

// Update an existing facture
export const updateFacture = async (
  id: string,
  facture: Facture
): Promise<void> => {
  await axios.put(`${API_URL}/${id}`, facture);
};

// Delete a facture by ID
export const deleteFacture = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
