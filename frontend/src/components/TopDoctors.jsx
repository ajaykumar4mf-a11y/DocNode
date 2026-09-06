import { useContext, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopDoctors = () => {
  const navigate = useNavigate()
  const { doctors, currencySymbol } = useContext(AppContext)
  const [selectedSpeciality, setSelectedSpeciality] = useState('All')

  const specialities = [
    'All',
    'General physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatricians',
    'Neurologist',
    'Gastroenterologist'
  ]

  const filteredDoctors = useMemo(() => {
    if (selectedSpeciality === 'All') {
      return doctors.slice(0, 8)
    }
    return doctors.filter(doc => doc.speciality === selectedSpeciality).slice(0, 8)
  }, [doctors, selectedSpeciality])

  return (
    <section className='py-16 sm:py-20 text-slate-900'>
      <div className='flex flex-col items-center text-center mb-8 sm:mb-10'>
        <span className='px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-100/80 text-primary text-xs font-semibold tracking-wide uppercase mb-3'>
          Top Specialists
        </span>
        <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight'>
          Verified Doctors Available for Consultation
        </h2>
        <p className='text-sm sm:text-base text-slate-500 max-w-xl mt-2 leading-relaxed'>
          Explore top-rated practitioners, check their availability, and reserve an appointment that fits your routine.
        </p>

        {/* Speciality Filter Pills */}
        <div className='flex items-center justify-center flex-wrap gap-2 mt-6 max-w-2xl px-2'>
          {specialities.map((spec, i) => (
            <button
              key={i}
              type='button'
              onClick={() => setSelectedSpeciality(spec)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                selectedSpeciality === spec
                  ? 'bg-primary text-white shadow-sm shadow-primary/30'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2'>
        {filteredDoctors.map((item, index) => {
          const isAvailable = item.available !== false

          return (
            <div
              key={index}
              onClick={() => {
                navigate(`/appointment/${item._id}`)
                scrollTo(0, 0)
              }}
              className={`rounded-2xl border overflow-hidden cursor-pointer transition-all duration-300 flex flex-col group ${
                isAvailable
                  ? 'bg-white border-slate-200/80 shadow-sm hover:shadow-xl hover:border-primary/30 hover:-translate-y-1.5'
                  : 'bg-slate-100/80 border-slate-200/90 shadow-none hover:bg-slate-100/95'
              }`}
            >
              {/* Doctor Image Container */}
              <div className={`w-full h-56 overflow-hidden relative ${isAvailable ? 'bg-gradient-to-b from-indigo-50/60 to-slate-50' : 'bg-slate-200/80'}`}>
                <img
                  className={`w-full h-full object-cover object-top transition-transform duration-500 ${
                    isAvailable ? 'group-hover:scale-105' : 'filter grayscale-[30%] opacity-80'
                  }`}
                  src={item.image}
                  alt={item.name}
                />
                
                {/* Availability Badge */}
                <div className='absolute top-3 left-3'>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md shadow-xs ${
                      isAvailable
                        ? 'bg-white/90 text-emerald-700 border border-emerald-100'
                        : 'bg-slate-800/80 text-white'
                    }`}
                  >
                    <span className='relative flex h-2 w-2'>
                      {isAvailable && (
                        <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75'></span>
                      )}
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${isAvailable ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                    </span>
                    <span>{isAvailable ? 'Available' : 'Unavailable'}</span>
                  </span>
                </div>

                {/* Experience Tag */}
                {item.experience && (
                  <div className='absolute bottom-3 right-3'>
                    <span className='bg-white/90 backdrop-blur-md text-slate-700 text-[11px] font-medium px-2.5 py-0.5 rounded-md border border-slate-100 shadow-xs'>
                      {item.experience}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className='p-5 flex-1 flex flex-col justify-between'>
                <div>
                  <p className='text-xs font-semibold text-primary uppercase tracking-wide mb-1'>
                    {item.speciality}
                  </p>
                  <h3 className={`text-base font-bold transition-colors line-clamp-1 ${isAvailable ? 'text-slate-900 group-hover:text-primary' : 'text-slate-700'}`}>
                    {item.name}
                  </h3>
                  <p className='text-xs text-slate-500 mt-0.5'>
                    {item.degree || 'Certified Specialist'}
                  </p>
                </div>

                {/* Card Footer: Fee & Action */}
                <div className='mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs'>
                  <div>
                    <span className='text-slate-400 block text-[10px] uppercase font-medium'>Consultation</span>
                    <span className='text-slate-900 font-bold text-sm'>
                      {currencySymbol}{item.fees}
                    </span>
                  </div>

                  <span
                    className={`font-semibold inline-flex items-center gap-1 transition-colors ${
                      isAvailable
                        ? 'text-primary group-hover:translate-x-0.5 transition-transform'
                        : 'text-slate-400'
                    }`}
                  >
                    <span>{isAvailable ? 'Book Visit' : 'Details'}</span>
                    <span>&rarr;</span>
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom Button */}
      <div className='flex justify-center mt-12'>
        <button
          type='button'
          onClick={() => {
            navigate('/doctors')
            scrollTo(0, 0)
          }}
          className='bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold text-sm px-10 py-3 rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-primary/20 cursor-pointer active:scale-95 flex items-center gap-2'
        >
          <span>View All Doctors ({doctors.length})</span>
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M14 5l7 7m0 0l-7 7m7-7H3' />
          </svg>
        </button>
      </div>
    </section>
  )
}

export default TopDoctors
