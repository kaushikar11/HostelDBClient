// src/pdfSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { generatePDF } from '../functions/generatePDF'; // Import the generatePDF thunk

const pdfSlice = createSlice({
  name: 'pdf',
  initialState: {
    progress: 0,
    pdfUrl: null, // Initialize pdfUrl to store the URL
  },
  reducers: {
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generatePDF.fulfilled, (state, action) => {
        state.pdfUrl = action.payload.pdfUrl; // Store the PDF URL
      })
      .addCase(generatePDF.rejected, (state) => {
        state.progress = 0; // Reset progress on error
      });
  },
});

export const { setProgress } = pdfSlice.actions;
export default pdfSlice.reducer;
