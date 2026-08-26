import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'

const Appointment = () => {
  const { docId } = useParams()
  const { doctors, cuurencySymbol } = useContext(AppContext)
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  const fetchDocInfo = async () => {
    const foundDoc = doctors.find(doc => doc._id === docId)
    setDocInfo(foundDoc)
  }

  const getAvailableSlots = async () => {
    setDocSlots([])
    let today = new Date()

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      let endTime = new Date(today)
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0)

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots = []

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })

        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        })

        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      setDocSlots(prev => [...prev, timeSlots])
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

  return (
    docInfo && (
      <div className='py-6 md:px-4'>
        {/* ---------------- Doctor Details Card ---------------- */}
        <div className='flex flex-col sm:flex-row gap-6 sm:gap-8 items-stretch'>
          {/* Doctor Portrait */}
          <div className='w-full sm:w-72 sm:max-w-72 h-80 sm:h-auto rounded-3xl overflow-hidden bg-gradient-to-b from-indigo-50/80 to-indigo-100/50 border border-slate-100 shadow-xl shadow-slate-100/60 flex-shrink-0'>
            <img
              className='w-full h-full object-cover object-top'
              src={docInfo.image}
              alt={docInfo.name}
            />
          </div>

          {/* Doctor Info Card */}
          <div className='flex-1 border border-slate-100 rounded-3xl p-6 sm:p-8 bg-white shadow-xl shadow-slate-100/60 flex flex-col justify-between gap-6'>
            {/* Title & Badges */}
            <div className='space-y-3'>
              <div className='flex items-center gap-2.5 flex-wrap'>
                <h1 className='text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight'>
                  {docInfo.name}
                </h1>
                <img className='w-5 h-5' src={assets.verified_icon} alt='Verified Doctor' />
              </div>

              <div className='flex items-center gap-3 text-sm text-slate-600 flex-wrap'>
                <p className='font-medium text-slate-700'>
                  {docInfo.degree} - {docInfo.speciality}
                </p>
                <span className='px-3 py-1 bg-indigo-50 text-primary text-xs font-semibold rounded-full border border-indigo-100'>
                  {docInfo.experience} Experience
                </span>
              </div>
            </div>

            {/* About Doctor */}
            <div className='space-y-2 pt-3 border-t border-slate-100'>
              <p className='flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider'>
                ABOUT DOCTOR <img className='w-3.5 h-3.5 opacity-60' src={assets.info_icon} alt='' />
              </p>
              <p className='text-sm text-slate-600 leading-relaxed max-w-2xl'>
                {docInfo.about}
              </p>
            </div>

            {/* Clinic Address & Fee */}
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-slate-100'>
              <div className='text-xs text-slate-500'>
                <span className='font-semibold text-slate-700'>Clinic Address: </span>
                {docInfo.address?.line1}, {docInfo.address?.line2}
              </div>

              <div className='text-sm font-semibold text-slate-600'>
                Appointment Fee:{' '}
                <span className='text-slate-900 font-bold text-lg ml-1'>
                  {cuurencySymbol}{docInfo.fees}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- Booking Slots Section ---------------- */}
        <div className='mt-10 sm:mt-12 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100/60'>
          <h2 className='text-lg font-bold text-slate-900 tracking-tight mb-4'>
            Available Booking Slots
          </h2>

          {/* Date Selector Pills */}
          <div className='flex gap-3 items-center w-full overflow-x-auto pb-4 scrollbar-none'>
            {docSlots.length > 0 &&
              docSlots.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setSlotIndex(index)}
                  className={`flex flex-col items-center justify-center py-3.5 px-4 min-w-16 rounded-2xl cursor-pointer transition-all duration-200 ${
                    slotIndex === index
                      ? 'bg-primary text-white shadow-lg shadow-primary/25 font-bold scale-105'
                      : 'border border-slate-200/80 bg-white text-slate-600 hover:border-slate-300 font-semibold'
                  }`}
                >
                  <span className='text-xs opacity-80 uppercase'>
                    {item[0] && daysOfWeek[item[0].datetime.getDay()]}
                  </span>
                  <span className='text-base font-bold mt-0.5'>
                    {item[0] && item[0].datetime.getDate()}
                  </span>
                </div>
              ))}
          </div>

          {/* Time Selector Chips */}
          <div className='flex items-center gap-2.5 w-full overflow-x-auto py-2 scrollbar-none mt-2'>
            {docSlots.length > 0 &&
              docSlots[slotIndex]?.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSlotTime(item.time)}
                  className={`flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 ${
                    item.time === slotTime
                      ? 'bg-primary text-white shadow-md shadow-primary/25 scale-105'
                      : 'bg-slate-50 text-slate-600 border border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  {item.time}
                </button>
              ))}
          </div>

          {/* Book Appointment CTA */}
          <div className='mt-6 pt-4 border-t border-slate-100'>
            <button className='bg-primary hover:bg-primary/90 text-white font-semibold px-9 py-3.5 rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-95 transition-all duration-200 cursor-pointer text-sm'>
              Book an Appointment
            </button>
          </div>
        </div>

        {/* ---------------- Related Doctors Section ---------------- */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  )
}

export default Appointment
