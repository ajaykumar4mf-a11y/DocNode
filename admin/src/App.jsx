import React, { useContext } from 'react'
import Login from './pages/login'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AdminContext } from './context/AdminContext.jsx'
import Navbar from './components/Navbar.jsx'
import Sidebar from './components/sidebar.jsx'  
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Admin/Dashboard.jsx'
import AddDoctor from './pages/Admin/AddDoctor.jsx'
import DoctorsList from './pages/Admin/DoctorsList.jsx'
import AllAppointment from './pages/Admin/AllAppointment.jsx'

const App = () => {

  const { aToken } = useContext(AdminContext)

  return aToken ? (
    <div className='bg-[#F8F9FD] min-h-screen'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <div className='flex-1 p-4 md:p-8 min-w-0'>
          <Routes>
            <Route path='/' element={<Navigate to='/admin-dashboard' replace />} /> 
            <Route path='/admin-dashboard' element={<Dashboard />} />
            <Route path='/add-doctor' element={<AddDoctor />} />
            <Route path='/doctors-list' element={<DoctorsList />} />
            <Route path='/all-appointment' element={<AllAppointment />} />     
          </Routes>
        </div>
      </div>
    </div>
  ) : (
    <>
      <ToastContainer />
      <Login />
    </>
  )
}

export default App
