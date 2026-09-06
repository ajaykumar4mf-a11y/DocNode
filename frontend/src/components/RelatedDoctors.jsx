import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors, currencySymbol } = useContext(AppContext)
  const navigate = useNavigate()

  const [relDoc, setRelDocs] = useState([])

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId)
      // Prioritize available doctors first
      doctorsData.sort((a, b) => (b.available !== false ? 1 : 0) - (a.available !== false ? 1 : 0))
      setRelDocs(doctorsData)
    }
  }, [doctors, speciality, docId])

  if (relDoc.length === 0) return null

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-slate-900'>
      <div className='text-center max-w-md'>
        <h2 className='text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight'>
          Related Specialists
        </h2>
        <p className='text-slate-500 text-sm mt-2'>
          Explore other highly rated {speciality.toLowerCase().endsWith('s') ? speciality : `${speciality}s`} available for instant booking.
        </p>
      </div>

      <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-6'>
        {relDoc.slice(0, 4).map((item, index) => {
          const isAvailable = item.available !== false
          return (
            <div
              onClick={() => {
                navigate(`/appointment/${item._id}`)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className={`rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer group flex flex-col justify-between border ${
                isAvailable
                  ? 'bg-white border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5'
                  : 'bg-slate-100/80 border-slate-200/90 shadow-none hover:bg-slate-100/90'
              }`}
              key={index}
            >
              <div className={`relative overflow-hidden aspect-square ${isAvailable ? 'bg-indigo-50/50' : 'bg-slate-200/80'}`}>
                <img
                  className={`w-full h-full object-cover object-top transition-transform duration-500 ${
                    isAvailable ? 'group-hover:scale-105' : 'filter grayscale-[30%] opacity-85'
                  }`}
                  src={item.image}
                  alt={item.name}
                />
                <div className={`absolute top-3 right-3 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm border ${
                  isAvailable ? 'bg-white/90 border-slate-100 text-slate-800' : 'bg-slate-100/90 border-slate-300/60 text-slate-500'
                }`}>
                  {currencySymbol || '$'}{item.fees}
                </div>
              </div>

              <div className={`p-5 flex flex-col gap-2 ${!isAvailable ? 'bg-slate-100/50' : ''}`}>
                <div className={`flex items-center gap-2 text-xs font-semibold ${isAvailable ? 'text-emerald-600' : 'text-slate-500'}`}>
                  <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                  <span>{isAvailable ? 'Available' : 'Currently Unavailable'}</span>
                </div>

                <h3 className={`text-base font-bold transition-colors ${isAvailable ? 'text-slate-900 group-hover:text-primary' : 'text-slate-700'}`}>
                  {item.name}
                </h3>

                <p className='text-slate-500 text-xs font-medium'>
                  {item.speciality}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={() => {
          navigate('/doctors')
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        className='border border-slate-200 text-slate-700 hover:bg-primary hover:text-white hover:border-primary px-10 py-3 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer mt-6 active:scale-95'
      >
        View All Doctors
      </button>
    </div>
  )
}

export default RelatedDoctors
