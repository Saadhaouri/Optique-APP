import axios from "axios";

const API_URL = "http://localhost:5062/Vente"; // Replace with your actual API base URL

interface Vente {
  productId: string;
  quantity: number;
  saleDate: string;
  id: string;
  price: number;
  profit: number;
}

export const getAllVentes = async () => {
  try {
    const response = await axios.get<Vente[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching all ventes:", error);
    throw error;
  }
};

export const getVenteById = async (id: string) => {
  try {
    const response = await axios.get<Vente>(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching vente with ID ${id}:`, error);
    throw error;
  }
};

export const createVente = async (vente: Vente) => {
  try {
    const response = await axios.post(API_URL, vente);
    return response.data;
  } catch (error) {
    console.error("Error creating vente:", error);
    throw error;
  }
};

export const updateVente = async (id: string, vente: Vente) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, vente);
    return response.data;
  } catch (error) {
    console.error(`Error updating vente with ID ${id}:`, error);
    throw error;
  }
};

export const deleteVente = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting vente with ID ${id}:`, error);
    throw error;
  }
};

export const getDailySales = async () => {
  try {
    const response = await axios.get<Vente[]>(`${API_URL}/daily-sales`);
    return response.data;
  } catch (error) {
    console.error("Error fetching daily sales:", error);
    throw error;
  }
};

export const getWeeklySales = async () => {
  try {
    const response = await axios.get<Vente[]>(`${API_URL}/weekly-sales`);
    return response.data;
  } catch (error) {
    console.error("Error fetching weekly sales:", error);
    throw error;
  }
};

export const getMonthlySales = async () => {
  try {
    const response = await axios.get<Vente[]>(`${API_URL}/monthly-sales`);
    return response.data;
  } catch (error) {
    console.error("Error fetching monthly sales:", error);
    throw error;
  }
};

export const getTotalDailyProfit = async () => {
  try {
    const response = await axios.get<number>(`${API_URL}/daily-profit`);
    return response.data;
  } catch (error) {
    console.error("Error fetching daily profit:", error);
    throw error;
  }
};

export const getTotalWeeklyProfit = async () => {
  try {
    const response = await axios.get<number>(`${API_URL}/weekly-profit`);
    return response.data;
  } catch (error) {
    console.error("Error fetching weekly profit:", error);
    throw error;
  }
};

export const getTotalMonthlyProfit = async () => {
  try {
    const response = await axios.get<number>(`${API_URL}/monthly-profit`);
    return response.data;
  } catch (error) {
    console.error("Error fetching monthly profit:", error);
    throw error;
  }
};

export const deleteAllSales = async () => {
  try {
    const response = await axios.delete(`${API_URL}/delete-all`);
    return response.data;
  } catch (error) {
    console.error("Error deleting all sales:", error);
    throw error;
  }
};

export const getMonthlyBenefits = async () => {
  try {
    const response = await axios.get<number>(`${API_URL}/monthly-benefits`);
    return response.data;
  } catch (error) {
    console.error("Error fetching monthly benefits:", error);
    throw error;
  }
};
