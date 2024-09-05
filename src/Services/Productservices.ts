import axios from "axios";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  priceForSale: number;
  quantity: number;
  categoryID: string;
  fournisseurId: string;

  // Include other properties if necessary
};

const API_URL = "http://localhost:5062/Product";

export const getAllProducts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createProduct = async (product: Product) => {
  const response = await axios.post(API_URL, product);
  return response.data;
};

export const updateProduct = async (id: string, product: Product) => {
  await axios.put(`${API_URL}/${id}`, product);
};

export const deleteProduct = async (id: string) => {
  await axios.delete(`${API_URL}/${id}`);
};
