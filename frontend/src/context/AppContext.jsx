import { createContext, useEffect, useState } from "react";
import { doctors as defaultDoctors } from "../assets/assets";

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currencySymbol = '$'
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000'
    const [doctors, setDoctors] = useState(defaultDoctors)
    const [token, setToken] = useState(false)

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

    useEffect(() => {
        getDoctorsData()
    }, [])

    const value = {
        doctors,
        getDoctorsData,
        currencySymbol,
        cuurencySymbol: currencySymbol,
        token,
        setToken,
        backendUrl
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider