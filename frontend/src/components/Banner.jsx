import { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Banner = () => {
  const navigate = useNavigate()
  const { token } = useContext(AppContext)

  return (
    <div className='relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-indigo-600 to-slate-900 px-6 sm:px-10 md:px-14 lg:px-16 my-16 sm:my-20 shadow-2xl shadow-indigo-500/15 text-white'>
      
      {/* Background Ambience */}
      <div className='absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none'></div>
      <div className='absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-400/15 rounded-full blur-3xl pointer-events-none'></div>

      <div className='flex flex-col md:flex-row items-center justify-between relative z-10'>
        
        {/* Left Content */}
        <div className='flex-1 py-10 sm:py-14 md:py-16 lg:py-20'>
          <span className='inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-wide uppercase text-indigo-200 mb-4 border border-white/10'>
            Immediate & Scheduled Care
          </span>

          <h2 className='text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight text-white'>
            Ready to Prioritize <br />
            <span className='text-indigo-200 font-normal'>Your Health?</span>
          </h2>
          
          <p className='text-indigo-100/90 text-sm sm:text-base mt-3 max-w-md leading-relaxed'>
            Join thousands of patients who book verified appointments in under two minutes with top medical specialists.
          </p>

          <div className='flex flex-wrap items-center gap-3.5 mt-8'>
            {token ? (
              <>
                <button
                  type='button'
                  onClick={() => {
                    navigate('/doctors')
                    scrollTo(0, 0)
                  }}
                  className='inline-flex items-center gap-2.5 bg-white text-slate-900 text-sm font-semibold px-7 py-3 rounded-full hover:bg-indigo-50 hover:scale-105 active:scale-95 shadow-lg transition-all duration-200 cursor-pointer group'
                >
                  <span>Find a Doctor</span>
                  <img className='w-3 transition-transform duration-200 group-hover:translate-x-1' src={assets.arrow_icon} alt='' />
                </button>
                <button
                  type='button'
                  onClick={() => {
                    navigate('/my-appointment')
                    scrollTo(0, 0)
                  }}
                  className='bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium px-6 py-3 rounded-full transition-all duration-200 cursor-pointer active:scale-95'
                >
                  My Appointments
                </button>
              </>
            ) : (
              <>
                <button
                  type='button'
                  onClick={() => {
                    navigate('/login')
                    scrollTo(0, 0)
                  }}
                  className='inline-flex items-center gap-2.5 bg-white text-slate-900 text-sm font-semibold px-8 py-3 rounded-full hover:bg-indigo-50 hover:scale-105 active:scale-95 shadow-lg transition-all duration-200 cursor-pointer group'
                >
                  <span>Create Free Account</span>
                  <img className='w-3 transition-transform duration-200 group-hover:translate-x-1' src={assets.arrow_icon} alt='' />
                </button>
                <button
                  type='button'
                  onClick={() => {
                    navigate('/doctors')
                    scrollTo(0, 0)
                  }}
                  className='bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium px-6 py-3 rounded-full transition-all duration-200 cursor-pointer active:scale-95'
                >
                  Browse Doctors
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right Graphic */}
        <div className='hidden md:block md:w-5/12 lg:w-[380px] relative self-end'>
          <img
            className='w-full max-w-sm h-auto object-contain drop-shadow-2xl'
            src={assets.appointment_img}
            alt='Appointment booking illustration'
          />
        </div>

      </div>
    </div>
  )
}

export default Banner
