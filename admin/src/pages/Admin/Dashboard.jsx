import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'

const Dashboard = () => {

  const { aToken, dashData, getDashData, cancelAppointment } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  return dashData && (
    <div className='m-5 space-y-8'>
      
      {/* Metric Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
        
        {/* Doctors Card */}
        <div className='flex items-center gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow'>
          <div className='w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center flex-shrink-0'>
            <img className='w-7 h-7' src={assets.doctor_icon} alt="Doctors Icon" />
          </div>
          <div>
            <p className='text-2xl font-bold text-zinc-800'>{dashData.doctors}</p>
            <p className='text-zinc-500 text-sm font-medium'>Doctors</p>
          </div>
        </div>

        {/* Appointments Card */}
        <div className='flex items-center gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow'>
          <div className='w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center flex-shrink-0'>
            <img className='w-7 h-7' src={assets.appointments_icon} alt="Appointments Icon" />
          </div>
          <div>
            <p className='text-2xl font-bold text-zinc-800'>{dashData.appointments}</p>
            <p className='text-zinc-500 text-sm font-medium'>Appointments</p>
          </div>
        </div>

        {/* Patients Card */}
        <div className='flex items-center gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow'>
          <div className='w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center flex-shrink-0'>
            <img className='w-7 h-7' src={assets.patients_icon} alt="Patients Icon" />
          </div>
          <div>
            <p className='text-2xl font-bold text-zinc-800'>{dashData.patients}</p>
            <p className='text-zinc-500 text-sm font-medium'>Patients</p>
          </div>
        </div>

      </div>

      {/* Latest Bookings Card */}
      <div className='bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden'>
        
        <div className='flex items-center gap-2.5 px-6 py-4 border-b border-zinc-100 bg-zinc-50/50'>
          <img className='w-5 h-5' src={assets.list_icon} alt="List Icon" />
          <p className='font-semibold text-zinc-800 text-base'>Latest Bookings</p>
        </div>

        <div className='divide-y divide-zinc-100'>
          {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
            dashData.latestAppointments.map((item, index) => (
              <div className='flex items-center justify-between px-6 py-4 hover:bg-zinc-50/80 transition-colors' key={index}>
                <div className='flex items-center gap-4'>
                  <img 
                    className='w-12 h-12 rounded-full object-cover bg-indigo-50 flex-shrink-0' 
                    src={item.docData?.image || assets.upload_area} 
                    alt={item.docData?.name || 'Doctor'}
                    onError={(e) => { e.currentTarget.src = assets.upload_area }}
                  />
                  <div>
                    <p className='text-zinc-800 font-medium text-sm'>{item.docData?.name || 'Doctor'}</p>
                    <p className='text-zinc-500 text-xs mt-0.5'>Booking on {item.slotDate}, {item.slotTime}</p>
                  </div>
                </div>

                <div>
                  {item.cancelled ? (
                    <span className='text-xs font-semibold text-red-500 bg-red-50 px-3 py-1 rounded-full'>
                      Cancelled
                    </span>
                  ) : item.isCompleted ? (
                    <span className='text-xs font-semibold text-green-500 bg-green-50 px-3 py-1 rounded-full'>
                      Completed
                    </span>
                  ) : (
                    <img 
                      onClick={() => cancelAppointment(item._id)} 
                      className='w-8 h-8 cursor-pointer hover:opacity-75 transition-opacity' 
                      src={assets.cancel_icon} 
                      alt="Cancel Appointment" 
                      title="Cancel Appointment"
                    />
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className='px-6 py-8 text-sm text-zinc-500 text-center'>No recent appointments booked yet.</p>
          )}
        </div>

      </div>

    </div>
  )
}

export default Dashboard