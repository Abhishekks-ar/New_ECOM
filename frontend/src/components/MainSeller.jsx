import React from 'react'
import Navbar from './Navbar'
import SellerDashboard from './SellerDashboard'

const MainSeller = ({child}) => {
  return (
    <div>
      <SellerDashboard />
      {child}
    </div>
  )
}

export default MainSeller