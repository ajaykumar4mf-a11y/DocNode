import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
  return (
    <section id='speciality' className='py-16 sm:py-20 text-slate-800'>
      <div className='flex flex-col items-center text-center mb-10 sm:mb-12'>
        <span className='px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-100/80 text-primary text-xs font-semibold tracking-wide uppercase mb-3'>
          Specialities
        </span>
        <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight'>
          Find Care by Speciality
        </h2>
        <p className='text-sm sm:text-base text-slate-500 max-w-xl mt-2 leading-relaxed'>
          Explore experienced healthcare practitioners across primary care, pediatrics, dermatology, and more.
        </p>
      </div>

      {/* Grid of Specialities */}
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 px-1'>
        {specialityData.map((item, index) => (
          <Link
            onClick={() => scrollTo(0, 0)}
            key={index}
            to={`/doctors/${item.speciality}`}
            className='flex flex-col items-center justify-between p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-primary/30 hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer text-center'
          >
            <div className='w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-3 mb-3 group-hover:bg-indigo-50/80 group-hover:border-indigo-100 transition-all duration-300'>
              <img
                className='w-14 sm:w-16 object-contain transition-transform duration-300 group-hover:scale-110'
                src={item.image}
                alt={item.speciality}
              />
            </div>
            <p className='text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors'>
              {item.speciality}
            </p>
            <span className='text-[11px] font-medium text-slate-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-primary'>
              <span>View doctors</span>
              <span>&rarr;</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default SpecialityMenu
