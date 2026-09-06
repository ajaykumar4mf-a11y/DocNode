import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment, calculateAge, slotDateFormat, currency } = useContext(DoctorContext)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  const filteredAppointments = (appointments || []).filter((item) => {
    const patientName = item.userData?.name?.toLowerCase() || ''
    const patientEmail = item.userData?.email?.toLowerCase() || ''
    const search = searchTerm.toLowerCase().trim()
    const matchesSearch = !search || patientName.includes(search) || patientEmail.includes(search)

    if (!matchesSearch) return false

    if (statusFilter === 'Completed') return item.isCompleted && !item.cancelled
    if (statusFilter === 'Cancelled') return item.cancelled
    if (statusFilter === 'Active') return !item.isCompleted && !item.cancelled

    return true
  })

  return (
    <div className='space-y-6'>
      {/* Header & Controls */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900 tracking-tight'>Doctor Appointments</h1>
          <p className='text-sm text-slate-500 mt-0.5'>
            View and manage your patient consultations ({appointments?.length || 0} total)
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search patient name or email...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full sm:w-64 pl-3.5 pr-8 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-700 placeholder:text-slate-400 shadow-xs'
            />
            {searchTerm && (
              <button
                type='button'
                onClick={() => setSearchTerm('')}
                className='absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer'
              >
                ✕
              </button>
            )}
          </div>

          <div className='inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200/70 text-xs font-medium text-slate-600'>
            {['All', 'Active', 'Completed', 'Cancelled'].map((tab) => (
              <button
                key={tab}
                type='button'
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Appointments Table Card */}
      <div className='bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm text-slate-600 border-collapse'>
            <thead className='bg-slate-50/80 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200/80'>
              <tr>
                <th className='py-3.5 px-4 sm:px-6 w-12'>#</th>
                <th className='py-3.5 px-4'>Patient</th>
                <th className='py-3.5 px-4 hidden md:table-cell'>Age / Gender</th>
                <th className='py-3.5 px-4'>Date & Time</th>
                <th className='py-3.5 px-4'>Payment</th>
                <th className='py-3.5 px-4'>Fee</th>
                <th className='py-3.5 px-4 sm:px-6 text-center'>Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              {filteredAppointments && filteredAppointments.length > 0 ? (
                filteredAppointments.map((item, index) => (
                  <tr
                    key={item._id || index}
                    className='hover:bg-slate-50/60 transition-colors'
                  >
                    {/* Index */}
                    <td className='py-4 px-4 sm:px-6 text-xs text-slate-400 font-medium'>
                      {index + 1}
                    </td>

                    {/* Patient */}
                    <td className='py-4 px-4'>
                      <div className='flex items-center gap-3'>
                        <img
                          className='w-9 h-9 rounded-full object-cover bg-slate-100 border border-slate-200 shrink-0'
                          src={item.userData?.image || assets.patients_icon}
                          alt={item.userData?.name || 'Patient'}
                          onError={(e) => { e.currentTarget.src = assets.patients_icon }}
                        />
                        <div>
                          <p className='font-semibold text-slate-900 text-sm'>
                            {item.userData?.name || 'Patient'}
                          </p>
                          <p className='text-xs text-slate-400'>
                            {item.userData?.email || item.userData?.phone || 'No contact provided'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Age / Gender */}
                    <td className='py-4 px-4 hidden md:table-cell text-slate-600 text-xs font-medium'>
                      <span>{calculateAge ? calculateAge(item.userData?.dob) : 18} yrs</span>
                      {item.userData?.gender && (
                        <span className='text-slate-400 capitalize'> • {item.userData.gender}</span>
                      )}
                    </td>

                    {/* Date & Time */}
                    <td className='py-4 px-4 text-xs font-medium text-slate-700 whitespace-nowrap'>
                      <p>{slotDateFormat ? slotDateFormat(item.slotDate) : item.slotDate}</p>
                      <p className='text-slate-400 text-[11px]'>{item.slotTime}</p>
                    </td>

                    {/* Payment */}
                    <td className='py-4 px-4 text-xs'>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-medium ${
                          item.payment
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                            : 'bg-amber-50 text-amber-700 border border-amber-200/70'
                        }`}
                      >
                        {item.payment ? 'Online' : 'Cash'}
                      </span>
                    </td>

                    {/* Fee */}
                    <td className='py-4 px-4 text-xs font-semibold text-slate-900'>
                      {currency || '$'}{item.amount}
                    </td>

                    {/* Action */}
                    <td className='py-4 px-4 sm:px-6 text-center'>
                      {item.cancelled ? (
                        <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80'>
                          <span className='w-1.5 h-1.5 rounded-full bg-rose-500'></span>
                          Cancelled
                        </span>
                      ) : item.isCompleted ? (
                        <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80'>
                          <span className='w-1.5 h-1.5 rounded-full bg-emerald-500'></span>
                          Completed
                        </span>
                      ) : (
                        <div className='inline-flex items-center gap-2'>
                          <button
                            type='button'
                            onClick={() => completeAppointment(item._id)}
                            className='group/complete w-8 h-8 rounded-xl flex items-center justify-center bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white border border-emerald-200/80 hover:border-emerald-600 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer active:scale-95'
                            title='Mark as Completed'
                            aria-label='Mark appointment as completed'
                          >
                            <svg className='w-4 h-4 transition-transform duration-200 group-hover/complete:scale-110' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.4} d='M5 13l4 4L19 7' />
                            </svg>
                          </button>
                          <button
                            type='button'
                            onClick={() => cancelAppointment(item._id)}
                            className='group/cancel w-8 h-8 rounded-xl flex items-center justify-center bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200/80 hover:border-rose-200 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer active:scale-95'
                            title='Cancel Appointment'
                            aria-label='Cancel appointment'
                          >
                            <svg className='w-4 h-4 transition-transform duration-200 group-hover/cancel:scale-110' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.4} d='M6 18L18 6M6 6l12 12' />
                            </svg>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className='py-12 text-center text-slate-400 text-sm'>
                    <div className='flex flex-col items-center justify-center gap-2'>
                      <img src={assets.appointments_icon || assets.appointment_icon} alt='Empty' className='w-10 h-10 opacity-30 object-contain' />
                      <p className='font-medium text-slate-600'>No appointments found</p>
                      <p className='text-xs text-slate-400'>
                        {searchTerm || statusFilter !== 'All'
                          ? 'Try adjusting your search query or status filter.'
                          : 'Patients who book consultations with you will appear here.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DoctorAppointments