import axios from "axios";

const API_URL = "http://localhost:5000";

export default axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// === Columns API ===
export const getColumns = async (boardId) => {
  const response = await axios.get(`${API_URL}/columns`, { params: { boardId: String(boardId) } });
  return response.data;
};

export const addColumn = async (boardId, name) => {
  const response = await axios.post(`${API_URL}/columns`, { boardId: String(boardId), name });
  return response.data;
};

export const deleteColumn = async (columnId) => {
  await axios.delete(`${API_URL}/columns/${columnId}`);
};

export const updateColumn = async (columnId, newName) => {
  const response = await axios.patch(`${API_URL}/columns/${columnId}`, { name: newName });
  return response.data;
};

export const reorderColumns = async (boardId, columns) => {
  const response = await axios.post(`${API_URL}/columns/reorder`, { 
    boardId: String(boardId),
    columns: columns.map(col => ({
      id: String(col.id),
      order: col.order
    }))
  });
  return response.data;
};

// === Tasks API ===
export const getTasks = async (columnId) => {
  const response = await axios.get(`${API_URL}/tasks`, { params: { columnId: String(columnId) } });
  return response.data;
};

export const addTask = async (columnId, name) => {
  const response = await axios.post(`${API_URL}/tasks`, { columnId: String(columnId), name });
  return response.data;
};

export const deleteTask = async (taskId) => {
  await axios.delete(`${API_URL}/tasks/${taskId}`);
};

export const updateTask = async (taskId, newName) => {
  const response = await axios.patch(`${API_URL}/tasks/${taskId}`, { name: newName });
  return response.data;
};

export const reorderTasks = async (columnId, tasks) => {
  const response = await axios.post(`${API_URL}/tasks/reorder`, {
    columnId: String(columnId),
    tasks
  });
  return response.data;
};