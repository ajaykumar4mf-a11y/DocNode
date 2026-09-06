import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')
    const [doctorData, setDoctorData] = useState(localStorage.getItem('doctorData') ? JSON.parse(localStorage.getItem('doctorData')) : {})
    const [appointments, setAppointments] = useState([])

    const currency = '$'

    const slotDateFormat = (slotDate) => {
        if (!slotDate) return ''
        const dateArray = String(slotDate).split('_')
        if (dateArray.length === 3) {
            const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            const monthName = months[Number(dateArray[1])] || dateArray[1]
            return `${dateArray[0]} ${monthName} ${dateArray[2]}`
        }
        return slotDate
    }

    const calculateAge = (dob) => {
        if (!dob) return 18
        const today = new Date()
        const birthDate = new Date(dob)
        let age = today.getFullYear() - birthDate.getFullYear()
        return age > 0 ? age : 18
    }

    const getAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
                headers: {
                    Authorization: dToken,
                    dtoken: dToken
                }
            })
            if (data.success) {
                setAppointments(Array.isArray(data.appointments) ? [...data.appointments].reverse() : [])
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/doctor/cancel-appointment`, { appointmentId }, {
                headers: {
                    Authorization: dToken,
                    dtoken: dToken
                }
            })
            if (data.success) {
                toast.success(data.message)
                getAppointments()
                getDashData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const completeAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/doctor/complete-appointment`, { appointmentId }, {
                headers: {
                    Authorization: dToken,
                    dtoken: dToken
                }
            })
            if (data.success) {
                toast.success(data.message)
                getAppointments()
                getDashData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const [dashData, setDashData] = useState(false)

    const getDashData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, {
                headers: {
                    Authorization: dToken,
                    dtoken: dToken
                }
            })
            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const [profileData, setProfileData] = useState(false)
    const getProfile = async () => {
        if (!dToken) return
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, {
                headers: {
                    Authorization: dToken,
                    dtoken: dToken
                }
            })
            if (data.success) {
                setProfileData(data.doctorProfileData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const updateProfile = async (profilePayload) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/doctor/profile`, profilePayload, {
                headers: {
                    Authorization: dToken,
                    dtoken: dToken
                }
            })
            if (data.success) {
                toast.success(data.message)
                if (data.doctorProfileData) {
                    setProfileData(data.doctorProfileData)
                } else {
                    getProfile()
                }
                return true
            } else {
                toast.error(data.message)
                return false
            }
        } catch (error) {
            toast.error(error.message)
            return false
        }
    }

    const changeAvailability = async () => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/doctor/change-availability`, {}, {
                headers: {
                    Authorization: dToken,
                    dtoken: dToken
                }
            })
            if (data.success) {
                toast.success(data.message)
                getProfile()
                return true
            } else {
                toast.error(data.message)
                return false
            }
        } catch (error) {
            toast.error(error.message)
            return false
        }
    }

    const value = {
        backendUrl,
        dToken,setDToken,
        doctorData,setDoctorData,
        appointments,setAppointments,getAppointments,
        dashData,setDashData,getDashData,
        cancelAppointment,completeAppointment,
        profileData,setProfileData,getProfile,getProfileData: getProfile,updateProfile,changeAvailability,
        calculateAge,slotDateFormat,currency
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider

