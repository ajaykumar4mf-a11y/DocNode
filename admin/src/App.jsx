import { useContext, useState } from 'react'
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return aToken ? (
    <div className='bg-[#F8FAFC] min-h-screen flex flex-col text-slate-800 antialiased selection:bg-primary/20 selection:text-primary'>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <div className='flex flex-1 w-full'>
        <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        <main className='flex-1 p-4 sm:p-6 lg:p-8 min-w-0 w-full overflow-x-hidden'>
          <Routes>
            <Route path='/' element={<Navigate to='/admin-dashboard' replace />} /> 
            <Route path='/admin-dashboard' element={<Dashboard />} />
            <Route path='/add-doctor' element={<AddDoctor />} />
            <Route path='/doctors-list' element={<DoctorsList />} />
            <Route path='/all-appointment' element={<AllAppointment />} />     
          </Routes>
        </main>
      </div>
    </div>
  ) : (
    <div className='bg-[#F8FAFC] min-h-screen flex items-center justify-center p-4 antialiased'>
      <ToastContainer position="top-right" autoClose={3000} />
      <Login />
    </div>
  )
}

export default App
