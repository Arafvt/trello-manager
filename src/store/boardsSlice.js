import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getBoards, addBoard, deleteBoard, updateBoard } from '../api/boardsApi';

export const fetchBoards = createAsyncThunk('boards/fetchBoards', async () => {
  return await getBoards();
});

export const createBoard = createAsyncThunk('boards/createBoard', async (name) => {
  return await addBoard(name);
});

export const removeBoard = createAsyncThunk('boards/removeBoard', async (id) => {
  await deleteBoard(id);
  return id;
});

export const editBoard = createAsyncThunk('boards/editBoard', async ({ id, newName }) => {
  return await updateBoard(id, newName);
});

const boardsSlice = createSlice({
  name: 'boards',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeBoard.fulfilled, (state, action) => {
        state.items = state.items.filter(board => board.id !== action.payload);
      })
      .addCase(editBoard.fulfilled, (state, action) => {
        const index = state.items.findIndex(board => board.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default boardsSlice.reducer;