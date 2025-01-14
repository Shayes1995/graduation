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
import MinSida from './pages/MinSida';

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
          path: 'admin/add-posts', // Nu är 'admin' en relativ path
          element: <AdminAddPosts />
        },
        {
          path: 'register', // Nu är 'register' en relativ path
          element: <Register />
        },
        {
          path: 'min-sida',
          element: <MinSida />
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