import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()

  return (
    <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-indigo-600 to-slate-900 px-6 sm:px-10 md:px-14 lg:px-16 py-10 sm:py-12 md:py-16 my-4 shadow-2xl shadow-indigo-500/15 text-white'>
      
      {/* Subtle Background Glow Elements */}
      <div className='absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none'></div>
      <div className='absolute -bottom-24 right-1/4 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none'></div>

      <div className='flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 relative z-10'>
        
        {/* Left Content Side */}
        <div className='w-full md:w-7/12 flex flex-col items-start gap-4 sm:gap-6'>
          
          {/* Status Badge */}
          <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-indigo-100'>
            <span className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse'></span>
            <span>Trusted Healthcare Network</span>
          </div>

          {/* Headline */}
          <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] text-white'>
            Healthcare Designed <br />
            <span className='text-indigo-200 font-normal'>Around Your Schedule</span>
          </h1>
          
          {/* Subtitle */}
          <p className='text-indigo-100/90 text-sm sm:text-base font-normal max-w-xl leading-relaxed'>
            Connect with verified medical specialists across disciplines. Browse doctor credentials, view live available slots, and book your consultation in minutes.
          </p>

          {/* Trust Metrics Strip */}
          <div className='flex flex-wrap items-center gap-4 sm:gap-6 py-2 text-xs sm:text-sm text-indigo-100'>
            <div className='flex items-center gap-2.5'>
              <img className='w-16 sm:w-20 object-contain' src={assets.group_profiles} alt='Patient reviews' />
              <div className='text-left'>
                <p className='font-bold text-white text-xs sm:text-sm'>10,000+</p>
                <p className='text-[11px] text-indigo-200'>Satisfied Patients</p>
              </div>
            </div>
            <div className='h-8 w-[1px] bg-white/20 hidden sm:block'></div>
            <div>
              <p className='font-bold text-white text-xs sm:text-sm'>100+ Specialists</p>
              <p className='text-[11px] text-indigo-200'>Certified Doctors</p>
            </div>
            <div className='h-8 w-[1px] bg-white/20 hidden sm:block'></div>
            <div>
              <p className='font-bold text-white text-xs sm:text-sm'>Instant Booking</p>
              <p className='text-[11px] text-indigo-200'>Zero Wait Time</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-wrap items-center gap-3.5 pt-1'>
            <a
              href='#speciality'
              className='inline-flex items-center gap-2.5 bg-white text-slate-900 px-7 py-3 rounded-full text-xs sm:text-sm font-semibold shadow-lg shadow-slate-950/20 hover:bg-indigo-50 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group'
            >
              <span>Find a Doctor</span>
              <img className='w-3 transition-transform duration-200 group-hover:translate-x-1' src={assets.arrow_icon} alt='' />
            </a>

            <button
              type='button'
              onClick={() => { navigate('/doctors'); scrollTo(0, 0) }}
              className='inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer active:scale-95 backdrop-blur-sm'
            >
              <span>View All Doctors</span>
            </button>
          </div>

        </div>

        {/* Right Doctor Image Side */}
        <div className='w-full md:w-5/12 flex items-end justify-center relative self-end pt-4 md:pt-0'>
          <div className='relative w-full max-w-sm md:max-w-md'>
            <img
              className='w-full h-auto object-contain drop-shadow-2xl'
              src={assets.header_img}
              alt='Professional doctors team'
            />
            
            {/* Floating Verified Badge */}
            <div className='absolute bottom-4 left-0 sm:-left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-slate-100 flex items-center gap-3 text-slate-800 animate-fade-in'>
              <div className='w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm'>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
                </svg>
              </div>
              <div className='text-left pr-2'>
                <p className='text-xs font-bold text-slate-900 leading-snug'>Verified Specialists</p>
                <p className='text-[11px] text-slate-500'>100% Licensed & Screened</p>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  )
}

export default Header
