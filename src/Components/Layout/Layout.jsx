import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"
import Loader from '../Loader/Loader'

export default function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <Loader />
      <div className="flex-grow-1" style={{ width: "100%", margin: 0, padding: 0 }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

