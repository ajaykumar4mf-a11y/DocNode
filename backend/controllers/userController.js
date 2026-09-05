import validator from 'validator'
import usermodel from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import razorpay from 'razorpay';


// API to register user
const registerUser = async (req, res) => {
    try {
        const { name, phone, email, password } = req.body

        if (!name || !phone || !email || !password) {
            return res.json({ success: false, message: "All fields are required" })
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
            phone,
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

// API to get user profile data
const getProfileData = async (req, res) => {
   
    try{
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
const updateProfile = async(req, res) =>{
    try {   
        // we are using FormData in frontend so we can't use json parsing, so we are getting data from req.body
        const {userId,name,phone, address, dob, gender} = req.body;
        const imageFile = req.file;

        if(!name || !phone || !address || !dob || !gender){
            return res.json({success: false, message: "All fields are required"})
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
        if(imageFile) {
            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
            const imageUrl = imageUpload.secure_url;
            updatedUser = await usermodel.findByIdAndUpdate(userId, {name, phone, address: parsedAddress, dob, gender, image: imageUrl}, { new: true });
        } else {
            updatedUser = await usermodel.findByIdAndUpdate(userId, {name, phone, address: parsedAddress, dob, gender}, { new: true });
        }

        if (!updatedUser) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "Profile updated successfully", user: updatedUser })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message})
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
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
            res.json({ success: true, message: "Payment Successful" });
        } else {
            res.json({ success: false, message: "Payment Failed" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { registerUser, loginUser, getProfileData, updateProfile, bookAppointment, listAppointments, cancelAppointment, appointmentPayment, verifyRazorpay }  
