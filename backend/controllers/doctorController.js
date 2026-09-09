import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";   
import { 
    sendAppointmentCancelledEmail, 
    sendAppointmentCompletedEmail 
} from '../config/emailService.js';


const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email']);
        res.json({ success: true, doctors });
    } catch (error) {
        console.error("Error fetching doctor list:", error);
        res.json({ success: false, message: error.message });
    }
};

// API for doctor login

const doctorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const doctor = await doctorModel.findOne({ email });
        if(!doctor){
            return res.json({ success: false, message: "Doctor not found" });
        }
        const validPassword = await bcrypt.compare(password, doctor.password);
        if(validPassword){
            const token = jwt.sign({id: doctor._id}, process.env.JWT_SECRET, {expiresIn: "7d"});
            res.json({ success: true, message: "Doctor logged in successfully", token});
        }
        else{
            return res.json({ success: false, message: "Invalid password" });
        }
        
    }
    catch (error) {
        console.error("Error in doctor login:", error);
        res.json({ success: false, message: error.message });
    }   
}

// API to get doctor appointments for doctor panel
const appointmentsByDoctor = async (req, res) => {
    try {
        const docId = req.docId || req.body?.docId;
        if (!docId) {
            return res.json({ success: false, message: "Doctor ID missing" });
        }
        const appointments = await appointmentModel.find({ docId });
        res.json({ success: true, appointments });
    } catch (error) {
        console.error("Error fetching doctor appointments:", error);
        res.json({ success: false, message: error.message });
    }
}   

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
    try {
        const docId = req.docId || req.body?.docId;
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        if (appointmentData.docId !== docId) {
            return res.json({ success: false, message: "Unauthorized action" });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        // Release doctor slot
        const { slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(docId);
        if (doctorData) {
            let slots_booked = doctorData.slots_booked || {};
            if (slots_booked[slotDate]) {
                slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
                await doctorModel.findByIdAndUpdate(docId, { slots_booked });
            }
        }

        // Send cancellation notice to patient
        sendAppointmentCancelledEmail({ appointment: appointmentData, cancelledBy: 'Doctor' }).catch(err => {
            console.error('[EmailService] Doctor cancel notification error:', err);
        });

        res.json({ success: true, message: "Appointment cancelled successfully" });
    } catch (error) {
        console.error("Error cancelling doctor appointment:", error);
        res.json({ success: false, message: error.message });
    }
};

// API to mark appointment as completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {
        const docId = req.docId || req.body?.docId;
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        if (appointmentData.docId !== docId) {
            return res.json({ success: false, message: "Unauthorized action" });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });

        // Send consultation completion notice to patient
        sendAppointmentCompletedEmail({ appointment: appointmentData }).catch(err => {
            console.error('[EmailService] Doctor complete notification error:', err);
        });

        res.json({ success: true, message: "Appointment marked as completed" });
    } catch (error) {
        console.error("Error completing doctor appointment:", error);
        res.json({ success: false, message: error.message });
    }
};

// API to get doctor dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {
        const docId = req.docId || req.body?.docId;
        if (!docId) {
            return res.json({ success: false, message: "Doctor ID missing" });
        }

        const appointments = await appointmentModel.find({ docId });

        let earnings = 0;
        const patientsMap = new Set();

        appointments.forEach((item) => {
            if (item.isCompleted || item.payment) {
                earnings += Number(item.amount) || 0;
            }
            if (item.userId) {
                patientsMap.add(String(item.userId));
            }
        });

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patientsMap.size,
            latestAppointments: [...appointments].reverse().slice(0, 5)
        };

        res.json({ success: true, dashData });
    } catch (error) {
        console.error("Error fetching doctor dashboard data:", error);
        res.json({ success: false, message: error.message });
    }
};

// API to get doctor profile for Doctor Panel
const doctorProfile = async (req, res) => {
    try {
        const docId = req.docId || req.body?.docId;
        if (!docId) {
            return res.json({ success: false, message: "Doctor ID missing" });
        }
        const doctorProfileData = await doctorModel.findById(docId).select(['-password']);
        res.json({ success: true, doctorProfileData });
    } catch (error) {
        console.error("Error fetching doctor profile:", error);
        res.json({ success: false, message: error.message });
    }
}

// API to update doctor profile for Doctor Panel
const doctorProfileUpdate = async (req, res) => {
    try {
        const docId = req.docId || req.body?.docId;
        if (!docId) {
            return res.json({ success: false, message: "Doctor ID missing" });
        }
        const { fees, address, available, about } = req.body;
        const updateData = {};
        if (fees !== undefined) updateData.fees = Number(fees);
        if (address !== undefined) updateData.address = address;
        if (available !== undefined) updateData.available = Boolean(available);
        if (about !== undefined) updateData.about = about;

        const doctorProfileData = await doctorModel.findByIdAndUpdate(docId, updateData, { new: true }).select(['-password']);
        res.json({ success: true, doctorProfileData, message: "Profile updated successfully" });
    } catch (error) {
        console.error("Error updating doctor profile:", error);
        res.json({ success: false, message: error.message });
    }
}

// API to toggle doctor availability for Doctor Panel
const changeAvailability = async (req, res) => {
    try {
        const docId = req.docId || req.body?.docId;
        if (!docId) {
            return res.json({ success: false, message: "Doctor ID missing" });
        }
        const docData = await doctorModel.findById(docId);
        if (!docData) {
            return res.json({ success: false, message: "Doctor not found" });
        }
        const updated = await doctorModel.findByIdAndUpdate(docId, { available: !docData.available }, { new: true });
        res.json({ success: true, message: "Availability status updated", available: updated.available });
    } catch (error) {
        console.error("Error toggling doctor availability:", error);
        res.json({ success: false, message: error.message });
    }
};

// API to attach/update digital prescription and clinical notes
const savePrescription = async (req, res) => {
    try {
        const docId = req.docId || req.body?.docId;
        const { appointmentId, diagnosis, notes, vitals, medicines, markComplete } = req.body;

        if (!appointmentId) {
            return res.json({ success: false, message: "Appointment ID is required" });
        }

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        if (appointment.docId !== docId) {
            return res.json({ success: false, message: "Unauthorized action" });
        }

        const prescriptionData = {
            diagnosis: diagnosis || "",
            notes: notes || "",
            vitals: {
                bp: vitals?.bp || "",
                pulse: vitals?.pulse || "",
                temperature: vitals?.temperature || ""
            },
            medicines: Array.isArray(medicines) ? medicines : [],
            prescribedAt: new Date()
        };

        const updateFields = { prescription: prescriptionData };
        if (markComplete) {
            updateFields.isCompleted = true;
        }

        const updatedAppointment = await appointmentModel.findByIdAndUpdate(
            appointmentId,
            updateFields,
            { new: true }
        );

        if (markComplete && !appointment.isCompleted) {
            sendAppointmentCompletedEmail({ appointment: updatedAppointment }).catch(err => {
                console.error('[EmailService] Complete notification error:', err);
            });
        }

        res.json({
            success: true,
            message: "Prescription saved successfully",
            appointment: updatedAppointment
        });
    } catch (error) {
        console.error("Error saving prescription:", error);
        res.json({ success: false, message: error.message });
    }
};

export { 
    doctorList, 
    doctorLogin, 
    appointmentsByDoctor, 
    appointmentCancel, 
    appointmentComplete, 
    doctorDashboard, 
    doctorProfile, 
    doctorProfileUpdate, 
    changeAvailability,
    savePrescription
};