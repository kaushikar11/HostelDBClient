// src/generatePDF.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { latexTemplate } from '../latexTemplate/latexTemplate'; // Import LaTeX template
import { setProgress } from '../pdfThunk/pdfSlice';

export const generatePDF = createAsyncThunk(
  'pdf/generatePDF',
  async ({ imageBlob, student }, { dispatch, rejectWithValue }) => {
    try {
      console.log('Starting PDF generation process...'); // Debug log
      
      // Simulate progress updates
      let simulatedProgress = 0;
      const interval = setInterval(() => {
        simulatedProgress += 10;
        console.log(`Progress: ${simulatedProgress}%`); // Log progress updates
        dispatch(setProgress(simulatedProgress)); // Dispatch progress updates
        
        if (simulatedProgress >= 100) {
          clearInterval(interval);
        }
      }, 300);

      // Use the LaTeX template from the imported file
      const latexContent = latexTemplate(student); // Pass the student data to the template
      console.log('LaTeX content generated:', latexContent); // Log LaTeX content

      const formData = new FormData();
      formData.append('latex', latexContent); // Append LaTeX content
      formData.append('image', imageBlob, 'student-passport-photo.jpg'); // Append image blob

      console.log('Sending request to the API...'); // Debug log
      const response = await fetch('https://latextopdfhosteldb.azurewebsites.net/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(`API request failed with status ${response.status}: ${text}`); // Log error response
        throw new Error(`API request failed with status ${response.status}: ${text}`);
      }

      const pdfBlob = await response.blob();
      clearInterval(interval); // Stop progress interval
      dispatch(setProgress(100)); // Set progress to 100
      console.log('PDF generated successfully.'); // Debug log

      // Create an object URL for the Blob
      const pdfUrl = URL.createObjectURL(pdfBlob);
      return { pdfUrl, student }; // Return the PDF URL and student details
    } catch (error) {
      console.error('Error generating PDF:', error.message); // Log error message
      return rejectWithValue(error.message); // Return error message
    }
  }
);
