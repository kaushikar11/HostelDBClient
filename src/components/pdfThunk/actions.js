// src/actions.js
import { setProgress } from './pdfSlice';
import { generatePDF } from '../functions/generatePDF'; 

// src/actions.js
export const startGeneratingPDF = (payload) => async (dispatch) => {
  try {
    dispatch(setProgress(0)); 
    const result = await dispatch(generatePDF(payload)); 

    if (generatePDF.fulfilled.match(result)) {
      console.log('PDF generated successfully:', result.payload.pdfUrl);
      return result; 
    } else {
      console.error('PDF generation failed');
      return null; 
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    return null; 
  }
};


export const updatePDFProgress = (progress) => (dispatch) => {
  dispatch(setProgress(progress)); 
};
