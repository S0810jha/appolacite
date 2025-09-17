import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctor.model.js";
import appointmentModel from "../models/appointment.model.js";
import razorpay from "razorpay";

// API to register USER

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Enter VALID Email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Enter STRONG Password",
      });
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//API for user login

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "user not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({
        success: true,
        token,
      });
    } else {
      res.json({
        success: false,
        message: "Invalid Credentials",
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

// API to get user data

const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const userData = await userModel.findById(userId).select("-password");

    if (!userData) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      userData,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// API for update user profile

const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, phone, address, dob, gender } = req.body;

    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({
        success: false,
        message: "Data missing",
      });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      dob,
      address: JSON.parse(address),
      gender,
    });

    if (imageFile) {
      // upload image to the cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageUrl = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageUrl });
    }

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

//API to book appointment

const bookAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const { docId, slotDate, slotTime } = req.body;

    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData.available) {
      return res.json({
        success: false,
        message: "Doctor not available now",
      });
    }

    let slots_booked = docData.slots_booked;

    //checking for slots availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({
          success: false,
          message: "Slot not available",
        });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");

    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fee,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // Save new slots data in docData

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({
      success: true,
      message: "Appointment Booked",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//API to get user appointment for frontend my appointment page

const listAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const appointment = await appointmentModel.find({ userId });

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

// Api to cancel the appointment

const cancelAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    //varify appointment user
    if (appointmentData.userId !== userId) {
      return res.json({
        success: false,
        message: "Unauthorized access",
      });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    //releasing doctor slot

    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({
      success: true,
      message: "Appointment Cancelled",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to make payment of appointment using razorpay

// const razorpayInstance = new razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET
// })

// const payment = async(req, res) =>{

//     try {

//     const {appointmentId} = req.body
//     const appointmentData = await appointmentModel.findById(appointmentId)

//     if(!appointmentData || appointmentData.cancelled){
//         return res.json({
//             success: false,
//             message: "Appointment cancelled or Not found"
//         })
//     }

//     // create option for payment

//     const options = {
//         amount: appointmentData.amount * 100,
//         currency: process.env.CURRENCY,
//         receipt: appointmentId,
//     }

//     // create of an order

//     const order = await razorpayInstance.orders.create(options)

//     res.json({
//         success:true,
//         order
//     })

//     } catch (error) {
//         console.log(error)
//         res.json({
//             success: false,
//             message: error.message
//         })
//     }

// }

// // API to verify payment

// const verifyPayment = async(req, res)=>{

//     try {

//         const {razorpay_order_id} = req.body
//         const orderInfo = await razorpayInstance.orders.fetch(rezorpay_order_id)

//         console.log(orderInfo)
//         if(orderInfo.status === 'paid'){
//             await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {payment:true})
//             res.json({
//                 success:true,
//                 message:"Payment Successfull"
//             })
//         }
//         else{
//              res.json({
//                 success:false,
//                 message:"Payment Failed"
//             })
//         }

//     } catch (error) {
//         console.log(error)
//         res.json({
//             success: false,
//             message: error.message
//         })
//     }

// }

export {
  registerUser,
  userLogin,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
};
