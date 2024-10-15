import { configureStore } from '@reduxjs/toolkit';
import appReducer from './Slice'; // Ensure that the reducer is named `app`

const store = configureStore({
  reducer: {
    app: appReducer,  // Ensure the key here is `app`
  },
});

export default store;
