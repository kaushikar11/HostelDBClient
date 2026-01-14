# Hostel Database - Client (Frontend)

React frontend application for the Hostel Database Management System.

## Project Overview

A comprehensive full-stack application for managing a university hostel database with a professional admin dashboard interface. This is the frontend (client) portion of the application.

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

## Full Project Structure

```
HostelDB/
├── client/                 # React frontend application (this directory)
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── *.js          # Main components
│   │   └── *.css         # Stylesheets
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── util/             # Utility functions
│   ├── app.js            # Main server file
│   └── package.json
└── README.md             # Project documentation
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account (for authentication)
- Backend server running (see `../server/README.md` for setup)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd HostelDB
```

### 2. Install Dependencies

```bash
cd client
npm install
```

### 3. Configure Environment Variables

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

### 4. Start the Backend Server

Before running the client, make sure the backend server is running. See `../server/README.md` for detailed setup instructions.

```bash
cd ../server
npm install
# Create .env file with MongoDB URI and other config
npm start
```

The server should run on `http://localhost:3001`

### 5. Start the Frontend Development Server

```bash
cd ../client
npm start
```

The frontend will run on `http://localhost:3000` and automatically open in your browser.

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
│   ├── hostel-bg.jpeg      # Background image
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
│   ├── AddStudent.js        # Add student form
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

## Design System

### Color Palette
- **Cream Primary**: `#FEF5E7`
- **Cream Light**: `#FEF9E7`
- **Cream Dark**: `#F7DC6F`
- **Dark Red**: `#8B0000`
- **Dark Red Light**: `#A52A2A`
- **Dark Red Dark**: `#5C0000`
- **White**: `#FFFFFF`

### Design Principles
- **Rectangular, Sharp, Compact**: All buttons and cards use sharp corners (no border-radius)
- **Professional University Admin Dashboard**: Clean, organized layout
- **Compartmentalized**: Clear separation of sections and components
- **Responsive**: Mobile-friendly design with breakpoints

The application uses CSS variables defined in `index.css` for theming. All styling follows the cream and dark red color scheme for a professional university admin dashboard look.

## API Integration

The client communicates with the backend server via REST API. See `../server/README.md` for complete API documentation.

### Main API Endpoints Used

- `GET /api/students/read` - Fetch all students
- `POST /api/students/add-student` - Add new student
- `GET /api/students/student/:id` - Get student by ID
- `PUT /api/students/update-student/:id` - Update student
- `DELETE /api/students/delete-student/:id` - Delete student
- `GET /api/images/:rollNo` - Get student profile picture
- `POST /api/images/upload/:rollNo` - Upload student profile picture

## Environment Variables

### Development
```env
REACT_APP_SERVER_URL=http://localhost:3001/api/students
PUBLIC_URL=
```

### Production (Vercel)
Set in Vercel dashboard → Settings → Environment Variables:
- `REACT_APP_SERVER_URL`: Your production server URL
- `REACT_APP_FIREBASE_API_KEY`: Your Firebase API key
- `REACT_APP_FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
- `REACT_APP_FIREBASE_PROJECT_ID`: Your Firebase project ID
- `REACT_APP_FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID
- `REACT_APP_FIREBASE_APP_ID`: Your Firebase app ID
- `REACT_APP_FIREBASE_MEASUREMENT_ID`: Your Firebase measurement ID
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
- Check backend server is running (see `../server/README.md`)
- Verify CORS is configured on server
- Check browser console for errors
- Ensure backend server is accessible at the URL specified in `REACT_APP_SERVER_URL`

### Image Loading Issues
- Verify backend image routes are working
- Check MongoDB GridFS is configured on server
- Verify image URLs are correct
- Check browser Network tab for failed requests

## Development

### Adding New Features

1. **Frontend Components**: Add components in `src/`
2. **Styling**: Use CSS variables defined in `src/index.css`
3. **API Integration**: Use Axios for API calls (see existing components for examples)
4. **Routing**: Add routes in `App.js`

### Code Style

- Use consistent naming conventions
- Add comments for complex logic
- Keep components modular and reusable
- Follow React best practices
- Use CSS variables for theming

### Development Tips

1. **Hot Reload**: Changes automatically reload in development
2. **Console Logs**: Use browser DevTools for debugging
3. **React DevTools**: Install React DevTools browser extension
4. **Network Tab**: Check API calls in browser Network tab
5. **Environment Variables**: Restart dev server after changing `.env` variables

## Security Notes

1. **Environment Variables**: Never commit `.env` files to version control
2. **Firebase Rules**: Configure Firebase Authentication rules properly
3. **API Keys**: Keep Firebase API keys secure (they're safe to expose in client-side code, but follow Firebase security best practices)
4. **HTTPS**: Always use HTTPS in production
5. **CORS**: Server should only allow trusted origins

## License

[Your License Here]

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review server and browser console for errors
3. Check Firebase console for authentication configuration
4. See `../server/README.md` for backend-related issues

## Acknowledgments

- Design inspired by professional university admin dashboards
- Built with modern web technologies
- Color scheme: Cream and Dark Red
