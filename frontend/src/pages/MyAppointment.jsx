import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const MyAppointment = () => {
  const { doctors } = useContext(AppContext)

  return (
    <div className='py-6 max-w-4xl'>
      <div className='flex items-center gap-3 pb-4 mb-6 border-b border-slate-100'>
        <h1 className='text-xl sm:text-2xl font-bold text-slate-900 tracking-tight'>
          My Appointments
        </h1>
        <span className='px-3 py-0.5 bg-indigo-50 text-primary text-xs font-semibold rounded-full'>
          {doctors.slice(0, 3).length} Bookings
        </span>
      </div>

      <div className='flex flex-col gap-4'>
        {doctors.slice(0, 3).map((doctor, index) => (
          <div
            className='border border-slate-100 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6'
            key={index}
          >
            {/* Left: Doctor Photo & Info */}
            <div className='flex items-start sm:items-center gap-4 flex-1'>
              <img
                className='w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover object-top bg-indigo-50/50 border border-slate-100 flex-shrink-0'
                src={doctor.image}
                alt={doctor.name}
              />

              <div className='flex flex-col gap-1 text-sm text-slate-600'>
                <h2 className='text-slate-900 font-bold text-base sm:text-lg'>
                  {doctor.name}
                </h2>
                <p className='text-primary text-xs font-semibold'>
                  {doctor.speciality}
                </p>

                <div className='text-xs text-slate-500 mt-1 leading-relaxed'>
                  <span className='font-semibold text-slate-700'>Clinic Address: </span>
                  {doctor.address?.line1}, {doctor.address?.line2}
                </div>

                <div className='inline-flex items-center gap-1.5 bg-indigo-50/80 border border-indigo-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full w-fit mt-2'>
                  <span className='text-primary'>📅</span>
                  <span>Date & Time: 12/12/2026 | 10:00 AM</span>
                </div>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className='flex flex-row sm:flex-col gap-3 w-full sm:w-auto flex-shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100'>
              <button className='flex-1 sm:flex-none sm:min-w-44 bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-full text-xs font-semibold shadow-md shadow-primary/20 hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer text-center'>
                Pay Online
              </button>

              <button className='flex-1 sm:flex-none sm:min-w-44 border border-rose-200 text-rose-500 hover:bg-rose-500 hover:text-white px-6 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer text-center'>
                Cancel Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointment
