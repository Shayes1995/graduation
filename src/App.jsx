import React from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import "./index.css";
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Rootlayout from './rootlayout/Rootlayout'
import Login from './pages/Login'
import Home from './pages/Home'
import { db } from './firebase/configfb'
import Admin from './pages/Admin'
import Register from './pages/Register'

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
          path: '/login',
          element: <Login />
        },
        {
          path: '/admin',
          element: <Admin />
        },
        {
          path: '/register',
          element: <Register />
        }


      ]
    }
  ])
  return (
    <div>
      < RouterProvider router={router} />
    </div>
  )
}

export default App