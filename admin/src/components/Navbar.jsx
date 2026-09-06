import { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import { useNavigate } from 'react-router-dom'

const Navbar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
    const { aToken, setAToken } = useContext(AdminContext)
    const { dToken, setDToken } = useContext(DoctorContext)
    const navigate = useNavigate()

    const logout = () => {
        navigate('/')
        if (aToken) {
            setAToken('')
            localStorage.removeItem('aToken')
        }
        if (dToken) {
            setDToken('')
            localStorage.removeItem('dToken')
        }
    }

    return (
        <header className='sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs'>
            <div className='w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between'>
                {/* Brand & Left Section */}
                <div className='flex items-center gap-3 sm:gap-4'>
                    {/* Mobile Menu Button */}
                    <button
                        type='button'
                        onClick={() => setMobileMenuOpen(prev => !prev)}
                        className='md:hidden p-2 -ml-1 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors cursor-pointer'
                        aria-label='Toggle navigation menu'
                    >
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            {mobileMenuOpen ? (
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                            ) : (
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                            )}
                        </svg>
                    </button>

                    <div 
                        onClick={() => navigate(aToken ? '/admin-dashboard' : '/doctor-dashboard')} 
                        className='flex items-center gap-3 cursor-pointer select-none group'
                    >
                        <img 
                            className='h-8 sm:h-8.5 w-auto object-contain transition-transform group-hover:scale-[1.02]' 
                            src={assets.admin_logo} 
                            alt="DocNode Admin" 
                        />
                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-primary border border-indigo-100/80'>
                            {aToken ? 'Admin' : 'Doctor'} Portal
                        </span>
                    </div>
                </div>

                {/* Right Actions & Profile */}
                <div className='flex items-center gap-3 sm:gap-4'>
                    {/* Status Pill */}
                    <div className='hidden sm:flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80'>
                        <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></span>
                        <span className='font-medium text-slate-700'>{aToken ? 'Admin Active' : 'Doctor Active'}</span>
                    </div>

                    <button 
                        onClick={logout} 
                        className='inline-flex items-center gap-2 bg-slate-900 hover:bg-rose-600 text-white text-xs sm:text-sm px-4 py-2 rounded-xl font-medium transition-all duration-200 cursor-pointer shadow-xs hover:shadow-sm active:scale-95'
                    >
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                        </svg>
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Navbar
