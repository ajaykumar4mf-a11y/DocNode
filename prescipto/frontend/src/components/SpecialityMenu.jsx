import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
  return (
    <div id='speciality' className='flex flex-col items-center gap-4 py-16 text-gray-800'>
      <h1 className='text-3xl font-medium text-center'>
        Find by Speciality
      </h1>
      <p className='sm:w-1/3 text-center text-sm text-gray-600 leading-relaxed'>
        Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
      </p>
      
      <div className='flex sm:justify-center gap-6 pt-6 w-full overflow-x-auto pb-4 px-2 scrollbar-none'>
        {specialityData.map((item, index)=>(
          <Link 
            onClick={()=>scrollTo(0, 0)} 
            className='flex flex-col items-center text-xs font-medium cursor-pointer flex-shrink-0 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 hover:-translate-y-2 transition-all duration-300 group' 
            key={index} 
            to={`/doctors/${item.speciality}`}
          >
            <div className='w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-50 flex items-center justify-center p-3 mb-3 group-hover:bg-indigo-50 transition-colors'>
              <img className='w-14 sm:w-16 object-contain transition-transform duration-300 group-hover:scale-110' src={item.image} alt={item.speciality} />
            </div>
            <p className='text-slate-700 font-semibold group-hover:text-primary transition-colors'>{item.speciality}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SpecialityMenu
