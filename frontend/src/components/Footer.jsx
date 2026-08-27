import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='md:mx-10 mt-32'>
      <div className='flex flex-col sm:flex-row justify-between items-start gap-10 sm:gap-16 my-10 text-sm text-slate-600'>

        {/* Left Section */}
        <div className='flex-1 max-w-sm flex flex-col items-start gap-4'>
          <img className='w-40 cursor-pointer' src={assets.logo} alt="DocNode logo" />
          <p className='w-full leading-relaxed text-slate-500'>
            DocNode helps you find and book appointments with verified doctors and specialists. Streamlining healthcare scheduling for patients everywhere.
          </p>
        </div>

        {/* Center Section */}
        <div className='flex-1 flex flex-col items-start sm:items-center'>
          <div>
            <p className='text-xs font-bold text-slate-900 tracking-wider uppercase mb-4'>COMPANY</p>
            <ul className='flex flex-col gap-2.5 text-slate-500 font-medium'>
              <li>
                <Link to='/' onClick={() => scrollTo(0, 0)} className='hover:text-primary transition-colors'>
                  Home
                </Link>
              </li>
              <li>
                <Link to='/about' onClick={() => scrollTo(0, 0)} className='hover:text-primary transition-colors'>
                  About us
                </Link>
              </li>
              <li>
                <Link to='/doctors' onClick={() => scrollTo(0, 0)} className='hover:text-primary transition-colors'>
                  All Doctors
                </Link>
              </li>
              <li>
                <Link to='/contact' onClick={() => scrollTo(0, 0)} className='hover:text-primary transition-colors'>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Section */}
        <div className='flex-1 flex flex-col items-start sm:items-end'>
          <div>
            <p className='text-xs font-bold text-slate-900 tracking-wider uppercase mb-4'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-2.5 text-slate-500 font-medium'>
              <li className='hover:text-slate-800 transition-colors'>+1-800-555-0199</li>
              <li>
                <a href="mailto:contact@docnode.com" className='hover:text-primary transition-colors'>
                  contact@docnode.com
                </a>
              </li>
            </ul>
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
