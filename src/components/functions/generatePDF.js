// src/generatePDF.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { latexTemplate } from '../latexTemplate/latexTemplate'; // Import LaTeX template
import { setProgress } from '../pdfThunk/pdfSlice';

// src/generatePDF.js
export const generatePDF = createAsyncThunk(
  'pdf/generatePDF',
  async ({ imageBlob, student }, { dispatch, rejectWithValue }) => {
    try {
      console.log('Starting PDF generation process...');

      if (!imageBlob) {
        console.warn('Image not loaded yet.');
        return rejectWithValue('Wait till image is loaded'); // Return custom error message
      }

      // Simulate progress
      let simulatedProgress = 0;
      const interval = setInterval(() => {
        simulatedProgress += 10;
        dispatch(setProgress(simulatedProgress));

        if (simulatedProgress >= 100) {
          clearInterval(interval);
        }
      }, 300);

      const latexContent = latexTemplate(student);
      const formData = new FormData();
      formData.append('latex', latexContent);
      formData.append('image', imageBlob, 'student-passport-photo.jpg');

      console.log('Sending request to the API...');
      const response = await fetch('https://latextopdfhosteldb.azurewebsites.net/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(`API request failed with status ${response.status}: ${text}`);
        throw new Error(`API request failed with status ${response.status}: ${text}`);
      }

      const pdfBlob = await response.blob();
      clearInterval(interval);
      dispatch(setProgress(100));

      const pdfUrl = URL.createObjectURL(pdfBlob);
      return { pdfUrl, student }; // Return PDF URL and student details
    } catch (error) {
      console.error('Error generating PDF:', error.message);
      return rejectWithValue(error.message);
    }
  }
);
