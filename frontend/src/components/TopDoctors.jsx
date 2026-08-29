import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const TopDoctors = () => {

  const navigate = useNavigate();
  const { doctors } = useContext(AppContext)

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
      <h1 className='text-3xl font-medium text-center'>
        Top Doctors to Book
      </h1>
      <p className='sm:w-1/3 text-center text-sm text-gray-600 leading-relaxed'>
        Simply browse through our extensive list of trusted doctors.
      </p>

      <div className='w-full grid grid-cols-auto gap-6 pt-6 gap-y-8 px-3 sm:px-0'>
        {doctors.slice(0, 10).map((item, index) => (
          <div
            onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
            className='border border-slate-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-white group'
            key={index}
          >
            <div className='w-full h-56 overflow-hidden bg-indigo-50/40 relative'>
              <img className='w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105' src={item.image} alt={item.name} />
            </div>

            <div className='p-5'>
              <div className='flex items-center gap-2 text-xs font-medium text-emerald-600 mb-2'>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Available Today</span>
              </div>

              <h3 className='text-slate-800 text-lg font-bold group-hover:text-primary transition-colors line-clamp-1'>
                {item.name}
              </h3>
              <p className='text-slate-500 text-xs font-medium mt-0.5'>{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => { navigate('/doctors'); scrollTo(0, 0) }}
        className='bg-indigo-50 hover:bg-primary hover:text-white text-primary text-sm font-semibold px-12 py-3.5 rounded-full mt-10 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-primary/25 cursor-pointer active:scale-95'
      >
        View All Doctors
      </button>
    </div>
  )
}

export default TopDoctors
