import express from 'express'
import { 
    registerUser, 
    loginUser, 
    resetPassword, 
    getProfileData, 
    updateProfile, 
    bookAppointment, 
    listAppointments, 
    cancelAppointment, 
    appointmentPayment, 
    verifyRazorpay,
    rescheduleAppointment,
    addReview,
    getDoctorReviews
} from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'
const userRouter = express.Router() 

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/reset-password", resetPassword)
userRouter.get("/get-profile", authUser, getProfileData)
userRouter.post("/update-profile", upload.single("image"), authUser, updateProfile)
userRouter.post("/book-appointment", authUser, bookAppointment)
userRouter.get("/list-appointments", authUser, listAppointments)
userRouter.post("/cancel-appointment", authUser, cancelAppointment)
userRouter.post("/reschedule-appointment", authUser, rescheduleAppointment)
userRouter.post("/appointment-payment", authUser, appointmentPayment)
userRouter.post("/verify-razorpay", authUser, verifyRazorpay)
userRouter.post("/add-review", authUser, addReview)
userRouter.get("/doctor-reviews/:docId", getDoctorReviews)

export default userRouter   