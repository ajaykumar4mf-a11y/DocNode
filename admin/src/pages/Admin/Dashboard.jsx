import { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { aToken, dashData, getDashData, cancelAppointment, currency } = useContext(AdminContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  if (!dashData) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='flex flex-col items-center gap-3 text-slate-500 text-sm'>
          <div className='w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin'></div>
          <p>Loading dashboard metrics...</p>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Doctors',
      value: dashData.doctors,
      subtitle: 'Registered practitioners',
      icon: assets.doctor_icon,
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      actionText: 'Manage doctors',
      actionRoute: '/doctors-list'
    },
    {
      title: 'Appointments',
      value: dashData.appointments,
      subtitle: 'Total bookings logged',
      icon: assets.appointments_icon,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      actionText: 'View schedule',
      actionRoute: '/all-appointment'
    },
    {
      title: 'Patients',
      value: dashData.patients,
      subtitle: 'Active patient profiles',
      icon: assets.patients_icon,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      actionText: 'All appointments',
      actionRoute: '/all-appointment'
    }
  ]

  return (
    <div className='space-y-8'>
      {/* Header Banner */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900 tracking-tight'>Dashboard Overview</h1>
          <p className='text-sm text-slate-500 mt-0.5'>
            Hospital operations summary, staff availability, and recent consultation bookings.
          </p>
        </div>
        <div className='flex items-center gap-2.5'>
          <button
            onClick={() => navigate('/add-doctor')}
            className='inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow-xs cursor-pointer active:scale-95'
          >
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
            </svg>
            <span>Add Doctor</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
        {statCards.map((card, index) => (
          <div
            key={index}
            className='bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between'
          >
            <div className='flex items-start justify-between gap-4'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-wider text-slate-400'>{card.title}</p>
                <p className='text-3xl font-extrabold text-slate-900 mt-2 tracking-tight'>{card.value}</p>
                <p className='text-xs text-slate-500 mt-1'>{card.subtitle}</p>
              </div>
              <div className={`w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 border ${card.iconBg}`}>
                <img className='w-6 h-6 object-contain' src={card.icon} alt={card.title} />
              </div>
            </div>

            <div className='mt-5 pt-4 border-t border-slate-100 flex items-center justify-between'>
              <button
                onClick={() => navigate(card.actionRoute)}
                className='text-xs font-medium text-primary hover:text-primary/80 inline-flex items-center gap-1 cursor-pointer transition-colors'
              >
                <span>{card.actionText}</span>
                <span aria-hidden='true'>&rarr;</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Latest Bookings Section */}
      <div className='bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden'>
        <div className='px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center'>
              <img className='w-4 h-4' src={assets.list_icon} alt="List" />
            </div>
            <div>
              <h2 className='text-base font-semibold text-slate-900'>Recent Appointments</h2>
              <p className='text-xs text-slate-500'>Latest scheduled patient consultations</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/all-appointment')}
            className='text-xs font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer hidden sm:block'
          >
            View all appointments &rarr;
          </button>
        </div>

        <div className='divide-y divide-slate-100'>
          {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
            dashData.latestAppointments.map((item, index) => (
              <div
                key={item._id || index}
                className='px-6 py-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3'
              >
                {/* Doctor & Appointment Details */}
                <div className='flex items-center gap-3.5'>
                  <img
                    className='w-11 h-11 rounded-full object-cover bg-slate-100 border border-slate-200 shrink-0'
                    src={item.docData?.image || assets.upload_area}
                    alt={item.docData?.name || 'Doctor'}
                    onError={(e) => { e.currentTarget.src = assets.upload_area }}
                  />
                  <div>
                    <div className='flex items-center gap-2'>
                      <p className='text-sm font-semibold text-slate-900'>{item.docData?.name || 'Assigned Doctor'}</p>
                      {item.docData?.speciality && (
                        <span className='hidden xs:inline-block text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md'>
                          {item.docData.speciality}
                        </span>
                      )}
                    </div>
                    <div className='flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap'>
                      {item.userData?.name && (
                        <>
                          <span className='text-slate-700 font-medium'>Patient: {item.userData.name}</span>
                          <span>•</span>
                        </>
                      )}
                      <span>{item.slotDate} at {item.slotTime}</span>
                      {item.amount && (
                        <>
                          <span>•</span>
                          <span className='font-semibold text-slate-700'>{currency || '$'}{item.amount}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status / Action */}
                <div className='flex items-center gap-2 self-end sm:self-center'>
                  {item.cancelled ? (
                    <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/70'>
                      <span className='w-1.5 h-1.5 rounded-full bg-rose-500'></span>
                      Cancelled
                    </span>
                  ) : item.isCompleted ? (
                    <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70'>
                      <span className='w-1.5 h-1.5 rounded-full bg-emerald-500'></span>
                      Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 transition-all cursor-pointer active:scale-95'
                      title="Cancel this appointment"
                    >
                      <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                      </svg>
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className='py-12 px-4 text-center'>
              <div className='w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3'>
                <img className='w-6 h-6 opacity-40' src={assets.appointments_icon} alt="Empty" />
              </div>
              <p className='text-sm font-medium text-slate-700'>No recent bookings logged</p>
              <p className='text-xs text-slate-400 mt-1 max-w-sm mx-auto'>
                When patient bookings are scheduled or completed, they will appear here in chronological order.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard