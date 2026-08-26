import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className='flex flex-col md:flex-row bg-gradient-to-r from-primary via-indigo-600 to-indigo-700 rounded-3xl px-5 sm:px-10 md:px-14 lg:px-16 shadow-xl shadow-indigo-500/15 overflow-hidden my-3 sm:my-4'>

      {/* ---------------Left Side----------------- */}
      <div className='md:w-1/2 flex flex-col items-start justify-center gap-3.5 sm:gap-5 py-6 sm:py-10 md:py-[7vw] z-10'>
        <p className='text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-white font-bold leading-tight tracking-tight'>
          Book Appointment <br />
          <span className='text-indigo-100 font-normal'>With Trusted Doctors</span>
        </p>
        
        <div className='flex flex-row items-center gap-3 text-white text-xs sm:text-sm font-light leading-relaxed mt-0.5'>
          <img className='w-20 sm:w-28 flex-shrink-0' src={assets.group_profiles} alt="Group profiles" />
          <p className='text-left'>
            Browse through trusted doctors,<br className='hidden sm:block' />
            schedule your appointment hassle-free.
          </p>
        </div>

        <a 
          href="#speciality" 
          className='flex items-center gap-2.5 bg-white px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full text-gray-700 text-xs sm:text-sm font-medium w-fit shadow-md hover:shadow-lg hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer mt-1'
        >
          Book Appointment 
          <img className='w-2.5 sm:w-3 transition-transform duration-300 group-hover:translate-x-1' src={assets.arrow_icon} alt="" />
        </a>
      </div>
      
      {/* ---------------Right Side------------------ */}
      <div className='hidden sm:flex md:w-1/2 relative items-end justify-center md:justify-end'>
        <img className='w-full max-w-sm md:max-w-lg md:absolute bottom-0 h-auto rounded-b-2xl md:rounded-none object-contain drop-shadow-2xl' src={assets.header_img} alt="Header doctors" />
      </div>
    </div>
  )
}

export default Header
