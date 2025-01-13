import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Rootlayout from './rootlayout/Rootlayout'
import Login from './pages/Login'
import { db } from './firebase/configfb'

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