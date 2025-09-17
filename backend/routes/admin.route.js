import express from "express";
import {
  addDoctor,
  allDoctors,
  loginAdmin,
  appointmentAdmin,
  cancelAppointment,
  adminDashboard,
} from "../controllers/admin.controller.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailability } from "../controllers/doctor.controller.js";

const adminRouter = express.Router();

adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/all-doctors", authAdmin, allDoctors);
adminRouter.post("/change-availability", authAdmin, changeAvailability);
adminRouter.get("/appointments", authAdmin, appointmentAdmin);
adminRouter.post("/cancel-appointment", authAdmin, cancelAppointment);
adminRouter.get("/dash-data", authAdmin, adminDashboard);

export default adminRouter;
