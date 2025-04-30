import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getTasks, addTask, deleteTask, updateTask, reorderTasks as apiReorderTasks } from '../api/api';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (columnId) => {
  const response = await getTasks(columnId);
  return { columnId, tasks: response };
});

export const createTask = createAsyncThunk('tasks/createTask', async ({ columnId, name }) => {
  const task = await addTask(columnId, name);
  return { ...task, columnId }; 
});

export const removeTask = createAsyncThunk('tasks/removeTask', async (taskId) => {
  await deleteTask(taskId);
  return taskId;
});

export const editTask = createAsyncThunk('tasks/editTask', async ({ taskId, newName }) => {
  return await updateTask(taskId, newName);
});

export const reorderTasks = createAsyncThunk(
  'tasks/reorder',
  async ({ columnId, tasks }) => {
    await apiReorderTasks(columnId, tasks);
    return tasks;
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchTasks.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    })
    .addCase(fetchTasks.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.items = [
        ...state.items.filter(task => String(task.columnId) !== String(action.payload.columnId)),
        ...action.payload.tasks
      ];
    })
    .addCase(fetchTasks.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    })
    .addCase(createTask.fulfilled, (state, action) => {
      state.items.push(action.payload);
    })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.items = state.items.filter(task => task.id !== action.payload);
      })
      .addCase(editTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(reorderTasks.fulfilled, (state, action) => {
        const updatedTasks = action.payload;
        state.items = state.items.map(task => {
          const updatedTask = updatedTasks.find(ut => ut.id === task.id);
          return updatedTask ? { ...task, order: updatedTask.order } : task;
        });
      });
  },
});

export default tasksSlice.reducer;