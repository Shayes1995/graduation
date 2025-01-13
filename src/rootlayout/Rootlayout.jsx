import React from 'react'
import Navbar from '../components/universal/Navbar/Navbar'
import Footer from '../components/universal/Footer/Footer'
import { Outlet } from 'react-router'

const Rootlayout = () => {
    return (
        <div>
            <Navbar />
            <div className="outlet">
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default Rootlayout