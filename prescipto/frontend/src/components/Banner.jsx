import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
  const navigate = useNavigate()

  return (
    <div className='flex flex-col md:flex-row bg-gradient-to-r from-primary via-indigo-600 to-indigo-700 rounded-3xl px-6 sm:px-10 md:px-14 lg:px-16 my-20 md:mx-10 shadow-2xl shadow-indigo-500/20 overflow-hidden relative'>
      {/* --------------- Left Side --------------- */}
      <div className='flex-1 py-12 sm:py-16 md:py-20 lg:py-24 z-10'>
        <h2 className='text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight'>
          Book Appointment
          <span className='block text-indigo-100 font-normal mt-1'>
            With 100+ Trusted Doctors
          </span>
        </h2>
        
        <p className='text-indigo-100 text-sm sm:text-base mt-4 font-light max-w-md leading-relaxed'>
          Get top medical advice and instant booking with zero waiting time.
        </p>

        <button 
          onClick={() => { navigate('/login'); scrollTo(0, 0) }} 
          className='bg-white text-gray-800 text-sm sm:text-base font-medium px-8 py-3.5 rounded-full mt-8 hover:bg-gray-50 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-900/20 transition-all duration-300 cursor-pointer'
        >
          Create Account
        </button>
      </div>

      {/* --------------- Right Side --------------- */}
      <div className='hidden md:block md:w-1/2 lg:w-[370px] relative'>
        <img 
          className='w-full md:absolute bottom-0 right-0 max-w-md h-auto object-contain drop-shadow-2xl' 
          src={assets.appointment_img} 
          alt="Book appointment banner" 
        />
      </div>
    </div>
  )
}

export default Banner
