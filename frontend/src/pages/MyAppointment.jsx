import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyAppointment = () => {
  const { backendUrl, token, getDoctorsData, doctors, userData, slotDateFormat } = useContext(AppContext)

  const [appointments, setAppointments] = useState([])

  // Modal States
  const [prescriptionModalAppt, setPrescriptionModalAppt] = useState(null)
  const [rescheduleModalAppt, setRescheduleModalAppt] = useState(null)
  const [reviewModalAppt, setReviewModalAppt] = useState(null)

  // Reschedule Form State
  const [rescheduleDays, setRescheduleDays] = useState([])
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('')
  const [isRescheduling, setIsRescheduling] = useState(false)

  // Review Form State
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/list-appointments`, {
        headers: { token }
      })
      if (data.success) {
        setAppointments(data.appointments.reverse())
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      )
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TXC4EbSLcKAZ2c',
      amount: order.amount,
      currency: order.currency || 'INR',
      name: 'Appointment Payment',
      description: 'Appointment Payment',
      order_id: order.id,
      receipt: order.receipt,
      prefill: {
        name: userData?.name || '',
        email: userData?.email || '',
        contact: userData?.phone || ''
      },
      theme: {
        color: '#4F46E5'
      },
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/user/verify-razorpay`,
            response,
            { headers: { token } }
          )
          if (data.success) {
            toast.success(data.message)
            getUserAppointments()
          } else {
            toast.error(data.message)
          }
        } catch (error) {
          console.log(error)
          toast.error(error.message)
        }
      }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const appointmentPayment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/appointment-payment`,
        { appointmentId },
        { headers: { token } }
      )
      if (data.success) {
        initPay(data.order)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  } 

  // --- Rescheduling Handlers ---
  const openRescheduleModal = (appointment) => {
    const currentDoc = doctors.find(d => d._id === appointment.docId) || appointment.docData
    const generatedSlots = generateDoctorSlots(currentDoc)
    setRescheduleDays(generatedSlots)
    setSelectedDayIndex(0)
    setSelectedTimeSlot('')
    setRescheduleModalAppt(appointment)
  }

  const generateDoctorSlots = (doctor) => {
    if (!doctor) return []
    const today = new Date()
    const allDays = []
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(today)
      dayDate.setDate(today.getDate() + i)

      const currentDate = new Date(dayDate)
      const endTime = new Date(dayDate)
      endTime.setHours(17, 30, 0, 0)

      if (i === 0) {
        const now = new Date()
        const currentHour = now.getHours()
        const currentMinute = now.getMinutes()

        if (currentHour < 10) {
          currentDate.setHours(10, 0, 0, 0)
        } else {
          if (currentMinute < 30) {
            currentDate.setHours(currentHour, 30, 0, 0)
          } else {
            currentDate.setHours(currentHour + 1, 0, 0, 0)
          }
        }
      } else {
        currentDate.setHours(10, 0, 0, 0)
      }

      const day = currentDate.getDate()
      const month = currentDate.getMonth() + 1
      const year = currentDate.getFullYear()
      const slotDate = `${day}_${month}_${year}`
      const timeSlots = []

      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })

        const isSlotBooked = Boolean(
          doctor.slots_booked &&
          doctor.slots_booked[slotDate] &&
          doctor.slots_booked[slotDate].includes(formattedTime)
        )

        if (!isSlotBooked) {
          timeSlots.push(formattedTime)
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      allDays.push({
        dateObj: dayDate,
        dayName: daysOfWeek[dayDate.getDay()],
        dayNum: dayDate.getDate(),
        slotDate,
        slots: timeSlots
      })
    }

    return allDays
  }

  const handleConfirmReschedule = async () => {
    if (!selectedTimeSlot) {
      toast.warning('Please select an available time slot')
      return
    }

    const selectedDay = rescheduleDays[selectedDayIndex]
    if (!selectedDay) return

    setIsRescheduling(true)
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/reschedule-appointment`,
        {
          appointmentId: rescheduleModalAppt._id,
          newSlotDate: selectedDay.slotDate,
          newSlotTime: selectedTimeSlot
        },
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        setRescheduleModalAppt(null)
        getUserAppointments()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsRescheduling(false)
    }
  }

  // --- Review Handlers ---
  const openReviewModal = (appointment) => {
    setRating(5)
    setHoverRating(0)
    setReviewComment('')
    setReviewModalAppt(appointment)
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!reviewComment.trim()) {
      toast.warning('Please write a brief comment describing your consultation experience')
      return
    }

    setIsSubmittingReview(true)
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/add-review`,
        {
          appointmentId: reviewModalAppt._id,
          rating,
          comment: reviewComment.trim()
        },
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        setReviewModalAppt(null)
        getUserAppointments()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmittingReview(false)
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  return (
    <div className='py-6 max-w-4xl'>
      <div className='flex items-center gap-3 pb-4 mb-6 border-b border-slate-100'>
        <h1 className='text-xl sm:text-2xl font-bold text-slate-900 tracking-tight'>
          My Appointments
        </h1>
        <span className='px-3 py-0.5 bg-indigo-50 text-primary text-xs font-semibold rounded-full'>
          {appointments.length} Bookings
        </span>
      </div>

      {appointments.length === 0 ? (
        <div className='text-center py-16 bg-slate-50/50 rounded-2xl border border-slate-100'>
          <p className='text-slate-500 font-medium text-sm'>No appointments booked yet.</p>
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          {appointments.map((item, index) => {
            const hasPrescription = item.prescription && (
              item.prescription.diagnosis ||
              (Array.isArray(item.prescription.medicines) && item.prescription.medicines.length > 0) ||
              item.prescription.notes
            )

            return (
              <div
                className='border border-slate-100 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6'
                key={index}
              >
                {/* Left: Doctor Photo & Info */}
                <div className='flex items-start sm:items-center gap-4 flex-1'>
                  <img
                    className='w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover object-top bg-indigo-50/50 border border-slate-100 flex-shrink-0'
                    src={item.docData?.image}
                    alt={item.docData?.name}
                  />

                  <div className='flex flex-col gap-1 text-sm text-slate-600'>
                    <h2 className='text-slate-900 font-bold text-base sm:text-lg'>
                      {item.docData?.name}
                    </h2>
                    <p className='text-primary text-xs font-semibold'>
                      {item.docData?.speciality}
                    </p>

                    <div className='text-xs text-slate-500 mt-1 leading-relaxed'>
                      <span className='font-semibold text-slate-700'>Clinic Address: </span>
                      {item.docData?.address?.line1}, {item.docData?.address?.line2}
                    </div>

                    <div className='inline-flex items-center gap-1.5 bg-indigo-50/80 border border-indigo-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full w-fit mt-2'>
                      <span className='text-primary'>📅</span>
                      <span>Date & Time: {slotDateFormat(item.slotDate)} | {item.slotTime}</span>
                    </div>

                    {/* Prescription Available Pill */}
                    {hasPrescription && (
                      <div className='inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 rounded-full w-fit mt-1'>
                        <span>✓ Digital Prescription Available</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Action Buttons */}
                <div className='flex flex-row sm:flex-col gap-2.5 w-full sm:w-auto flex-shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100'>
                  {/* Digital Prescription Button */}
                  {hasPrescription && (
                    <button
                      type='button'
                      onClick={() => setPrescriptionModalAppt(item)}
                      className='flex-1 sm:flex-none sm:min-w-44 bg-indigo-50 hover:bg-indigo-100 text-primary border border-indigo-200 px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-2xs'
                    >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                      </svg>
                      <span>View Prescription</span>
                    </button>
                  )}

                  {/* Pay Online Button */}
                  {!item.cancelled && !item.isCompleted && !item.payment && (
                    <button 
                      onClick={() => appointmentPayment(item._id)}  
                      className='flex-1 sm:flex-none sm:min-w-44 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-md shadow-primary/20 hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer text-center'
                    >
                      Pay Online
                    </button>
                  )}

                  {/* Paid Badge */}
                  {!item.cancelled && !item.isCompleted && item.payment && (
                    <button className='flex-1 sm:flex-none sm:min-w-44 bg-emerald-50 text-emerald-600 border border-emerald-200 px-5 py-2.5 rounded-full text-xs font-semibold text-center cursor-default'>
                      Paid
                    </button>
                  )}

                  {/* Reschedule Slot Button */}
                  {!item.cancelled && !item.isCompleted && (
                    <button
                      type='button'
                      onClick={() => openRescheduleModal(item)}
                      className='flex-1 sm:flex-none sm:min-w-44 bg-white border border-indigo-300 text-primary hover:bg-indigo-50 px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer text-center flex items-center justify-center gap-1.5'
                    >
                      <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                      </svg>
                      <span>Reschedule Slot</span>
                    </button>
                  )}

                  {/* Cancel Appointment Button */}
                  {!item.cancelled && !item.isCompleted && (
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className='flex-1 sm:flex-none sm:min-w-44 border border-rose-200 text-rose-500 hover:bg-rose-500 hover:text-white px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer text-center'
                    >
                      Cancel Appointment
                    </button>
                  )}

                  {/* Cancelled State */}
                  {item.cancelled && (
                    <button className='flex-1 sm:flex-none sm:min-w-44 border border-red-200 text-red-500 bg-red-50/50 px-5 py-2.5 rounded-full text-xs font-semibold text-center cursor-default'>
                      Appointment Cancelled
                    </button>
                  )}

                  {/* Completed State & Review Options */}
                  {item.isCompleted && (
                    <div className='flex flex-col gap-2'>
                      <button className='flex-1 sm:flex-none sm:min-w-44 border border-emerald-200 text-emerald-700 bg-emerald-50/60 px-5 py-2.5 rounded-full text-xs font-semibold text-center cursor-default'>
                        Consultation Completed
                      </button>

                      {/* Doctor Review Action */}
                      {!item.isReviewed ? (
                        <button
                          type='button'
                          onClick={() => openReviewModal(item)}
                          className='flex-1 sm:flex-none sm:min-w-44 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-2xs'
                        >
                          <span className='text-amber-500 text-sm'>★</span>
                          <span>Rate Doctor</span>
                        </button>
                      ) : (
                        <span className='flex-1 sm:flex-none sm:min-w-44 text-slate-500 text-xs text-center py-1 font-medium'>
                          ✓ Review Submitted
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* --- MODAL 1: Digital Prescription Viewer (Printable / Downloadable) --- */}
      {prescriptionModalAppt && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto no-print'>
          <div className='bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200'>
            {/* Modal Controls Bar */}
            <div className='px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 no-print'>
              <span className='text-xs font-bold uppercase tracking-wider text-slate-500'>
                Digital Prescription Record
              </span>
              <div className='flex items-center gap-2'>
                <button
                  type='button'
                  onClick={() => window.print()}
                  className='inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-xs transition-colors cursor-pointer'
                >
                  <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z' />
                  </svg>
                  <span>Print / Save PDF</span>
                </button>
                <button
                  type='button'
                  onClick={() => setPrescriptionModalAppt(null)}
                  className='w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer'
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Prescription Body */}
            <div id='printable-prescription' className='p-8 space-y-6 text-slate-800 bg-white'>
              {/* Header / Clinic Details */}
              <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-900'>
                <div>
                  <div className='text-primary font-black text-2xl tracking-tight'>
                    DocNode Healthcare
                  </div>
                  <p className='text-xs text-slate-500'>Comprehensive Clinical Consultation & Care</p>
                </div>
                <div className='text-left sm:text-right text-xs text-slate-600'>
                  <h3 className='text-sm font-bold text-slate-900'>
                    {prescriptionModalAppt.docData?.name}
                  </h3>
                  <p className='text-primary font-medium'>{prescriptionModalAppt.docData?.speciality}</p>
                  <p className='text-slate-500'>{prescriptionModalAppt.docData?.degree}</p>
                  <p className='text-slate-400 mt-0.5'>
                    {prescriptionModalAppt.docData?.address?.line1}, {prescriptionModalAppt.docData?.address?.line2}
                  </p>
                </div>
              </div>

              {/* Patient Meta Bar */}
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs'>
                <div>
                  <span className='text-slate-400 block text-[10px] uppercase font-semibold'>Patient Name</span>
                  <span className='font-bold text-slate-900 text-sm'>
                    {prescriptionModalAppt.userData?.name}
                  </span>
                </div>
                <div>
                  <span className='text-slate-400 block text-[10px] uppercase font-semibold'>Gender / Age</span>
                  <span className='font-semibold text-slate-800 capitalize'>
                    {prescriptionModalAppt.userData?.gender || 'Not specified'}
                  </span>
                </div>
                <div>
                  <span className='text-slate-400 block text-[10px] uppercase font-semibold'>Date of Visit</span>
                  <span className='font-semibold text-slate-800'>
                    {slotDateFormat(prescriptionModalAppt.slotDate)}
                  </span>
                </div>
                <div>
                  <span className='text-slate-400 block text-[10px] uppercase font-semibold'>Appointment ID</span>
                  <span className='font-mono text-slate-600'>
                    #{prescriptionModalAppt._id?.slice(-6)?.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Patient Vitals (if any provided) */}
              {prescriptionModalAppt.prescription?.vitals && (
                (prescriptionModalAppt.prescription.vitals.bp ||
                 prescriptionModalAppt.prescription.vitals.pulse ||
                 prescriptionModalAppt.prescription.vitals.temperature) && (
                  <div>
                    <h4 className='text-xs font-bold uppercase tracking-wider text-slate-500 mb-2'>
                      Vitals at Consultation
                    </h4>
                    <div className='grid grid-cols-3 gap-3 text-xs'>
                      {prescriptionModalAppt.prescription.vitals.bp && (
                        <div className='p-3 bg-slate-50 rounded-xl border border-slate-200/80'>
                          <span className='text-slate-400 block text-[10px] uppercase'>Blood Pressure</span>
                          <span className='font-bold text-slate-900 text-sm'>
                            {prescriptionModalAppt.prescription.vitals.bp} <span className='text-xs font-normal text-slate-500'>mmHg</span>
                          </span>
                        </div>
                      )}
                      {prescriptionModalAppt.prescription.vitals.pulse && (
                        <div className='p-3 bg-slate-50 rounded-xl border border-slate-200/80'>
                          <span className='text-slate-400 block text-[10px] uppercase'>Pulse Rate</span>
                          <span className='font-bold text-slate-900 text-sm'>
                            {prescriptionModalAppt.prescription.vitals.pulse} <span className='text-xs font-normal text-slate-500'>bpm</span>
                          </span>
                        </div>
                      )}
                      {prescriptionModalAppt.prescription.vitals.temperature && (
                        <div className='p-3 bg-slate-50 rounded-xl border border-slate-200/80'>
                          <span className='text-slate-400 block text-[10px] uppercase'>Temperature</span>
                          <span className='font-bold text-slate-900 text-sm'>
                            {prescriptionModalAppt.prescription.vitals.temperature} <span className='text-xs font-normal text-slate-500'>°F</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}

              {/* Diagnosis */}
              {prescriptionModalAppt.prescription?.diagnosis && (
                <div>
                  <h4 className='text-xs font-bold uppercase tracking-wider text-slate-500 mb-1'>
                    Clinical Diagnosis
                  </h4>
                  <div className='p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100 text-sm font-semibold text-slate-900'>
                    {prescriptionModalAppt.prescription.diagnosis}
                  </div>
                </div>
              )}

              {/* Prescribed Medicines Table */}
              {Array.isArray(prescriptionModalAppt.prescription?.medicines) &&
                prescriptionModalAppt.prescription.medicines.length > 0 && (
                  <div>
                    <h4 className='text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5'>
                      <span className='font-serif italic text-base font-bold text-primary'>Rx</span>
                      <span>Prescribed Medications</span>
                    </h4>
                    <div className='border border-slate-200 rounded-xl overflow-hidden'>
                      <table className='w-full text-left text-xs border-collapse'>
                        <thead className='bg-slate-50 font-semibold text-slate-600 border-b border-slate-200'>
                          <tr>
                            <th className='py-2.5 px-3'>#</th>
                            <th className='py-2.5 px-3'>Medicine Name</th>
                            <th className='py-2.5 px-3'>Dosage</th>
                            <th className='py-2.5 px-3'>Frequency</th>
                            <th className='py-2.5 px-3'>Duration</th>
                          </tr>
                        </thead>
                        <tbody className='divide-y divide-slate-100'>
                          {prescriptionModalAppt.prescription.medicines.map((med, idx) => (
                            <tr key={idx} className='hover:bg-slate-50/50'>
                              <td className='py-2.5 px-3 text-slate-400'>{idx + 1}</td>
                              <td className='py-2.5 px-3 font-bold text-slate-900'>{med.name}</td>
                              <td className='py-2.5 px-3 text-slate-700'>{med.dosage}</td>
                              <td className='py-2.5 px-3 text-slate-700'>{med.frequency}</td>
                              <td className='py-2.5 px-3 text-slate-700'>{med.duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              {/* Consultation Notes */}
              {prescriptionModalAppt.prescription?.notes && (
                <div>
                  <h4 className='text-xs font-bold uppercase tracking-wider text-slate-500 mb-1'>
                    Physician Advice & General Notes
                  </h4>
                  <p className='text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200'>
                    {prescriptionModalAppt.prescription.notes}
                  </p>
                </div>
              )}

              {/* Footer Sign-off */}
              <div className='pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 gap-3'>
                <div>
                  <p className='font-semibold text-slate-700'>DocNode Electronic Health Record</p>
                  <p className='text-[11px] text-slate-400'>
                    Issued via Doctor Portal on {new Date(prescriptionModalAppt.prescription?.prescribedAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
                <div className='text-left sm:text-right'>
                  <div className='font-serif italic font-bold text-slate-900 text-sm'>
                    Dr. {prescriptionModalAppt.docData?.name}
                  </div>
                  <span className='text-[11px] text-emerald-600 font-medium'>Verified Practitioner Sign-off</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: One-Click Appointment Rescheduling --- */}
      {rescheduleModalAppt && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto'>
          <div className='bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200'>
            {/* Modal Header */}
            <div className='px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70'>
              <div>
                <h2 className='text-base sm:text-lg font-bold text-slate-900'>
                  Reschedule Appointment
                </h2>
                <p className='text-xs text-slate-500 mt-0.5'>
                  With <strong className='text-slate-700'>{rescheduleModalAppt.docData?.name}</strong> • Current:{' '}
                  {slotDateFormat(rescheduleModalAppt.slotDate)} at {rescheduleModalAppt.slotTime}
                </p>
              </div>
              <button
                type='button'
                onClick={() => setRescheduleModalAppt(null)}
                className='w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer'
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className='p-6 space-y-5'>
              {/* Day Selector Tabs */}
              <div>
                <label className='block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2'>
                  1. Select Date
                </label>
                <div className='flex items-center gap-2 overflow-x-auto pb-2'>
                  {rescheduleDays.map((day, idx) => {
                    const isSelected = selectedDayIndex === idx
                    return (
                      <button
                        key={idx}
                        type='button'
                        onClick={() => {
                          setSelectedDayIndex(idx)
                          setSelectedTimeSlot('')
                        }}
                        className={`flex flex-col items-center justify-center min-w-16 py-2.5 px-3 rounded-xl border text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-primary text-white border-primary shadow-xs font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className='text-[10px] uppercase font-semibold opacity-80'>{day.dayName}</span>
                        <span className='text-base font-extrabold'>{day.dayNum}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Time Slots Grid */}
              <div>
                <label className='block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2'>
                  2. Select New Time Slot
                </label>
                {rescheduleDays[selectedDayIndex]?.slots?.length > 0 ? (
                  <div className='grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1'>
                    {rescheduleDays[selectedDayIndex].slots.map((slot, idx) => {
                      const isSelected = selectedTimeSlot === slot
                      return (
                        <button
                          key={idx}
                          type='button'
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`py-2 px-2 text-xs rounded-xl border transition-all cursor-pointer font-medium text-center ${
                            isSelected
                              ? 'bg-primary text-white border-primary shadow-xs font-bold'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {slot}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <p className='text-xs text-slate-400 py-6 text-center border border-dashed border-slate-200 rounded-xl'>
                    No available time slots for this date. Please pick another day.
                  </p>
                )}
              </div>

              {/* Policy note */}
              <div className='p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-[11px] text-slate-600 leading-relaxed'>
                <span className='font-semibold text-slate-800'>Free Rescheduling: </span>
                Your previous payment of ${rescheduleModalAppt.amount} is fully retained. No additional fee is charged.
              </div>

              {/* Modal Footer */}
              <div className='flex items-center justify-end gap-3 pt-3 border-t border-slate-100'>
                <button
                  type='button'
                  onClick={() => setRescheduleModalAppt(null)}
                  className='px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer'
                >
                  Cancel
                </button>
                <button
                  type='button'
                  disabled={!selectedTimeSlot || isRescheduling}
                  onClick={handleConfirmReschedule}
                  className='px-5 py-2 text-xs font-semibold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50'
                >
                  {isRescheduling ? 'Rescheduling...' : 'Confirm Reschedule'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 3: Doctor Review & Star Rating --- */}
      {reviewModalAppt && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto'>
          <div className='bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200'>
            {/* Modal Header */}
            <div className='px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70'>
              <h2 className='text-base font-bold text-slate-900'>Rate & Review Doctor</h2>
              <button
                type='button'
                onClick={() => setReviewModalAppt(null)}
                className='w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer'
              >
                ✕
              </button>
            </div>

            {/* Review Form */}
            <form onSubmit={handleSubmitReview} className='p-6 space-y-5'>
              {/* Doctor snippet */}
              <div className='flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80'>
                <img
                  src={reviewModalAppt.docData?.image}
                  alt={reviewModalAppt.docData?.name}
                  className='w-12 h-12 rounded-xl object-cover border border-slate-200'
                />
                <div>
                  <h3 className='text-sm font-bold text-slate-900'>{reviewModalAppt.docData?.name}</h3>
                  <p className='text-xs text-primary font-medium'>{reviewModalAppt.docData?.speciality}</p>
                </div>
              </div>

              {/* Star Rating Selector */}
              <div className='text-center py-2'>
                <label className='block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2'>
                  Your Overall Rating
                </label>
                <div className='flex items-center justify-center gap-2'>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating || rating) >= star
                    return (
                      <button
                        key={star}
                        type='button'
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className='text-3xl transition-transform hover:scale-110 cursor-pointer focus:outline-none'
                      >
                        <span className={active ? 'text-amber-400' : 'text-slate-200'}>★</span>
                      </button>
                    )
                  })}
                </div>
                <p className='text-xs font-semibold text-slate-600 mt-2'>
                  {rating === 5 && 'Excellent consultation'}
                  {rating === 4 && 'Very Good experience'}
                  {rating === 3 && 'Average consultation'}
                  {rating === 2 && 'Below expectation'}
                  {rating === 1 && 'Unsatisfactory experience'}
                </p>
              </div>

              {/* Feedback Comment */}
              <div>
                <label className='block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5'>
                  Written Feedback
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder='Share your feedback about doctor attentiveness, explanation of diagnosis, and overall consultation...'
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className='w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800'
                />
              </div>

              {/* Submit Buttons */}
              <div className='flex items-center justify-end gap-3 pt-3 border-t border-slate-100'>
                <button
                  type='button'
                  onClick={() => setReviewModalAppt(null)}
                  className='px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isSubmittingReview}
                  className='px-5 py-2 text-xs font-semibold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-60'
                >
                  {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyAppointment

