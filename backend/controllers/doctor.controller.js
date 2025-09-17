import doctorModel from "../models/doctor.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointment.model.js";

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    const doctorData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !doctorData.available,
    });

    res.json({
      success: true,
      message: "Availability changed successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//API for doctor login

const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      res.json({
        success: false,
        message: "Invalid Credential",
      });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);

    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      res.json({
        success: true,
        token,
      });
    } else {
      res.json({
        success: false,
        message: "Invalid token",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to get Doctor Apoointments for doctor panel

const appointmentDoctor = async (req, res) => {
  try {
    const docId = req.docId;
    const appointment = await appointmentModel.find({ docId });

    res.json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//API to mark appointment completed

const appointmentCompleted = async (req, res) => {
  try {
    const docId = req.docId;
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId == docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.json({
        success: true,
        message: "Appointment Completed",
      });
    } else {
      return res.json({
        success: false,
        message: "Mark Failed",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//API to mark appointment cancel

const appointmentCancelled = async (req, res) => {
  try {
    const docId = req.docId;
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId == docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      return res.json({
        success: true,
        message: "Appointment Cancelled",
      });
    } else {
      return res.json({
        success: false,
        message: "Cancellation Failed",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ALI to get dashboard data

const doctorDashboard = async (req, res) => {
  try {
    const docId = req.docId;
    const appointment = await appointmentModel.find({ docId });

    let earning = 0;

    appointment.map((item) => {
      if (item.isCompleted) {
        earning += item.amount;
      }
    });

    let patients = [];

    appointment.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earning,
      patients: patients.length,
      appointment: appointment.length,
      latestAppointments: appointment.reverse().slice(0, 5),
    };

    res.json({
      success: true,
      dashData,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to get Doctor profile

const doctorProfile = async (req, res) => {
  try {
    const docId = req.docId;

    const profileData = await doctorModel.findById(docId).select("-password");

    res.json({
      success: true,
      profileData,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// API for update Doctor Profile Data

const updateProfile = async (req, res) => {
  try {
    const docId = req.docId;
    const { fee, address, available } = req.body;

    await doctorModel.findByIdAndUpdate(docId, { fee, address, available });

    res.json({
      success: true,
      message: "Profile Updated",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export {
  changeAvailability,
  doctorList,
  doctorLogin,
  appointmentDoctor,
  appointmentCompleted,
  appointmentCancelled,
  doctorDashboard,
  doctorProfile,
  updateProfile,
};
