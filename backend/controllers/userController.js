import validator from 'validator'
import usermodel from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import reviewModel from '../models/reviewModel.js';
import razorpay from 'razorpay';
import {
    sendPaymentConfirmationEmail,
    sendBookingConfirmationEmail,
    sendAppointmentCancelledEmail,
    sendAppointmentRescheduledEmail
} from '../config/emailService.js';


// API to register user
const registerUser = async (req, res) => {
    try {
        const { name, phone, email, password } = req.body

        if (!name || !phone || !email || !password) {
            return res.json({ success: false, message: "All fields are required" })
        }

        const cleanPhone = String(phone).replace(/\D/g, '');
        if (cleanPhone.length !== 10) {
            return res.json({ success: false, message: "Phone number must be exactly 10 digits" });
        }

        //validating email and password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Email is invalid" })
        }

        if (!validator.isStrongPassword(password)) {
            return res.json({ success: false, message: "Password is not strong" })
        }

        //checking if user already exists
        const user = await usermodel.findOne({ email })
        if (user) {
            return res.json({ success: false, message: "User already exists" })
        }

        //hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new usermodel({
            name,
            phone: cleanPhone,
            email,
            password: hashedPassword
        })

        await newUser.save()

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" })

        res.json({ success: true, message: "User registered successfully", token })
    }

    catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.json({ success: false, message: "All fields are required" })
        }

        // checking if user exists in database 
        const user = await usermodel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        // matching password with database password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        // jwt token for authentication
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" })

        res.json({ success: true, message: "Login successful", token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to reset user password (Forgot password)
const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, phone } = req.body;

        if (!email || !newPassword) {
            return res.json({ success: false, message: "Email and new password are required" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email address" });
        }

        if (!validator.isStrongPassword(newPassword)) {
            return res.json({ success: false, message: "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol" });
        }

        const user = await usermodel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "No account found with this email address" });
        }

        if (phone) {
            const cleanPhone = String(phone).replace(/\D/g, '');
            const userPhone = String(user.phone || '').replace(/\D/g, '');
            if (cleanPhone && userPhone && cleanPhone !== userPhone) {
                return res.json({ success: false, message: "Phone number does not match account records" });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.json({ success: true, message: "Password reset successfully. You can now log in." });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get user profile data
const getProfileData = async (req, res) => {

    try {
        const { userId } = req.body
        const user = await usermodel.findById(userId).select('-password')
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user })
    }

    catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// API to update user profile
const updateProfile = async (req, res) => {
    try {
        // we are using FormData in frontend so we can't use json parsing, so we are getting data from req.body
        const { userId, name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;

        if (!name || !phone || !address || !dob || !gender) {
            return res.json({ success: false, message: "All fields are required" })
        }

        const cleanPhone = String(phone).replace(/\D/g, '');
        if (cleanPhone.length !== 10) {
            return res.json({ success: false, message: "Phone number must be exactly 10 digits" });
        }

        let parsedAddress = address;
        if (typeof address === "string") {
            try {
                parsedAddress = JSON.parse(address);
            } catch {
                parsedAddress = { line1: address, line2: "" };
            }
        }

        let updatedUser;
        if (imageFile) {
            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
            const imageUrl = imageUpload.secure_url;
            updatedUser = await usermodel.findByIdAndUpdate(userId, { name, phone: cleanPhone, address: parsedAddress, dob, gender, image: imageUrl }, { new: true });
        } else {
            updatedUser = await usermodel.findByIdAndUpdate(userId, { name, phone: cleanPhone, address: parsedAddress, dob, gender }, { new: true });
        }

        if (!updatedUser) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "Profile updated successfully", user: updatedUser })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to book appointment
const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body;

        const doctor = await doctorModel.findById(docId).select('-password');
        const user = await usermodel.findById(userId).select('-password');

        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        if (!doctor.available) {
            return res.json({ success: false, message: "Doctor is not available" });
        }

        // checking for slot availability
        let slots_booked = doctor.slots_booked || {};

        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: "Slot is already booked" });
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            slots_booked[slotDate] = [slotTime];
        }

        const userData = await usermodel.findById(userId).select('-password');
        let docData = await doctorModel.findById(docId).select('-password');

        docData = docData.toObject ? docData.toObject() : docData;
        delete docData.slots_booked;

        const newAppointment = new appointmentModel({
            userId,
            docId,
            slotDate,
            slotTime,
            userData,
            docData,
            amount: doctor.fees,
            date: Date.now(),
            cancelled: false,
            payment: false,
            isCompleted: false
        });

        await newAppointment.save();

        // save new slots data in doctor model
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        // Send booking confirmation email asynchronously
        sendBookingConfirmationEmail({ appointment: newAppointment }).catch(err => {
            console.error('[EmailService] Booking notification error:', err);
        });

        res.json({ success: true, message: "Appointment booked successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


// API to get user appointments for frontend my-appointments page
const listAppointments = async (req, res) => {
    try {
        const { userId } = req.body;
        const appointments = await appointmentModel.find({ userId });
        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        // verify appointment user
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: "Unauthorized action" });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        // releasing doctor slot
        const { docId, slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(docId);
        if (doctorData) {
            let slots_booked = doctorData.slots_booked || {};
            if (slots_booked[slotDate]) {
                slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
                await doctorModel.findByIdAndUpdate(docId, { slots_booked });
            }
        }

        // Send appointment cancellation email
        sendAppointmentCancelledEmail({ appointment: appointmentData, cancelledBy: 'Patient' }).catch(err => {
            console.error('[EmailService] Cancellation notification error:', err);
        });

        res.json({ success: true, message: "Appointment Cancelled" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// API to make payment of appointment using razorpay
const appointmentPayment = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: "Appointment cancelled or not found" });
        }

        // creating options for order
        const options = {
            amount: appointmentData.amount * 100,  // razorpay expects amount in paisa
            currency: process.env.CURRENCY || "INR",
            receipt: appointmentId,
        };

        // calling razorpay API to create order
        const order = await razorpayInstance.orders.create(options);
        res.json({ success: true, order });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to verify razorpay payment
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        if (orderInfo.status === 'paid') {
            const updatedAppointment = await appointmentModel.findByIdAndUpdate(
                orderInfo.receipt,
                { payment: true },
                { new: true }
            );

            // Send payment confirmation and receipt email
            if (updatedAppointment) {
                sendPaymentConfirmationEmail({
                    appointment: updatedAppointment,
                    paymentId: orderInfo.id || razorpay_order_id,
                    orderId: razorpay_order_id
                }).catch(err => {
                    console.error('[EmailService] Payment receipt error:', err);
                });
            }

            res.json({ success: true, message: "Payment Successful" });
        } else {
            res.json({ success: false, message: "Payment Failed" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to reschedule appointment slot without re-payment or cancellation
const rescheduleAppointment = async (req, res) => {
    try {
        const { userId, appointmentId, newSlotDate, newSlotTime } = req.body;

        if (!appointmentId || !newSlotDate || !newSlotTime) {
            return res.json({ success: false, message: "Appointment ID, new date, and new time slot are required" });
        }

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        if (appointment.userId !== userId) {
            return res.json({ success: false, message: "Unauthorized action" });
        }

        if (appointment.cancelled) {
            return res.json({ success: false, message: "Cannot reschedule a cancelled appointment" });
        }

        if (appointment.isCompleted) {
            return res.json({ success: false, message: "Cannot reschedule a completed consultation" });
        }

        const doctor = await doctorModel.findById(appointment.docId);
        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        if (!doctor.available) {
            return res.json({ success: false, message: "Doctor is currently unavailable for bookings" });
        }

        // Check if new slot is already booked
        let slots_booked = doctor.slots_booked || {};
        if (slots_booked[newSlotDate] && slots_booked[newSlotDate].includes(newSlotTime)) {
            return res.json({ success: false, message: "The selected time slot is already booked. Please choose another slot." });
        }

        const previousSlot = {
            date: appointment.slotDate,
            time: appointment.slotTime
        };

        // Release old slot
        if (slots_booked[previousSlot.date]) {
            slots_booked[previousSlot.date] = slots_booked[previousSlot.date].filter(time => time !== previousSlot.time);
            if (slots_booked[previousSlot.date].length === 0) {
                delete slots_booked[previousSlot.date];
            }
        }

        // Book new slot
        if (slots_booked[newSlotDate]) {
            slots_booked[newSlotDate].push(newSlotTime);
        } else {
            slots_booked[newSlotDate] = [newSlotTime];
        }

        await doctorModel.findByIdAndUpdate(appointment.docId, { slots_booked });

        const updatedAppointment = await appointmentModel.findByIdAndUpdate(
            appointmentId,
            { slotDate: newSlotDate, slotTime: newSlotTime },
            { new: true }
        );

        // Send reschedule confirmation notification
        sendAppointmentRescheduledEmail({
            appointment: updatedAppointment,
            previousSlot
        }).catch(err => {
            console.error('[EmailService] Reschedule notification error:', err);
        });

        res.json({
            success: true,
            message: "Appointment rescheduled successfully",
            appointment: updatedAppointment
        });
    } catch (error) {
        console.error("Error rescheduling appointment:", error);
        res.json({ success: false, message: error.message });
    }
};

// API to add doctor review from completed appointment
const addReview = async (req, res) => {
    try {
        const { userId, appointmentId, rating, comment } = req.body;

        if (!appointmentId || !rating || !comment) {
            return res.json({ success: false, message: "Appointment ID, rating, and feedback comment are required" });
        }

        const numRating = Number(rating);
        if (isNaN(numRating) || numRating < 1 || numRating > 5) {
            return res.json({ success: false, message: "Rating must be between 1 and 5" });
        }

        const trimmedComment = String(comment).trim();
        if (trimmedComment.length < 5) {
            return res.json({ success: false, message: "Please provide a detailed comment (at least 5 characters)" });
        }

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        if (appointment.userId !== userId) {
            return res.json({ success: false, message: "Unauthorized: You can only review your own consultations" });
        }

        if (!appointment.isCompleted || appointment.cancelled) {
            return res.json({ success: false, message: "Only verified completed consultations can be reviewed" });
        }

        const existingReview = await reviewModel.findOne({ appointmentId });
        if (existingReview) {
            return res.json({ success: false, message: "You have already submitted a review for this consultation" });
        }

        const user = await usermodel.findById(userId);

        const newReview = new reviewModel({
            docId: appointment.docId,
            userId,
            appointmentId,
            userName: user?.name || appointment.userData?.name || "Verified Patient",
            userImage: user?.image || appointment.userData?.image || "",
            rating: numRating,
            comment: trimmedComment,
            date: Date.now()
        });

        await newReview.save();

        await appointmentModel.findByIdAndUpdate(appointmentId, { isReviewed: true });

        // Recalculate doctor averageRating & reviewCount
        const docReviews = await reviewModel.find({ docId: appointment.docId });
        const reviewCount = docReviews.length;
        const totalRating = docReviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = reviewCount > 0 ? Number((totalRating / reviewCount).toFixed(1)) : 0;

        await doctorModel.findByIdAndUpdate(appointment.docId, {
            averageRating,
            reviewCount
        });

        res.json({
            success: true,
            message: "Review submitted successfully! Thank you for your feedback.",
            review: newReview,
            averageRating,
            reviewCount
        });
    } catch (error) {
        console.error("Error adding review:", error);
        res.json({ success: false, message: error.message });
    }
};

// API to get verified reviews for a doctor
const getDoctorReviews = async (req, res) => {
    try {
        const { docId } = req.params;
        if (!docId) {
            return res.json({ success: false, message: "Doctor ID is required" });
        }

        const reviews = await reviewModel.find({ docId }).sort({ date: -1 });
        res.json({ success: true, reviews });
    } catch (error) {
        console.error("Error fetching doctor reviews:", error);
        res.json({ success: false, message: error.message });
    }
};

export { 
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
};  
