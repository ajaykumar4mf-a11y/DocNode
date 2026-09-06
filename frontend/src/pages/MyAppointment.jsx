import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyAppointment = () => {
  const { backendUrl, token, getDoctorsData, userData, slotDateFormat } = useContext(AppContext)

  const [appointments, setAppointments] = useState([])

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
          {appointments.map((item, index) => (
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
                </div>
              </div>

              {/* Right: Action Buttons */}
              <div className='flex flex-row sm:flex-col gap-3 w-full sm:w-auto flex-shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100'>
                {!item.cancelled && !item.isCompleted && !item.payment && (
                  <button onClick={() => appointmentPayment(item._id)}  className='flex-1 sm:flex-none sm:min-w-44 bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-full text-xs font-semibold shadow-md shadow-primary/20 hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer text-center'>
                    Pay Online
                  </button>
                )}

                {!item.cancelled && !item.isCompleted && item.payment && (
                  <button className='flex-1 sm:flex-none sm:min-w-44 bg-emerald-50 text-emerald-600 border border-emerald-200 px-6 py-2.5 rounded-full text-xs font-semibold text-center cursor-default'>
                    Paid
                  </button>
                )}

                {!item.cancelled && !item.isCompleted && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className='flex-1 sm:flex-none sm:min-w-44 border border-rose-200 text-rose-500 hover:bg-rose-500 hover:text-white px-6 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer text-center'
                  >
                    Cancel Appointment
                  </button>
                )}

                {item.cancelled && (
                  <button className='flex-1 sm:flex-none sm:min-w-44 border border-red-500 text-red-500 px-6 py-2.5 rounded-full text-xs font-semibold text-center cursor-default'>
                    Appointment Cancelled
                  </button>
                )}

                {item.isCompleted && (
                  <button className='flex-1 sm:flex-none sm:min-w-44 border border-emerald-500 text-emerald-500 px-6 py-2.5 rounded-full text-xs font-semibold text-center cursor-default'>
                    Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyAppointment
