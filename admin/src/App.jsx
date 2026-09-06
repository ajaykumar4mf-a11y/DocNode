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
import { DoctorContext } from './context/DoctorContext.jsx'
import DoctorDashboard from './pages/Doctor/DoctorDashboard.jsx'
import DoctorAppointments from './pages/Doctor/DoctorAppointments.jsx'
import DoctorProfile from './pages/Doctor/DoctorProfile.jsx'

const App = () => {
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return aToken || dToken ? (
    <div className='bg-[#F8FAFC] min-h-screen flex flex-col text-slate-800 antialiased selection:bg-primary/20 selection:text-primary'>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <div className='flex flex-1 w-full'>
        <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        <main className='flex-1 p-4 sm:p-6 lg:p-8 min-w-0 w-full overflow-x-hidden'>
          <Routes>
            {/* Default Route */}
            <Route path='/' element={<Navigate to={aToken ? '/admin-dashboard' : '/doctor-dashboard'} replace />} />
            {/* Admin Routes */}
            <Route path='/admin-dashboard' element={<Dashboard />} />
            <Route path='/add-doctor' element={<AddDoctor />} />
            <Route path='/doctors-list' element={<DoctorsList />} />
            <Route path='/all-appointment' element={<AllAppointment />} />

            {/* Doctor Routes */}
            <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
            <Route path='/doctor-appointments' element={<DoctorAppointments />} />
            <Route path='/doctor-profile' element={<DoctorProfile />} />

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
