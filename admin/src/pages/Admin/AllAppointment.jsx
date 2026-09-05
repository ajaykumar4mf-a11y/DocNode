import { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'

const AllAppointment = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment, calculateAge, currency } = useContext(AdminContext)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  const filteredAppointments = (appointments || []).filter(item => {
    const patientName = item.userData?.name?.toLowerCase() || ''
    const docName = item.docData?.name?.toLowerCase() || ''
    const search = searchTerm.toLowerCase()
    const matchesSearch = !search || patientName.includes(search) || docName.includes(search)

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
          <h1 className='text-2xl font-bold text-slate-900 tracking-tight'>All Appointments</h1>
          <p className='text-sm text-slate-500 mt-0.5'>
            Review patient appointments, consultation details, and booking lifecycle ({appointments?.length || 0} total)
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3'>
          {/* Search bar */}
          <div className='relative'>
            <input
              type='text'
              placeholder='Search patient or doctor...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full sm:w-64 pl-3.5 pr-8 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-700 placeholder:text-slate-400 shadow-xs'
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className='absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer'
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Filter Tabs */}
          <div className='inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200/70 text-xs font-medium text-slate-600'>
            {['All', 'Active', 'Completed', 'Cancelled'].map((tab) => (
              <button
                key={tab}
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
                <th className='py-3.5 px-4 hidden md:table-cell'>Age</th>
                <th className='py-3.5 px-4'>Date & Time</th>
                <th className='py-3.5 px-4'>Doctor</th>
                <th className='py-3.5 px-4'>Fee</th>
                <th className='py-3.5 px-4 sm:px-6 text-center'>Status / Action</th>
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
                            {item.userData?.name || 'Guest Patient'}
                          </p>
                          <p className='text-xs text-slate-400 md:hidden'>
                            Age: {calculateAge(item.userData?.dob)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Age */}
                    <td className='py-4 px-4 hidden md:table-cell text-slate-600 text-xs font-medium'>
                      {calculateAge(item.userData?.dob)} yrs
                    </td>

                    {/* Date & Time */}
                    <td className='py-4 px-4 text-xs font-medium text-slate-700 whitespace-nowrap'>
                      <p>{item.slotDate}</p>
                      <p className='text-slate-400 text-[11px]'>{item.slotTime}</p>
                    </td>

                    {/* Doctor */}
                    <td className='py-4 px-4'>
                      <div className='flex items-center gap-2.5'>
                        <img
                          className='w-8 h-8 rounded-full object-cover bg-indigo-50 border border-indigo-100 shrink-0'
                          src={item.docData?.image || assets.upload_area}
                          alt={item.docData?.name || 'Doctor'}
                          onError={(e) => { e.currentTarget.src = assets.upload_area }}
                        />
                        <div>
                          <p className='font-medium text-slate-900 text-xs sm:text-sm whitespace-nowrap'>
                            {item.docData?.name || 'Doctor'}
                          </p>
                          {item.docData?.speciality && (
                            <p className='text-[11px] text-slate-400'>{item.docData.speciality}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Fee */}
                    <td className='py-4 px-4 text-xs font-bold text-slate-900 whitespace-nowrap'>
                      {currency || '$'}{item.amount}
                    </td>

                    {/* Status & Actions */}
                    <td className='py-4 px-4 sm:px-6 text-center'>
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
                          title="Cancel appointment"
                        >
                          <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                          </svg>
                          <span>Cancel</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className='py-16 px-4 text-center'>
                    <div className='w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3'>
                      <img className='w-6 h-6 opacity-40' src={assets.appointment_icon} alt="Empty" />
                    </div>
                    <p className='text-sm font-semibold text-slate-800'>No appointments found</p>
                    <p className='text-xs text-slate-400 mt-1 max-w-sm mx-auto'>
                      {searchTerm || statusFilter !== 'All'
                        ? 'No records match your active search filter. Try clearing your search or switching filter tabs.'
                        : 'No appointments have been booked in the system yet.'}
                    </p>
                    {(searchTerm || statusFilter !== 'All') && (
                      <button
                        onClick={() => { setSearchTerm(''); setStatusFilter('All') }}
                        className='mt-3 inline-flex items-center text-xs font-medium text-primary hover:underline cursor-pointer'
                      >
                        Reset filters
                      </button>
                    )}
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

export default AllAppointment
