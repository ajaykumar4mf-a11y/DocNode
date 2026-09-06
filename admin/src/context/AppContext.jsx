import { createContext } from "react";

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const slotDateFormat = (slotDate) => {
        if (!slotDate) return ''
        const dateArray = slotDate.split('_')
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return `${dateArray[0]} ${months[dateArray[1] - 1]} ${dateArray[2].slice(-2)}`
    }

    const value = {
        slotDateFormat
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider

