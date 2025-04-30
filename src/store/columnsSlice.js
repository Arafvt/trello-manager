import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getColumns, addColumn, deleteColumn, updateColumn, reorderColumns as apiReorderColumns } from '../api/api';

export const fetchColumns = createAsyncThunk('columns/fetchColumns', async (boardId) => {
  const response = await getColumns(boardId);
  return response;
});

export const createColumn = createAsyncThunk('columns/createColumn', async ({ boardId, name }) => {
  return await addColumn(boardId, name);
});

export const removeColumn = createAsyncThunk('columns/removeColumn', async (columnId) => {
  await deleteColumn(columnId);
  return columnId;
});

export const editColumn = createAsyncThunk('columns/editColumn', async ({ columnId, newName }) => {
  return await updateColumn(columnId, newName);
});

export const reorderColumns = createAsyncThunk(
  'columns/reorder',
  async ({ boardId, columns }) => {
    await apiReorderColumns(boardId, columns); 
    return columns;
  }
);

const columnsSlice = createSlice({
  name: 'columns',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchColumns.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchColumns.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchColumns.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createColumn.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeColumn.fulfilled, (state, action) => {
        state.items = state.items.filter(column => column.id !== action.payload);
      })
      .addCase(editColumn.fulfilled, (state, action) => {
        const index = state.items.findIndex(column => column.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(reorderColumns.fulfilled, (state, action) => {
        const updatedColumns = action.payload;
        state.items = state.items.map(col => {
          const updatedCol = updatedColumns.find(uc => uc.id === col.id);
          return updatedCol ? { ...col, order: updatedCol.order } : col;
        });
      });
  },
});

export default columnsSlice.reducer;