// src/pdfSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { generatePDF } from '../functions/generatePDF'; 

const pdfSlice = createSlice({
  name: 'pdf',
  initialState: {
    progress: 0,
    pdfUrl: null, 
  },
  reducers: {
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generatePDF.fulfilled, (state, action) => {
        state.pdfUrl = action.payload.pdfUrl; 
      })
      .addCase(generatePDF.rejected, (state) => {
        state.progress = 0; 
      });
  },
});

export const { setProgress } = pdfSlice.actions;
export default pdfSlice.reducer;
