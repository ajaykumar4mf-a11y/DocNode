import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'

const DoctorAppointments = () => {
  const { 
    dToken, 
    appointments, 
    getAppointments, 
    cancelAppointment, 
    completeAppointment, 
    savePrescription,
    calculateAge, 
    slotDateFormat, 
    currency 
  } = useContext(DoctorContext)

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  // Prescription Modal State
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false)
  const [activeAppointment, setActiveAppointment] = useState(null)
  const [diagnosis, setDiagnosis] = useState('')
  const [notes, setNotes] = useState('')
  const [vitals, setVitals] = useState({ bp: '', pulse: '', temperature: '' })
  const [medicines, setMedicines] = useState([])
  const [markCompleteOnSave, setMarkCompleteOnSave] = useState(true)
  const [isSavingPrescription, setIsSavingPrescription] = useState(false)

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  const openPrescriptionModal = (appointment) => {
    setActiveAppointment(appointment)
    const existingRx = appointment?.prescription || {}
    setDiagnosis(existingRx.diagnosis || '')
    setNotes(existingRx.notes || '')
    setVitals({
      bp: existingRx.vitals?.bp || '',
      pulse: existingRx.vitals?.pulse || '',
      temperature: existingRx.vitals?.temperature || ''
    })
    if (Array.isArray(existingRx.medicines) && existingRx.medicines.length > 0) {
      setMedicines(existingRx.medicines.map(m => ({ ...m })))
    } else {
      setMedicines([
        { name: '', dosage: '', frequency: '', duration: '' }
      ])
    }
    setMarkCompleteOnSave(!appointment.isCompleted)
    setPrescriptionModalOpen(true)
  }

  const handleAddMedicine = () => {
    setMedicines(prev => [...prev, { name: '', dosage: '', frequency: '', duration: '' }])
  }

  const handleRemoveMedicine = (index) => {
    setMedicines(prev => prev.filter((_, i) => i !== index))
  }

  const handleMedicineChange = (index, field, value) => {
    setMedicines(prev => {
      const updated = [...prev]
      updated[index][field] = value
      return updated
    })
  }

  const handleSavePrescription = async (e) => {
    e.preventDefault()
    if (!activeAppointment) return

    // Filter out completely blank medicine rows
    const cleanedMedicines = medicines.filter(
      m => m.name.trim() || m.dosage.trim() || m.frequency.trim() || m.duration.trim()
    )

    if (!diagnosis.trim() && cleanedMedicines.length === 0 && !notes.trim()) {
      toast.warning('Please enter a diagnosis, consultation notes, or at least one medicine')
      return
    }

    setIsSavingPrescription(true)
    const res = await savePrescription({
      appointmentId: activeAppointment._id,
      diagnosis: diagnosis.trim(),
      notes: notes.trim(),
      vitals,
      medicines: cleanedMedicines,
      markComplete: markCompleteOnSave
    })
    setIsSavingPrescription(false)

    if (res?.success) {
      setPrescriptionModalOpen(false)
      setActiveAppointment(null)
    }
  }

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
                <th className='py-3.5 px-4'>Prescription</th>
                <th className='py-3.5 px-4 sm:px-6 text-center'>Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              {filteredAppointments && filteredAppointments.length > 0 ? (
                filteredAppointments.map((item, index) => {
                  const hasRx = item.prescription && (
                    item.prescription.diagnosis || 
                    (item.prescription.medicines && item.prescription.medicines.length > 0) ||
                    item.prescription.notes
                  )

                  return (
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

                      {/* Digital Prescription Column */}
                      <td className='py-4 px-4 text-xs'>
                        {!item.cancelled ? (
                          <button
                            type='button'
                            onClick={() => openPrescriptionModal(item)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium text-xs transition-all cursor-pointer shadow-2xs ${
                              hasRx
                                ? 'bg-indigo-50 text-primary border border-indigo-200 hover:bg-indigo-100'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                            }`}
                            title={hasRx ? 'Edit Prescription' : 'Attach Prescription'}
                          >
                            <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                            </svg>
                            <span>{hasRx ? 'Rx Attached' : '+ Add Rx'}</span>
                          </button>
                        ) : (
                          <span className='text-slate-300 text-xs'>—</span>
                        )}
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
                  )
                })
              ) : (
                <tr>
                  <td colSpan={8} className='py-12 text-center text-slate-400 text-sm'>
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

      {/* Digital Prescription & Clinical Notes Modal */}
      {prescriptionModalOpen && activeAppointment && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto'>
          <div className='bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200'>
            {/* Modal Header */}
            <div className='px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70'>
              <div>
                <h2 className='text-lg font-bold text-slate-900 flex items-center gap-2'>
                  <span>Digital Prescription & Consultation Notes</span>
                </h2>
                <p className='text-xs text-slate-500 mt-0.5'>
                  Patient: <strong className='text-slate-700'>{activeAppointment.userData?.name}</strong> •{' '}
                  {calculateAge ? calculateAge(activeAppointment.userData?.dob) : 18} yrs •{' '}
                  Slot: {slotDateFormat(activeAppointment.slotDate)} at {activeAppointment.slotTime}
                </p>
              </div>
              <button
                type='button'
                onClick={() => {
                  setPrescriptionModalOpen(false)
                  setActiveAppointment(null)
                }}
                className='w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer'
              >
                ✕
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSavePrescription} className='p-6 space-y-5 max-h-[75vh] overflow-y-auto'>
              {/* Patient Vitals Grid */}
              <div>
                <label className='block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2'>
                  Patient Vitals
                </label>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                  <div>
                    <label className='block text-xs text-slate-600 mb-1'>Blood Pressure (mmHg)</label>
                    <input
                      type='text'
                      placeholder='e.g. 120/80'
                      value={vitals.bp}
                      onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
                      className='w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/20'
                    />
                  </div>
                  <div>
                    <label className='block text-xs text-slate-600 mb-1'>Pulse Rate (bpm)</label>
                    <input
                      type='text'
                      placeholder='e.g. 72'
                      value={vitals.pulse}
                      onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
                      className='w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/20'
                    />
                  </div>
                  <div>
                    <label className='block text-xs text-slate-600 mb-1'>Body Temperature (°F)</label>
                    <input
                      type='text'
                      placeholder='e.g. 98.6'
                      value={vitals.temperature}
                      onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                      className='w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/20'
                    />
                  </div>
                </div>
              </div>

              {/* Diagnosis Field */}
              <div>
                <label className='block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5'>
                  Clinical Diagnosis
                </label>
                <input
                  type='text'
                  placeholder='e.g. Acute bronchitis with mild wheezing'
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className='w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800'
                />
              </div>

              {/* Prescribed Medications Dynamic Table */}
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <label className='block text-xs font-semibold uppercase tracking-wider text-slate-500'>
                    Prescribed Medications
                  </label>
                  <button
                    type='button'
                    onClick={handleAddMedicine}
                    className='text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer flex items-center gap-1'
                  >
                    <span>+ Add Medicine</span>
                  </button>
                </div>

                <div className='space-y-2.5'>
                  {medicines.map((med, idx) => (
                    <div
                      key={idx}
                      className='grid grid-cols-1 sm:grid-cols-12 gap-2 p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl items-center'
                    >
                      <div className='sm:col-span-4'>
                        <input
                          type='text'
                          placeholder='Medicine Name'
                          value={med.name}
                          onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                          className='w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-primary'
                        />
                      </div>
                      <div className='sm:col-span-3'>
                        <input
                          type='text'
                          placeholder='Dosage (e.g. 500mg)'
                          value={med.dosage}
                          onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                          className='w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-primary'
                        />
                      </div>
                      <div className='sm:col-span-2'>
                        <input
                          type='text'
                          placeholder='Freq (1-0-1)'
                          value={med.frequency}
                          onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
                          className='w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-primary'
                        />
                      </div>
                      <div className='sm:col-span-2'>
                        <input
                          type='text'
                          placeholder='Duration (5d)'
                          value={med.duration}
                          onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                          className='w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-primary'
                        />
                      </div>
                      <div className='sm:col-span-1 text-center'>
                        {medicines.length > 1 && (
                          <button
                            type='button'
                            onClick={() => handleRemoveMedicine(idx)}
                            className='text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer'
                            title='Remove item'
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consultation Notes & Advice */}
              <div>
                <label className='block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5'>
                  Physician Advice & Consultation Notes
                </label>
                <textarea
                  rows={3}
                  placeholder='e.g. Stay hydrated, avoid cold beverages, follow up after 5 days if fever persists...'
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className='w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800'
                />
              </div>

              {/* Mark Complete Checkbox */}
              {!activeAppointment.isCompleted && (
                <label className='flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer pt-1'>
                  <input
                    type='checkbox'
                    checked={markCompleteOnSave}
                    onChange={(e) => setMarkCompleteOnSave(e.target.checked)}
                    className='rounded text-primary focus:ring-primary h-4 w-4 border-slate-300'
                  />
                  <span>Mark appointment as completed simultaneously</span>
                </label>
              )}

              {/* Modal Footer Actions */}
              <div className='flex items-center justify-end gap-3 pt-3 border-t border-slate-100'>
                <button
                  type='button'
                  onClick={() => {
                    setPrescriptionModalOpen(false)
                    setActiveAppointment(null)
                  }}
                  className='px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isSavingPrescription}
                  className='px-5 py-2 text-xs font-semibold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-60'
                >
                  {isSavingPrescription ? 'Saving Record...' : 'Save Prescription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorAppointments