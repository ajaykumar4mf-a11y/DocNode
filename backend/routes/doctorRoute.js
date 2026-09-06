import express from "express";
import { doctorList, doctorLogin, appointmentsByDoctor, appointmentCancel, appointmentComplete, doctorDashboard, doctorProfile, doctorProfileUpdate, changeAvailability } from "../controllers/doctorController.js";
import authDoctor from "../middlewares/authDoctor.js";

const doctorRouter = express.Router();

doctorRouter.get("/list", doctorList);
doctorRouter.post("/login", doctorLogin);
doctorRouter.get("/appointments", authDoctor, appointmentsByDoctor);
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel);
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete);
doctorRouter.get("/dashboard", authDoctor, doctorDashboard);
doctorRouter.get("/profile", authDoctor, doctorProfile);
doctorRouter.post("/profile", authDoctor, doctorProfileUpdate); 
doctorRouter.post("/change-availability", authDoctor, changeAvailability);

export default doctorRouter;
