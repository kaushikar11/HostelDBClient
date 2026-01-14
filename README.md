# Hostel Database - Client (Frontend)

React frontend application for the Hostel Database Management System.

## Overview

This is a React-based single-page application built with Create React App. It provides a professional admin dashboard interface for managing student records in a hostel.

## Features

- **Authentication**: Firebase Authentication for secure login
- **Student Management**: View, add, edit, and delete student records
- **Search**: Real-time search through student records
- **PDF Export**: Generate PDF reports of student details
- **Image Display**: View student profile pictures from MongoDB GridFS
- **Responsive Design**: Works on desktop and mobile devices
- **Protected Routes**: Authentication-required routes for security

## Tech Stack

- **React 18**: UI library
- **React Router DOM**: Client-side routing
- **Firebase**: Authentication
- **Axios**: HTTP client for API calls
- **jsPDF**: PDF generation
- **CSS3**: Custom styling with CSS variables

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account (for authentication)

## Installation

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the `client` directory (you can copy `.env.example` as a template):
   ```env
   # Server API URL
   REACT_APP_SERVER_URL=http://localhost:3001/api/students
   
   # Firebase Configuration
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
   
   # Public URL for assets (leave empty for root deployment)
   PUBLIC_URL=
   ```
   
   **To get Firebase configuration:**
   1. Go to [Firebase Console](https://console.firebase.google.com/)
   2. Select your project
   3. Go to Project Settings → General
   4. Scroll down to "Your apps" and copy the config values
   5. Paste them into your `.env` file
   
   **Note:** All React environment variables must be prefixed with `REACT_APP_` to be accessible in the browser.

## Available Scripts

### `npm start`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

The page will reload when you make changes. You may also see lint errors in the console.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include hashes. Your app is ready to be deployed!

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

Ejects from Create React App, giving you full control over the build configuration.

## Project Structure

```
client/
├── public/
│   ├── index.html          # HTML template
│   ├── hostel-bg.jpeg  # Background image
│   ├── tce-logo.png        # TCE logo
│   └── ...
├── src/
│   ├── components/
│   │   └── ProtectedRoute.js  # Route protection component
│   ├── App.js              # Main app component
│   ├── App.css             # App styles
│   ├── Login.js            # Login page
│   ├── Login.css           # Login styles
│   ├── Navbar.js           # Navigation bar
│   ├── Navbar.css          # Navbar styles
│   ├── Root.js             # Dashboard/home page
│   ├── Root.css            # Dashboard styles
│   ├── AddStudent.js       # Add student form
│   ├── AddStudent.css      # Add student styles
│   ├── StudentDetails.js   # Student details page
│   ├── StudentDetails.css  # Student details styles
│   ├── SearchComponent.js  # Search component
│   ├── firebase.js         # Firebase configuration
│   ├── index.js            # Entry point
│   └── index.css           # Global styles and CSS variables
└── package.json
```

## Key Components

### App.js
Main application component that handles:
- Firebase authentication state
- Routing configuration
- Global background styling

### Login.js
Login page with Firebase email/password authentication.

### Root.js
Main dashboard displaying:
- Student list
- Search functionality
- Navigation to add student

### AddStudent.js
Multi-step form for adding new students with:
- Student information
- Parent/guardian details
- Address information
- Profile picture upload

### StudentDetails.js
Detailed view of a student with:
- All student information
- Profile picture
- PDF export functionality

### ProtectedRoute.js
Route protection component that:
- Checks authentication status
- Redirects to login if not authenticated

## Styling

The application uses CSS variables defined in `index.css` for theming:

```css
--cream-primary: #FEF5E7;
--cream-light: #FEF9E7;
--cream-dark: #F7DC6F;
--dark-red: #8B0000;
--dark-red-light: #A52A2A;
--dark-red-dark: #5C0000;
--white: #FFFFFF;
```

### Design Principles
- **Sharp corners**: No border-radius on buttons/cards
- **Professional look**: University admin dashboard style
- **Color scheme**: Cream and dark red palette
- **Responsive**: Mobile-friendly breakpoints

## Environment Variables

### Development
```env
REACT_APP_SERVER_URL=http://localhost:3001/api/students
PUBLIC_URL=
```

### Production (Vercel)
Set in Vercel dashboard → Settings → Environment Variables:
- `REACT_APP_SERVER_URL`: Your production server URL
- `PUBLIC_URL`: (leave empty for root deployment)

## Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Push code to GitHub
   - Connect repository to Vercel

2. **Configure Build Settings**
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Root Directory: `client`

3. **Set Environment Variables**
   - `REACT_APP_SERVER_URL`: Your server API URL
   - `REACT_APP_FIREBASE_API_KEY`: Your Firebase API key
   - `REACT_APP_FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
   - `REACT_APP_FIREBASE_PROJECT_ID`: Your Firebase project ID
   - `REACT_APP_FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
   - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID
   - `REACT_APP_FIREBASE_APP_ID`: Your Firebase app ID
   - `REACT_APP_FIREBASE_MEASUREMENT_ID`: Your Firebase measurement ID
   - `PUBLIC_URL`: (leave empty)

4. **Deploy**
   - Vercel will auto-deploy on push
   - Or manually trigger deployment

### Other Platforms

The app can be deployed to any static hosting service:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static file hosting

## Troubleshooting

### Build Errors
- Check Node.js version (v14+)
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for syntax errors in console

### Authentication Issues
- Verify Firebase configuration in `.env` file
- Check that all `REACT_APP_FIREBASE_*` variables are set correctly
- Check Firebase console for authentication rules
- Ensure Email/Password authentication is enabled
- Restart the development server after changing `.env` variables (React requires restart to pick up new env vars)

### API Connection Issues
- Verify `REACT_APP_SERVER_URL` is set correctly
- Check backend server is running
- Verify CORS is configured on server
- Check browser console for errors

### Image Loading Issues
- Verify backend image routes are working
- Check MongoDB GridFS is configured
- Verify image URLs are correct

## Development Tips

1. **Hot Reload**: Changes automatically reload in development
2. **Console Logs**: Use browser DevTools for debugging
3. **React DevTools**: Install React DevTools browser extension
4. **Network Tab**: Check API calls in browser Network tab

## License

[Your License Here]
