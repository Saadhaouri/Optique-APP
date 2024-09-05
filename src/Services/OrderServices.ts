import axios from "axios";
import { Order } from "../Types/OrderTypes";

const API_URL = "http://localhost:5062/Order";

export const getAllOrders = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getOrderById = async (orderId: string): Promise<Order> => {
  const response = await axios.get(`${API_URL}/${orderId}`);
  return response.data;
};

export const createOrder = async (order: Order) => {
  const response = await axios.post(API_URL, order);
  return response.data;
};

export const updateOrder = async (orderId: string, order: Order) => {
  await axios.put(`${API_URL}/${orderId}`, order);
};

export const deleteOrder = async (orderId: string) => {
  await axios.delete(`${API_URL}/${orderId}`);
};
