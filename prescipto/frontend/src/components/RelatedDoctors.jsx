import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors } = useContext(AppContext)
  const navigate = useNavigate()

  const [relDoc, setRelDocs] = useState([])

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId)
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
          Explore other highly rated {speciality}s available for instant booking.
        </p>
      </div>

      <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-6'>
        {relDoc.slice(0, 4).map((item, index) => (
          <div
            onClick={() => {
              navigate(`/appointment/${item._id}`)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className='bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group flex flex-col justify-between'
            key={index}
          >
            <div className='relative overflow-hidden bg-indigo-50/50 aspect-square'>
              <img
                className='w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500'
                src={item.image}
                alt={item.name}
              />
              <div className='absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-100 text-[11px] font-bold text-slate-800 shadow-sm'>
                ${item.fees}
              </div>
            </div>

            <div className='p-5 flex flex-col gap-2'>
              <div className='flex items-center gap-2 text-xs font-semibold text-emerald-600'>
                <span className='w-2 h-2 bg-emerald-500 rounded-full animate-pulse'></span>
                <span>Available Today</span>
              </div>

              <h3 className='text-slate-900 text-base font-bold group-hover:text-primary transition-colors'>
                {item.name}
              </h3>
              
              <p className='text-slate-500 text-xs font-medium'>
                {item.speciality}
              </p>
            </div>
          </div>
        ))}
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
