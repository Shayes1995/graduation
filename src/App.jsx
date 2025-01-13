import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Rootlayout from './rootlayout/Rootlayout'
import Login from './pages/Login'
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