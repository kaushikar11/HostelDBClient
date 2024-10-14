import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  progress: 0,
  pdfUrl: null,
  userEmail: null, 
  loginError: null,  // Ensure this is part of the initial state
  studentData: null,
  photoURL: null,
  error: null,
};

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    setLoginSuccess: (state, action) => {
      state.userEmail = action.payload;
      state.loginError = null;  // Reset error on login success
    },
    setLoginError: (state, action) => {
      state.loginError = action.payload;  // Set login error on failure
    },
    setAddStudentSuccess: (state, action) => {
      state.studentData = action.payload;
      state.error = null;
    },
    setAddStudentError: (state, action) => {
      state.error = action.payload;
    },
    setUploadPhotoSuccess: (state, action) => {
      state.photoURL = action.payload;
      state.error = null;
    },
    setUploadPhotoError: (state, action) => {
      state.error = action.payload;
    },
    setPDFGenerationSuccess: (state, action) => {
      state.pdfUrl = action.payload;
      state.error = null;
    },
    setPDFGenerationError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setProgress, 
  setLoginSuccess, 
  setLoginError, 
  setAddStudentSuccess, 
  setAddStudentError, 
  setUploadPhotoSuccess, 
  setUploadPhotoError, 
  setPDFGenerationSuccess, 
  setPDFGenerationError 
} = slice.actions;

export default slice.reducer;
