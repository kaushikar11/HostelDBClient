// src/store.js

import { configureStore } from '@reduxjs/toolkit';
import pdfReducer from './pdfSlice';

const store = configureStore({
  reducer: {
    pdf: pdfReducer,
    // other reducers can be added here
  },
});

export default store;
