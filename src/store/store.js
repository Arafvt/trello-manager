import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import boardsReducer from './boardsSlice';
import columnsReducer from './columnsSlice';
import tasksReducer from './tasksSlice';

const rootReducer = combineReducers({
  boards: boardsReducer,
  columns: columnsReducer,
  tasks: tasksReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});