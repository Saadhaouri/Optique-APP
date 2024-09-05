// Services/databaseServices.ts

import axios from "axios";

const API_URL = "http://localhost:5062/Database";

export const backupDatabase = () => {
  return axios.get(`${API_URL}/backup`);
};

export const importDatabase = () => {
  return axios.get(`${API_URL}/import`);
};
