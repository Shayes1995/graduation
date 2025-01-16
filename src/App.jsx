import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Rootlayout from './rootlayout/Rootlayout';
import Login from './pages/Login';
import Home from './pages/Home';
import { db } from './firebase/configfb';
import Admin from './pages/Admin';
import Register from './pages/Register';
import AdminAddPosts from './pages/AdminAddPosts';
import MyPage from './pages/MyPage';
import AdminSearch from './pages/AdminSearch';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import Candidate from './components/candidate/Candidate';
import DetailsAds from './pages/DetailsAds';

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
        }
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