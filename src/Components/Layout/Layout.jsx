import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from "../Navbar/Navbar";
import Loader from '../Loader/Loader';
export default function Layout() {
  return (
    <div>
      <Navbar/>
      <Loader />
      <div style={{ width: "100%", margin: 0, padding: 0 }}>
        <Outlet />
      </div>

    </div>
  )
}