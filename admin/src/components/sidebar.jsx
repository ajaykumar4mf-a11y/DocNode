import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { aToken } = useContext(AdminContext)

  if (!aToken) return null

  const navItems = [
    {
      to: '/admin-dashboard',
      label: 'Dashboard',
      icon: assets.home_icon,
    },
    {
      to: '/all-appointment',
      label: 'Appointments',
      icon: assets.appointment_icon,
    },
    {
      to: '/add-doctor',
      label: 'Add Doctor',
      icon: assets.add_icon,
    },
    {
      to: '/doctors-list',
      label: 'Doctors List',
      icon: assets.people_icon,
    }
  ]

  const handleNavClick = () => {
    if (setMobileMenuOpen) {
      setMobileMenuOpen(false)
    }
  }

  const sidebarContent = (
    <nav className='flex flex-col h-full py-6 px-3 sm:px-4'>
      <div className='px-3 mb-3'>
        <p className='text-[11px] font-bold uppercase tracking-wider text-slate-400'>Management</p>
      </div>

      <ul className='space-y-1.5'>
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isActive ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-slate-200/70'
                    }`}
                  >
                    <img
                      src={item.icon}
                      alt={item.label}
                      className={`w-4 h-4 object-contain ${isActive ? 'brightness-0 invert' : 'opacity-75'}`}
                    />
                  </span>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Bottom info section */}
      <div className='mt-auto pt-6 px-3 border-t border-slate-100'>
        <div className='bg-slate-50 border border-slate-200/70 rounded-xl p-3 text-xs text-slate-500'>
          <p className='font-semibold text-slate-700'>DocNode Hospital Admin</p>
          <p className='text-[11px] text-slate-400 mt-0.5'>Secure Clinic Management System</p>
        </div>
      </div>
    </nav>
  )

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className='hidden md:block w-64 lg:w-72 bg-white border-r border-slate-200/80 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto'>
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className='fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden transition-opacity duration-300'
        />
      )}

      {/* Mobile Slide-Out Drawer */}
      <aside
        className={`fixed top-16 left-0 bottom-0 z-50 w-72 bg-white border-r border-slate-200 shadow-xl md:hidden transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  )
}

export default Sidebar