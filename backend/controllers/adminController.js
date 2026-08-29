import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

// API for adding doctor
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body || {};
        const imageFile = req.file;

        // Checking for required data
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" });
        }

        if (!imageFile) {
            return res.json({ success: false, message: "Image is required" });
        }

        // Validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        // Validating password length
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // Hashing doctor password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload image to Cloudinary
        let imageUrl = "";
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            imageUrl = imageUpload.secure_url;
        }

        // Address formatting
        let parsedAddress = address;
        if (typeof address === "string") {
            try {
                parsedAddress = JSON.parse(address);
            } catch {
                parsedAddress = { line1: address, line2: "" };
            }
        }

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees: Number(fees),
            address: parsedAddress,
            date: Date.now()
        };

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        return res.json({ success: true, message: "Doctor Added" });

    } catch (error) {
        console.error("Error adding doctor:", error);
        return res.json({ success: false, message: error.message });
    }
};

// API for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.json({ success: false, message: "Missing Details" });
        }

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD || process.env.ADIMIN_PASSWORD;

        if (email === adminEmail && password === adminPassword) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET || "DocNodeAdminSecretKey2026");
            return res.json({ success: true, token });
        } else {
            return res.json({ success: false, message: "Invalid credentials" });
        }

    } catch (error) {
        console.error("Error in admin login:", error);
        return res.json({ success: false, message: error.message });
    }
};

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password');
        return res.json({ success: true, doctors });
    } catch (error) {
        console.error("Error fetching all doctors:", error);
        return res.json({ success: false, message: error.message });
    }
};

// API to get all appointments list for admin
const appointmentsAdmin = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({});
        res.json({ success: true, appointments });
    } catch (error) {
        console.error("Error fetching admin appointments:", error);
        res.json({ success: false, message: error.message });
    }
};

// API for appointment cancellation by admin
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        // Release doctor slot
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
        console.error("Error cancelling appointment:", error);
        res.json({ success: false, message: error.message });
    }
};

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {
        const doctors = await doctorModel.find({});
        const users = await userModel.find({});
        const appointments = await appointmentModel.find({});

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        };

        res.json({ success: true, dashData });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.json({ success: false, message: error.message });
    }
};

// API to change doctor availability for admin panel
const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body;
        const docData = await doctorModel.findById(docId);
        if (!docData) {
            return res.json({ success: false, message: "Doctor not found" });
        }
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available });
        res.json({ success: true, message: "Availability Changed" });
    } catch (error) {
        console.error("Error changing doctor availability:", error);
        res.json({ success: false, message: error.message });
    }
};

export { addDoctor, adminLogin, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard, changeAvailability };