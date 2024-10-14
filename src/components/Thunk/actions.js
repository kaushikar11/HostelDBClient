import { createAction } from '@reduxjs/toolkit';
import Axios from 'axios';
import { db, storage } from '../firebase/firebase'; // Ensure correct Firebase configuration import
import { addDoc, collection, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { generatePDF } from '../functions/generatePDF'; // PDF generation function

// Action creators
export const setAddStudentSuccess = createAction('ADD_STUDENT_SUCCESS');
export const setAddStudentError = createAction('ADD_STUDENT_ERROR');
export const setUploadPhotoSuccess = createAction('UPLOAD_PHOTO_SUCCESS');
export const setUploadPhotoError = createAction('UPLOAD_PHOTO_ERROR');
export const setPDFGenerationSuccess = createAction('PDF_GENERATION_SUCCESS');
export const setPDFGenerationError = createAction('PDF_GENERATION_ERROR');
export const setProgress = createAction('SET_PROGRESS');

// **Missing Login Actions**
export const setLoginSuccess = createAction('SET_LOGIN_SUCCESS');
export const setLoginError = createAction('SET_LOGIN_ERROR');

// Async action to add a student to Firestore and upload a photo
export const addStudent = (formData, selectedFile) => async (dispatch) => {
  try {
    dispatch(setProgress(0)); // Initialize progress

    // Add student details to Firestore
    const studentRef = await addDoc(collection(db, 'students'), formData);
    console.log('Student added successfully to Firestore:', studentRef.id);
    dispatch(setAddStudentSuccess(formData));

    // Handle photo upload if a file is selected
    if (selectedFile) {
      const storageRef = ref(storage, `studentDetails/${formData.rollNo}/photo.jpg`);
      await uploadBytes(storageRef, selectedFile);

      // Get download URL for the photo
      const photoURL = await getDownloadURL(storageRef);

      // Update student document with photo URL
      await updateDoc(doc(db, 'students', studentRef.id), { photoURL });
      dispatch(setUploadPhotoSuccess(photoURL));
    }

    dispatch(setProgress(100)); // Complete progress after successful upload
  } catch (error) {
    console.error('Error adding student:', error);
    dispatch(setAddStudentError(error.message));
  }
};

// **Missing startGeneratingPDF Action**
export const startGeneratingPDF = (payload) => async (dispatch) => {
  try {
    dispatch(setProgress(0)); // Initialize progress

    const result = await dispatch(generatePDF(payload)); // Assuming generatePDF is a thunk action
    if (generatePDF.fulfilled.match(result)) {
      console.log('PDF generated successfully:', result.payload.pdfUrl);
      dispatch(setPDFGenerationSuccess(result.payload.pdfUrl));
    } else {
      console.error('PDF generation failed');
      dispatch(setPDFGenerationError('Failed to generate PDF.'));
    }

    dispatch(setProgress(100)); // Complete progress after PDF generation
  } catch (error) {
    console.error('Error generating PDF:', error);
    dispatch(setPDFGenerationError(error.message));
  }
};

// Action to send student data to your server
export const sendStudentDataToServer = (formData) => async (dispatch) => {
  try {
    const response = await Axios.post(`${process.env.REACT_APP_SERVER_URL}/api/students/add-student`, formData);
    console.log('Student added to server:', response.data);
    dispatch(setAddStudentSuccess(response.data));
  } catch (error) {
    console.error('Error adding student to server:', error);
    dispatch(setAddStudentError(error.message));
  }
};

// Action to update progress
export const updateProgress = (progress) => (dispatch) => {
  dispatch(setProgress(progress));
};
