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
          path: 'login', // Nu är 'login' en relativ path
          element: <Login />
        },
        {
          path: 'admin', // Nu är 'admin' en relativ path
          element: <Admin />
        },
        {
          path: 'register', // Nu är 'register' en relativ path
          element: <Register />
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
