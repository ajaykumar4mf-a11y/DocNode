import { createContext, useEffect, useState } from "react";
import { doctors as defaultDoctors } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currencySymbol = '$'
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000'
    const [doctors, setDoctors] = useState(defaultDoctors)
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)
    const [userData, setUserData] = useState(false)

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