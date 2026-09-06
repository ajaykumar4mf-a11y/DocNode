import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate()

  return (
    <footer className='mt-24 sm:mt-32 pt-12 sm:pt-16 border-t border-slate-200/80 text-slate-600'>
      {/* Main Footer Content */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12'>

        {/* Column 1: Brand & Healthcare Mission (5 cols) */}
        <div className='lg:col-span-5 flex flex-col items-start gap-4'>
          <img
            onClick={() => {
              navigate('/')
              scrollTo(0, 0)
            }}
            className='w-36 sm:w-40 cursor-pointer object-contain'
            src={assets.logo}
            alt='DocNode logo'
          />

          <p className='text-sm text-slate-500 leading-relaxed max-w-sm'>
            DocNode is a digital healthcare platform dedicated to simplifying doctor discovery and appointment booking. Empowering patients with instant access to licensed medical professionals.
          </p>

          <div className='flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full'>
            <span className='w-2 h-2 rounded-full bg-emerald-500'></span>
            <span>256-bit SSL Secure & Encrypted</span>
          </div>
        </div>

        {/* Column 2: Navigation Links (3 cols) */}
        <div className='lg:col-span-3'>
          <p className='text-xs font-bold text-slate-900 tracking-wider uppercase mb-4'>
            Explore
          </p>
          <ul className='flex flex-col gap-2.5 text-sm text-slate-500'>
            <li>
              <Link to='/' onClick={() => scrollTo(0, 0)} className='hover:text-primary transition-colors'>
                Home
              </Link>
            </li>
            <li>
              <Link to='/doctors' onClick={() => scrollTo(0, 0)} className='hover:text-primary transition-colors'>
                Find Doctors
              </Link>
            </li>
            <li>
              <Link to='/about' onClick={() => scrollTo(0, 0)} className='hover:text-primary transition-colors'>
                About Us
              </Link>
            </li>
            <li>
              <Link to='/contact' onClick={() => scrollTo(0, 0)} className='hover:text-primary transition-colors'>
                Contact
              </Link>
            </li>
            <li>
              <Link to='/my-appointment' onClick={() => scrollTo(0, 0)} className='hover:text-primary transition-colors'>
                My Appointments
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact & Patient Assistance (4 cols) */}
        <div className='lg:col-span-4 flex flex-col gap-3'>
          <p className='text-xs font-bold text-slate-900 tracking-wider uppercase mb-1'>
            Patient Support
          </p>

          <div className='flex items-start gap-2.5 text-sm text-slate-500'>
            <svg className='w-4 h-4 text-slate-400 mt-0.5 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.8' d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
            </svg>
            <div>
              <p className='font-semibold text-slate-800'>+1-800-555-0199</p>
              <p className='text-xs text-slate-400'>Toll-free customer line</p>
            </div>
          </div>

          <div className='flex items-start gap-2.5 text-sm text-slate-500'>
            <svg className='w-4 h-4 text-slate-400 mt-0.5 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.8' d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
            </svg>
            <div>
              <a href='mailto:support@docnode.com' className='text-primary hover:underline font-medium'>
                support@docnode.com
              </a>
              <p className='text-xs text-slate-400'>Response within 24 hours</p>
            </div>
          </div>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className='border-t border-slate-100 py-6 text-xs text-center text-slate-400 font-medium'>
        Copyright 2026 @ DocNode - All Rights Reserved.
      </div>
    </footer>
  )
}

export default Footer
