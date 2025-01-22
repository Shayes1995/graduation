import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Rootlayout from './rootlayout/Rootlayout';
import Login from './pages/Login';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Register from './pages/Register';
import AdminAddPosts from './pages/AdminAddPosts';
import MyPage from './pages/MyPage';
import AdminSearch from './pages/AdminSearch';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import Candidate from './components/candidate/Candidate';
import DetailsAds from './pages/DetailsAds';
import AdminApplications from './pages/AdminApplications';
import Inbox from './pages/Inbox'; // Import Inbox component

import Contact from './pages/Contact';
import About from './pages/About';
import Ai from './pages/Ai';


const App = () => {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Rootlayout />,
      children: [
        {
          path: '/',
          element: <Home />
        },
        {
          path: 'contact',
          element: (
            <Contact />
          )
        },
        {
          path: 'about',
          element: (
            <About />
          )
        },
        {
          path: 'ai',
          element: (
            <Ai />
          )
        },
        {
          path: 'login',
          element: <Login />
        },
        {
          path: 'admin',
          element: <Admin />
        },
        {
          path: 'admin/add-posts',
          element: (
            <ProtectedRoute requiredRole="admin">
              <AdminAddPosts />
            </ProtectedRoute>
          ),
        },
        {
          path: 'admin/search',
          element: (
            <ProtectedRoute requiredRole="admin">
              <AdminSearch />
            </ProtectedRoute>
          ),
        },
        {
          path: 'register',
          element: <Register />
        },
        {
          path: 'my-page',
          element: <MyPage />
        },
        {
          path: 'candidate',
          element: (
            <ProtectedRoute requiredRole="admin">
              <Candidate />
            </ProtectedRoute>
          )
        },
        {
          path: 'admin/applications',
          element: (
            <ProtectedRoute requiredRole="admin">
              <AdminApplications />
            </ProtectedRoute>
          )
        },
        {
          path: 'inbox', // Add route for inbox
          element: <Inbox />
        },
      ]
    }
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;