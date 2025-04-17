import axios from "axios";

const API_URL = "http://localhost:5000/boards";

export const getBoards = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addBoard = async (name) => {
  const response = await axios.post(API_URL, { name });
  return response.data;
};

export const deleteBoard = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

export const updateBoard = async (id, newName) => {
  const response = await axios.patch(`${API_URL}/${id}`, { name: newName });
  return response.data;
};
