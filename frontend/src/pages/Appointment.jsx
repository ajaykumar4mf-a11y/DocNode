import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import axios from 'axios'
import { toast } from 'react-toastify'

const Appointment = () => {
  const { docId } = useParams()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const navigate = useNavigate()

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const [isBooking, setIsBooking] = useState(false)

  const fetchDocInfo = async () => {
    const foundDoc = doctors.find(doc => doc._id === docId)
    setDocInfo(foundDoc)
  }

  const getAvailableSlots = async () => {
    if (!docInfo || docInfo.available === false) {
      setDocSlots([])
      return
    }
    let today = new Date()
    let allSlots = []

    for (let i = 0; i < 7; i++) {
      let dayDate = new Date(today)
      dayDate.setDate(today.getDate() + i)

      let currentDate = new Date(dayDate)
      let endTime = new Date(dayDate)
      endTime.setHours(17, 30, 0, 0)

      if (i === 0) {
        let now = new Date()
        let currentHour = now.getHours()
        let currentMinute = now.getMinutes()

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

      let timeSlots = []

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })

        let day = currentDate.getDate()
        let month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()

        let slotDate = `${day}_${month}_${year}`
        let slotTime = formattedTime

        const isSlotBooked = Boolean(
          docInfo.slots_booked &&
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(slotTime)
        )

        if (!isSlotBooked) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          })
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      allSlots.push(timeSlots)
    }

    setDocSlots(allSlots)
  }

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Please login to book an appointment")
      return navigate("/login")
    }

    if (!docInfo || docInfo.available === false) {
      toast.error("Doctor is currently not available for bookings")
      return
    }

    if (!slotTime) {
      toast.warn("Please select a time slot")
      return
    }

    try {
      setIsBooking(true)
      const date = new Date()
      date.setDate(date.getDate() + slotIndex)
      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()
      const slotDate = `${day}_${month}_${year}`

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointment')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    } finally {
      setIsBooking(false)
    }
  }

  useEffect(() => {
    fetchDocInfo()
  }, [doctors, docId])

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots()
    }
  }, [docInfo])

  if (!docInfo) {
    return (
      <div className='min-h-[50vh] flex items-center justify-center'>
        <div className='w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin'></div>
      </div>
    )
  }

  const isAvailable = docInfo.available !== false

  // Formatted date string for selected slot
  const selectedDateObj = new Date()
  selectedDateObj.setDate(selectedDateObj.getDate() + slotIndex)
  const formattedSelectedDate = selectedDateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })

  return (
    <div className='py-6 max-w-6xl mx-auto'>
      {/* ---------------- Doctor Details Card ---------------- */}
      <div className='flex flex-col md:flex-row gap-6 lg:gap-8 items-stretch'>
        
        {/* Doctor Portrait */}
        <div className='w-full md:w-80 h-80 md:h-auto rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-sm flex-shrink-0 relative'>
          <img
            className={`w-full h-full object-cover object-top ${!isAvailable ? 'filter grayscale-[30%] opacity-85' : ''}`}
            src={docInfo.image}
            alt={docInfo.name}
          />
          <div className='absolute top-3.5 left-3.5'>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-xs border ${
              isAvailable
                ? 'bg-white/95 text-emerald-700 border-emerald-100'
                : 'bg-slate-900/90 text-white border-slate-700'
            }`}>
              <span className='relative flex h-2 w-2'>
                {isAvailable && (
                  <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75'></span>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isAvailable ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
              </span>
              <span>{isAvailable ? 'Accepting Patients' : 'Currently Unavailable'}</span>
            </span>
          </div>
        </div>

        {/* Doctor Info Card */}
        <div className='flex-1 border border-slate-200/80 rounded-3xl p-6 sm:p-8 bg-white shadow-sm flex flex-col justify-between gap-6'>
          <div className='space-y-4'>
            {/* Title & Badges */}
            <div>
              <div className='flex items-center gap-2.5 flex-wrap mb-1.5'>
                <h1 className='text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight'>
                  {docInfo.name}
                </h1>
                <img className='w-5 h-5' src={assets.verified_icon} alt='Verified Doctor' />
              </div>

              <div className='flex items-center gap-2.5 text-xs sm:text-sm text-slate-600 flex-wrap'>
                <span className='font-semibold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg'>
                  {docInfo.speciality}
                </span>
                <span className='text-slate-400'>•</span>
                <span className='font-medium text-slate-600'>{docInfo.degree}</span>
                <span className='text-slate-400'>•</span>
                <span className='font-medium text-slate-600'>{docInfo.experience} Experience</span>
              </div>
            </div>

            {/* About Doctor */}
            <div className='pt-4 border-t border-slate-100'>
              <h3 className='text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5'>
                <span>Biography</span>
              </h3>
              <p className='text-sm text-slate-600 leading-relaxed max-w-3xl'>
                {docInfo.about}
              </p>
            </div>
          </div>

          {/* Clinic Address & Fee Highlights */}
          <div className='pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
            <div className='flex items-start gap-2.5 text-xs text-slate-500'>
              <svg className='w-4 h-4 text-slate-400 mt-0.5 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.8' d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.8' d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
              </svg>
              <div>
                <span className='font-semibold text-slate-800 block text-xs'>Clinic Location</span>
                <span className='text-slate-600'>{docInfo.address?.line1}, {docInfo.address?.line2}</span>
              </div>
            </div>

            <div className='sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-slate-100'>
              <span className='text-slate-400 text-xs block font-medium uppercase'>Consultation Fee</span>
              <span className='text-2xl font-bold text-slate-900'>
                {currencySymbol || '$'}{docInfo.fees}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ---------------- Booking Slots Section ---------------- */}
      {isAvailable ? (
        <div className='mt-8 sm:mt-10 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm'>
          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6'>
            <div>
              <h2 className='text-lg sm:text-xl font-bold text-slate-900 tracking-tight'>
                Select Consultation Slot
              </h2>
              <p className='text-xs text-slate-500 mt-0.5'>
                Choose an available day and time for your appointment
              </p>
            </div>

            {slotTime && (
              <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-800 self-start sm:self-auto'>
                <span className='w-1.5 h-1.5 rounded-full bg-emerald-500'></span>
                <span>{formattedSelectedDate} at {slotTime}</span>
              </div>
            )}
          </div>

          {/* Date Selector Pills */}
          <div className='flex gap-2.5 sm:gap-3 items-center w-full overflow-x-auto pb-3 scrollbar-none'>
            {docSlots.length > 0 &&
              docSlots.map((item, index) => {
                let pillDate = new Date()
                pillDate.setDate(pillDate.getDate() + index)
                const isSelected = slotIndex === index

                return (
                  <button
                    type='button'
                    key={index}
                    onClick={() => {
                      setSlotIndex(index)
                      setSlotTime('')
                    }}
                    className={`flex flex-col items-center justify-center py-3 px-4 min-w-16 rounded-2xl cursor-pointer transition-all duration-200 border text-center ${
                      isSelected
                        ? 'bg-slate-950 text-white border-slate-950 shadow-md shadow-slate-950/20 font-bold scale-102'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`text-[11px] uppercase tracking-wider ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                      {daysOfWeek[pillDate.getDay()]}
                    </span>
                    <span className='text-base font-bold mt-0.5'>
                      {pillDate.getDate()}
                    </span>
                  </button>
                )
              })}
          </div>

          {/* Time Selector Chips */}
          <div className='mt-4 pt-4 border-t border-slate-100'>
            <span className='text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3'>
              Available Times
            </span>

            {docSlots.length > 0 && docSlots[slotIndex]?.length > 0 ? (
              <div className='flex flex-wrap items-center gap-2.5'>
                {docSlots[slotIndex].map((item, index) => {
                  const isTimeSelected = item.time === slotTime
                  return (
                    <button
                      type='button'
                      key={index}
                      onClick={() => setSlotTime(item.time)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 border ${
                        isTimeSelected
                          ? 'bg-primary text-white border-primary shadow-sm shadow-primary/30 scale-105'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {item.time}
                    </button>
                  )
                })}
              </div>
            ) : (
              <p className='text-xs text-slate-400 py-2'>
                No available time slots for this date.
              </p>
            )}
          </div>

          {/* Book Appointment CTA */}
          <div className='mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
            <div>
              {slotTime ? (
                <p className='text-xs text-slate-500'>
                  Appointment scheduled for <span className='font-bold text-slate-800'>{formattedSelectedDate} at {slotTime}</span>
                </p>
              ) : (
                <p className='text-xs text-slate-400'>
                  Please select a time slot above to proceed
                </p>
              )}
            </div>

            <button
              type='button'
              disabled={isBooking || !slotTime}
              onClick={bookAppointment}
              className='bg-slate-950 hover:bg-black text-white font-semibold px-8 py-3 rounded-full shadow-md shadow-slate-950/20 active:scale-95 transition-all duration-200 cursor-pointer text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {isBooking ? (
                <>
                  <span className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
                  <span>Confirming...</span>
                </>
              ) : (
                <span>Confirm Appointment</span>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className='mt-8 sm:mt-10 bg-white border border-slate-200/80 rounded-3xl p-8 text-center flex flex-col items-center justify-center gap-3 shadow-xs'>
          <div className='w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400'>
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
          </div>
          <h3 className='text-base font-bold text-slate-800'>Doctor Currently Unavailable</h3>
          <p className='text-xs text-slate-500 max-w-sm leading-relaxed'>
            This doctor is not accepting new appointments right now. You can check back later or choose another specialist below.
          </p>
        </div>
      )}

      {/* ---------------- Related Doctors Section ---------------- */}
      <div className='mt-12'>
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    </div>
  )
}

export default Appointment
