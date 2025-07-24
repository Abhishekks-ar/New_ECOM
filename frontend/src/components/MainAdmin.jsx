import React from 'react'
import Navbar from './Navbar'
import AdminDashboard from './AdminDashboard'

const MainAdmin = ({child}) => {
  return (
    <div>
      <AdminDashboard />
      {child}
    </div>
  )
}

export default MainAdmin
