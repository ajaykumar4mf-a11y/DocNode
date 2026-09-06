import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const DoctorDashboard = () => {
  const { dToken, appointments, getAppointments, dashData, getDashData, cancelAppointment, completeAppointment, calculateAge, slotDateFormat, currency } = useContext(DoctorContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (dToken) {
      getDashData()
      getAppointments()
    }
  }, [dToken])

  const totalAppointments = dashData ? dashData.appointments : (appointments?.length || 0)
  const totalEarnings = dashData ? dashData.earnings : (appointments || []).reduce((acc, item) => {
    return !item.cancelled ? acc + (Number(item.amount) || 0) : acc
  }, 0)

  const uniquePatients = dashData ? dashData.patients : new Set((appointments || []).map((item) => item.userId || item.userData?._id || item.userData?.email)).size

  const recentAppointments = dashData?.latestAppointments || (appointments || []).slice(0, 5)

  const statCards = [
    {
      title: 'Total Earnings',
      value: `${currency || '$'} ${totalEarnings}`,
      subtitle: 'Consultation revenue',
      icon: assets.earning_icon || assets.doctor_icon,
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    {
      title: 'Appointments',
      value: totalAppointments,
      subtitle: 'Bookings scheduled',
      icon: assets.appointments_icon || assets.appointment_icon,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      actionText: 'View all appointments',
      actionRoute: '/doctor-appointments'
    },
    {
      title: 'Patients',
      value: uniquePatients,
      subtitle: 'Unique patients treated',
      icon: assets.patients_icon || assets.people_icon,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
    }
  ]

  return (
    dToken && <div className='space-y-8'>
      {/* Header */}
      <div className='pb-4 border-b border-slate-200/80'>
        <h1 className='text-2xl font-bold text-slate-900 tracking-tight'>Doctor Dashboard</h1>
        <p className='text-sm text-slate-500 mt-0.5'>
          Practice overview, upcoming appointments, and patient consultations
        </p>
      </div>

      {/* Metrics Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-5'>
        {statCards.map((card, index) => (
          <div
            key={index}
            className='bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs transition-all duration-200 hover:shadow-md flex flex-col justify-between'
          >
            <div className='flex items-start justify-between gap-4'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-wider text-slate-500'>{card.title}</p>
                <h3 className='text-3xl font-bold text-slate-900 mt-1.5'>{card.value}</h3>
                <p className='text-xs text-slate-400 mt-0.5'>{card.subtitle}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${card.iconBg}`}>
                <img src={card.icon} alt={card.title} className='w-6 h-6 object-contain' />
              </div>
            </div>

            {card.actionRoute && (
              <button
                type='button'
                onClick={() => navigate(card.actionRoute)}
                className='mt-4 pt-3 border-t border-slate-100 text-xs font-medium text-primary hover:text-indigo-700 flex items-center justify-between cursor-pointer transition-colors'
              >
                <span>{card.actionText}</span>
                <span>→</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Recent Appointments Card */}
      <div className='bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden'>
        <div className='p-5 sm:px-6 flex items-center justify-between border-b border-slate-200/80'>
          <div>
            <h2 className='text-base font-bold text-slate-900'>Recent Appointments</h2>
            <p className='text-xs text-slate-500 mt-0.5'>Your latest patient bookings</p>
          </div>
          <button
            type='button'
            onClick={() => navigate('/doctor-appointments')}
            className='text-xs font-semibold text-primary hover:text-indigo-700 transition-colors cursor-pointer'
          >
            View All ({totalAppointments}) →
          </button>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm text-slate-600 border-collapse'>
            <thead className='bg-slate-50/80 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200/80'>
              <tr>
                <th className='py-3.5 px-4 sm:px-6 w-12'>#</th>
                <th className='py-3.5 px-4'>Patient</th>
                <th className='py-3.5 px-4'>Date & Time</th>
                <th className='py-3.5 px-4'>Payment</th>
                <th className='py-3.5 px-4'>Fee</th>
                <th className='py-3.5 px-4 sm:px-6 text-center'>Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              {recentAppointments.length > 0 ? (
                recentAppointments.map((item, index) => (
                  <tr key={item._id || index} className='hover:bg-slate-50/60 transition-colors'>
                    <td className='py-4 px-4 sm:px-6 text-xs text-slate-400 font-medium'>
                      {index + 1}
                    </td>
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
                            {calculateAge ? calculateAge(item.userData?.dob) : 18} yrs • {item.userData?.email || item.userData?.phone || 'No contact'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className='py-4 px-4 text-xs font-medium text-slate-700 whitespace-nowrap'>
                      <p>{slotDateFormat ? slotDateFormat(item.slotDate) : item.slotDate}</p>
                      <p className='text-slate-400 text-[11px]'>{item.slotTime}</p>
                    </td>
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
                    <td className='py-4 px-4 text-xs font-semibold text-slate-900'>
                      {currency || '$'}{item.amount}
                    </td>
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
                  <td colSpan={6} className='py-12 text-center text-slate-400 text-sm'>
                    <div className='flex flex-col items-center justify-center gap-2'>
                      <img src={assets.appointments_icon || assets.appointment_icon} alt='Empty' className='w-10 h-10 opacity-30 object-contain' />
                      <p className='font-medium text-slate-600'>No recent appointments</p>
                      <p className='text-xs text-slate-400'>
                        Consultations booked with your profile will be displayed here.
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

export default DoctorDashboard
