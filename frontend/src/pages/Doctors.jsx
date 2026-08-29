import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Doctors = () => {
  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)

  const specialitiesList = [
    'General physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatricians',
    'Neurologist',
    'Gastroenterologist'
  ]

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  return (
    <div>
      <p className='text-gray-600 mb-4'>Browse through the doctors specialist.</p>

      <div className='flex flex-col lg:flex-row items-start gap-8'>
        {/* Mobile Filter Toggle Button */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`lg:hidden flex items-center justify-between w-full px-5 py-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${showFilter
            ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
            : 'bg-white text-slate-700 border-slate-200 shadow-sm'
            }`}
        >
          <span>Filters {speciality ? `: ${speciality}` : '(All Doctors)'}</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${showFilter ? 'rotate-180' : ''}`}
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7' />
          </svg>
        </button>

        {/* Sidebar Filters */}
        <div
          className={`flex-col gap-2.5 w-full lg:w-64 flex-shrink-0 ${showFilter ? 'flex' : 'hidden lg:flex'
            }`}
        >
          <div className='flex items-center justify-between px-1 mb-1'>
            <span className='text-xs font-bold text-slate-400 uppercase tracking-wider'>
              Filter by Specialty
            </span>
            {speciality && (
              <span
                onClick={() => navigate('/doctors')}
                className='text-xs text-primary font-semibold hover:underline cursor-pointer'
              >
                Clear filter
              </span>
            )}
          </div>

          <button
            onClick={() => navigate('/doctors')}
            className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all cursor-pointer flex items-center justify-between ${!speciality
              ? 'bg-primary text-white border-primary shadow-md shadow-primary/20 font-semibold'
              : 'bg-white text-slate-600 border-slate-200 hover:border-primary/40 hover:bg-slate-50 font-medium'
              }`}
          >
            <span>All Doctors</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full ${!speciality ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {doctors.length}
            </span>
          </button>

          {specialitiesList.map((spec, index) => {
            const isSelected = speciality === spec
            const count = doctors.filter(d => d.speciality === spec).length
            return (
              <button
                key={index}
                onClick={() =>
                  isSelected ? navigate('/doctors') : navigate(`/doctors/${spec}`)
                }
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all cursor-pointer flex items-center justify-between ${isSelected
                  ? 'bg-primary text-white border-primary shadow-md shadow-primary/20 font-semibold'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-primary/40 hover:bg-slate-50 font-medium'
                  }`}
              >
                <span>{spec}</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Doctors Grid */}
        <div className='flex-1 w-full'>
          {filterDoc.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'>
              {filterDoc.map((item, index) => (
                <div
                  onClick={() => navigate(`/appointment/${item._id}`)}
                  className='border border-slate-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-white group flex flex-col'
                  key={index}
                >
                  <div className='w-full h-56 overflow-hidden bg-indigo-50/40 relative'>
                    <img
                      className='w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105'
                      src={item.image}
                      alt={item.name}
                    />
                    <span className='absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-slate-700 shadow-sm border border-white/50'>
                      ${item.fees}
                    </span>
                  </div>

                  <div className='p-5 flex-1 flex flex-col justify-between'>
                    <div>
                      <div className='flex items-center gap-2 text-xs font-medium text-emerald-600 mb-2'>
                        <span className='relative flex h-2 w-2'>
                          <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75'></span>
                          <span className='relative inline-flex rounded-full h-2 w-2 bg-emerald-500'></span>
                        </span>
                        <span>Available</span>
                      </div>

                      <h3 className='text-slate-800 text-base font-bold group-hover:text-primary transition-colors line-clamp-1'>
                        {item.name}
                      </h3>
                      <p className='text-slate-500 text-xs font-medium mt-0.5'>
                        {item.speciality}
                      </p>
                    </div>

                    <div className='mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium'>
                      <span>{item.experience} Exp.</span>
                      <span className='text-primary font-semibold group-hover:underline'>
                        Book Now →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='bg-white border border-slate-100 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3 shadow-sm'>
              <div className='w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-2xl text-primary mb-1'>
                🩺
              </div>
              <h3 className='text-lg font-bold text-slate-800'>No doctors found</h3>
              <p className='text-sm text-slate-500 max-w-sm'>
                We couldn't find any doctors under "{speciality}". Try clearing the filter or selecting another specialty.
              </p>
              <button
                onClick={() => navigate('/doctors')}
                className='mt-2 bg-primary text-white text-xs font-semibold px-6 py-2.5 rounded-full shadow-md hover:bg-primary/90 transition-all cursor-pointer'
              >
                View All Doctors
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Doctors
