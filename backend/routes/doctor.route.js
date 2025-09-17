import express from "express";
import {
  appointmentDoctor,
  doctorList,
  doctorLogin,
  appointmentCancelled,
  appointmentCompleted,
  doctorDashboard,
  updateProfile,
  doctorProfile,
} from "../controllers/doctor.controller.js";
import authDoctor from "../middlewares/authDoctor.js";

const doctorRouter = express.Router();

doctorRouter.get("/list", doctorList);
doctorRouter.post("/login", doctorLogin);
doctorRouter.get("/doctor-appointment", authDoctor, appointmentDoctor);
doctorRouter.post("/complete-appointment", authDoctor, appointmentCompleted);
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancelled);
doctorRouter.get("/dashboard", authDoctor, doctorDashboard);
doctorRouter.get("/profile", authDoctor, doctorProfile);
doctorRouter.post("/update-profile", authDoctor, updateProfile);

export default doctorRouter;
