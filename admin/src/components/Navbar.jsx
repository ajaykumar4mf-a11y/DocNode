import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

    const { aToken, setAToken } = useContext(AdminContext)
    const navigate = useNavigate()

    const logout = () => {
        navigate('/')
        if (aToken) {
            setAToken('')
            localStorage.removeItem('aToken')
        }
    }

    return (
        <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white border-zinc-200'>
            <div className='flex items-center gap-2 text-xs'>
                <img className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="DocNode Admin Logo" />
                <p className='border px-2.5 py-0.5 rounded-full border-zinc-500 text-zinc-600 font-medium'>
                    {aToken ? 'Admin' : 'Doctor'}
                </p>
            </div>
            <button 
                onClick={logout} 
                className='bg-primary hover:bg-primary/90 text-white text-sm px-10 py-2 rounded-full font-medium transition-colors cursor-pointer shadow-sm'
            >
                Logout
            </button>
        </div>
    )
}

export default Navbar
