import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'

const AllAppointment = () => {

  const { aToken, appointments, getAllAppointments, cancelAppointment, calculateAge, currency } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  return (
    <div className='m-5 space-y-4'>
      <p className='text-lg font-medium text-zinc-800'>All Appointments</p>

      <div className='bg-white border border-zinc-200 rounded-2xl shadow-sm text-sm max-h-[80vh] overflow-y-scroll'>
        
        {/* Table Header */}
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3.5 px-6 border-b border-zinc-200 bg-zinc-50 font-semibold text-zinc-600'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p className='text-center'>Actions</p>
        </div>

        {/* Table Body */}
        <div className='divide-y divide-zinc-100'>
          {appointments && appointments.length > 0 ? (
            appointments.map((item, index) => (
              <div 
                className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-zinc-600 py-3.5 px-6 hover:bg-zinc-50/80 transition-colors' 
                key={index}
              >
                <p className='max-sm:hidden font-medium text-zinc-400'>{index + 1}</p>
                
                <div className='flex items-center gap-3'>
                  <img 
                    className='w-9 h-9 rounded-full object-cover bg-zinc-100' 
                    src={item.userData?.image || assets.patients_icon} 
                    alt={item.userData?.name || 'Patient'} 
                    onError={(e) => { e.currentTarget.src = assets.patients_icon }}
                  />
                  <p className='font-medium text-zinc-800'>{item.userData?.name || 'Patient'}</p>
                </div>

                <p className='max-sm:hidden text-zinc-500'>
                  {calculateAge(item.userData?.dob)}
                </p>

                <p className='text-zinc-600'>
                  {item.slotDate}, {item.slotTime}
                </p>

                <div className='flex items-center gap-3'>
                  <img 
                    className='w-9 h-9 rounded-full object-cover bg-indigo-50' 
                    src={item.docData?.image || assets.upload_area} 
                    alt={item.docData?.name || 'Doctor'} 
                    onError={(e) => { e.currentTarget.src = assets.upload_area }}
                  />
                  <p className='font-medium text-zinc-800'>{item.docData?.name || 'Doctor'}</p>
                </div>

                <p className='font-semibold text-zinc-800'>
                  {currency}{item.amount}
                </p>

                <div className='flex items-center justify-center'>
                  {item.cancelled ? (
                    <span className='text-xs font-semibold text-red-500 bg-red-50 px-2.5 py-1 rounded-full'>
                      Cancelled
                    </span>
                  ) : item.isCompleted ? (
                    <span className='text-xs font-semibold text-green-500 bg-green-50 px-2.5 py-1 rounded-full'>
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
            <p className='py-12 text-center text-zinc-400'>No appointments found.</p>
          )}
        </div>

      </div>
    </div>
  )
}

export default AllAppointment
