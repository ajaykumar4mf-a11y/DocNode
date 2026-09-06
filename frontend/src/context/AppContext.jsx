import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currencySymbol = '$'
    const currency = '$'
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000'
    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)
    const [userData, setUserData] = useState(false)

    const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    // Slot date format matching Admin and Doctor context
    const slotDateFormat = (slotDate) => {
        if (!slotDate || slotDate === 'Not Selected' || slotDate === 'Not specified') return ''
        const cleanDate = String(slotDate).trim()

        if (cleanDate.includes('_')) {
            const dateArray = cleanDate.split('_')
            if (dateArray.length === 3) {
                const monthName = months[Number(dateArray[1])] || dateArray[1]
                return `${parseInt(dateArray[0], 10)} ${monthName} ${dateArray[2]}`
            }
        }

        if (cleanDate.includes('-')) {
            const parts = cleanDate.split('-')
            if (parts.length === 3) {
                if (parts[0].length === 4) {
                    const year = parseInt(parts[0], 10)
                    const month = months[Number(parts[1])] || parts[1]
                    const day = parseInt(parts[2], 10)
                    if (!isNaN(day) && !isNaN(year)) {
                        return `${day} ${month} ${year}`
                    }
                } else if (parts[2].length >= 4) {
                    const day = parseInt(parts[0], 10)
                    const month = months[Number(parts[1])] || parts[1]
                    const year = parseInt(parts[2], 10)
                    return `${day} ${month} ${year}`
                }
            }
        }

        const parsedDate = new Date(cleanDate)
        if (!isNaN(parsedDate.getTime())) {
            return `${parsedDate.getUTCDate()} ${months[parsedDate.getUTCMonth() + 1]} ${parsedDate.getUTCFullYear()}`
        }

        return cleanDate
    }

    // Calculate age matching Admin and Doctor context
    const calculateAge = (dob) => {
        if (!dob) return 18
        const today = new Date()
        const birthDate = new Date(dob)
        let age = today.getFullYear() - birthDate.getFullYear()
        return age > 0 ? age : 18
    }

    const getDoctorsData = async () => {
        try {
            const res = await fetch(backendUrl + '/api/doctor/list')
            const data = await res.json()
            if (data.success && data.doctors && data.doctors.length > 0) {
                setDoctors(data.doctors)
            }
        } catch (error) {
            console.error("Error fetching doctors data:", error)
        }
    }

    const getProfileData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/get-profile', {
                headers: {
                    token: token,
                    Authorization: token
                }
            })
            if (data.success) {
                setUserData(data.user)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error("Error fetching profile:", error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getDoctorsData()
    }, [])

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token)
            getProfileData()
        } else {
            localStorage.removeItem('token')
            setUserData(false)
        }
    }, [token]) 

    const value = {
        doctors,
        getDoctorsData,
        currencySymbol,
        cuurencySymbol: currencySymbol,
        currency,
        slotDateFormat,
        calculateAge,
        months,
        token,
        setToken,
        backendUrl,
        userData,
        setUserData,
        getProfileData,
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider