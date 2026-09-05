import { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  const navigate = useNavigate()

  const { token, setToken, userData } = useContext(AppContext)

  const [showMenu, setShowMenu] = useState(false)

  const logout = () => {  
    setToken(false)
    localStorage.removeItem('token')
    navigate('/')
  } 

  return (
    <div className='sticky top-0 bg-white/95 backdrop-blur-md z-40 flex items-center justify-between text-sm py-4 mb-5 border-b border-slate-100 flex-nowrap'>
      {/* Brand Logo */}
      <img
        onClick={() => navigate('/')}
        className='w-32 sm:w-44 flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity'
        src={assets.logo}
        alt='DocNode logo'
      />

      {/* Desktop Navigation Links */}
      <ul className='hidden md:flex items-center gap-8 font-semibold text-slate-600 text-xs tracking-wider'>
        <NavLink
          to='/'
          className={({ isActive }) =>
            `py-1.5 transition-all relative ${isActive
              ? 'text-primary font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full'
              : 'hover:text-slate-900'
            }`
          }
        >
          <li>HOME</li>
        </NavLink>

        <NavLink
          to='/doctors'
          className={({ isActive }) =>
            `py-1.5 transition-all relative ${isActive
              ? 'text-primary font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full'
              : 'hover:text-slate-900'
            }`
          }
        >
          <li>ALL DOCTORS</li>
        </NavLink>

        <NavLink
          to='/about'
          className={({ isActive }) =>
            `py-1.5 transition-all relative ${isActive
              ? 'text-primary font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full'
              : 'hover:text-slate-900'
            }`
          }
        >
          <li>ABOUT</li>
        </NavLink>

        <NavLink
          to='/contact'
          className={({ isActive }) =>
            `py-1.5 transition-all relative ${isActive
              ? 'text-primary font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full'
              : 'hover:text-slate-900'
            }`
          }
        >
          <li>CONTACT</li>
        </NavLink>
      </ul>

      {/* User Actions & Mobile Hamburger */}
      <div className='flex items-center gap-2.5 sm:gap-4 flex-shrink-0'>
        {token && userData 
        ? (
          <div className='flex items-center gap-2 p-1.5 pl-2 rounded-full border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer group relative'>
            <img
              className='w-8 h-8 rounded-full object-cover object-top border border-slate-100 ring-2 ring-indigo-50 group-hover:ring-primary/20 transition-all flex-shrink-0'
              src={userData.image} 
              alt='User profile'
            />
            <img
              className='w-2.5 opacity-60 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-200 mr-1'
              src={assets.dropdown_icon}
              alt=''
            />

            {/* Hover Dropdown Card */}
            <div className='absolute top-full right-0 pt-2 text-xs font-medium text-slate-700 z-50 hidden group-hover:block'>
              <div className='w-56 bg-white border border-slate-100 shadow-2xl rounded-2xl p-2 flex flex-col gap-0.5'>
                {/* Profile Header snippet */}
                <div className='px-3 py-2.5 border-b border-slate-100 mb-1 bg-slate-50/60 rounded-xl'>
                  <p className='font-bold text-slate-900 text-xs'>Edward Vincent</p>
                  <p className='text-[11px] text-slate-400 font-normal truncate mt-0.5'>edward.vincent@example.com</p>
                </div>

                <p
                  onClick={() => navigate('/my-profile')}
                  className='flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-primary transition-all cursor-pointer font-medium'
                >
                  <span className='text-slate-400 text-xs'>👤</span> My Profile
                </p>

                <p
                  onClick={() => navigate('/my-appointment')}
                  className='flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-primary transition-all cursor-pointer font-medium'
                >
                  <span className='text-slate-400 text-xs'>📅</span> My Appointments
                </p>

                <hr className='border-slate-100 my-1' />

                <p
                  onClick={logout}
                  className='flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer font-semibold'
                >
                  <span className='text-rose-400 text-xs'>🚪</span> Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className='bg-primary hover:bg-primary/90 text-white px-4 py-2 text-xs sm:px-7 sm:py-2.5 sm:text-sm rounded-full font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 active:scale-95 transition-all duration-200 cursor-pointer flex-shrink-0'
          >
            Create Account
          </button>
        )}

        <img
          onClick={() => setShowMenu(true)}
          className='w-6 h-6 md:hidden cursor-pointer flex-shrink-0'
          src={assets.menu_icon}
          alt='Toggle menu'
        />
      </div>

      {/* --------------- Mobile Side Menu Drawer --------------- */}

      {/* Backdrop */}
      {showMenu && (
        <div
          onClick={() => setShowMenu(false)}
          className='md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 transition-opacity'
        />
      )}

      {/* Drawer Panel */}
      <div
        className={`md:hidden fixed top-0 right-0 w-3/4 sm:w-80 h-full bg-white z-50 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out ${showMenu ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div>
          {/* Drawer Header */}
          <div className='flex items-center justify-between pb-5 border-b border-slate-100'>
            <img className='w-32' src={assets.logo} alt='DocNode logo' />
            <button
              onClick={() => setShowMenu(false)}
              className='p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer'
            >
              <img className='w-4 h-4' src={assets.cross_icon} alt='Close menu' />
            </button>
          </div>

          {/* Nav Links */}
          <div className='mt-6'>
            <p className='text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2'>
              Navigation
            </p>
            <ul className='flex flex-col gap-1.5 text-sm font-semibold'>
              <NavLink
                onClick={() => setShowMenu(false)}
                to='/'
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl flex items-center justify-between transition-all ${isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/20 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                <span>HOME</span>
                <span className='text-xs opacity-60'>→</span>
              </NavLink>

              <NavLink
                onClick={() => setShowMenu(false)}
                to='/doctors'
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl flex items-center justify-between transition-all ${isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/20 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                <span>ALL DOCTORS</span>
                <span className='text-xs opacity-60'>→</span>
              </NavLink>

              <NavLink
                onClick={() => setShowMenu(false)}
                to='/about'
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl flex items-center justify-between transition-all ${isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/20 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                <span>ABOUT</span>
                <span className='text-xs opacity-60'>→</span>
              </NavLink>

              <NavLink
                onClick={() => setShowMenu(false)}
                to='/contact'
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl flex items-center justify-between transition-all ${isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/20 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                <span>CONTACT</span>
                <span className='text-xs opacity-60'>→</span>
              </NavLink>
            </ul>
          </div>
        </div>

        {/* Drawer Bottom Actions */}
        {token && (
          <div className='pt-4 border-t border-slate-100 flex flex-col gap-2 text-sm font-semibold'>
            <button
              onClick={() => {
                setShowMenu(false)
                navigate('/my-profile')
              }}
              className='w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors text-left flex items-center justify-between'
            >
              <span>My Profile</span>
              <span className='text-xs text-slate-400'>👤</span>
            </button>

            <button
              onClick={() => {
                setShowMenu(false)
                navigate('/my-appointment')
              }}
              className='w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors text-left flex items-center justify-between'
            >
              <span>My Appointments</span>
              <span className='text-xs text-slate-400'>📅</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar