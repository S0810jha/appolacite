import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
//import {useNavigate} from 'react-router-dom';

const MyAppointments = () => {
  const { backendUrl, token, getDoctorData } = useContext(AppContext);

  const [appointment, setAppointment] = useState([]);

  const month = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormate = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + month[Number(dateArray[1])] + " " + dateArray[2]
    );
  };

  const getUserAppointment = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointment", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setAppointment(data.appointment.reverse());
        console.log(data.appointment);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointment();
        getDoctorData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // const initPay = (order)=> {

  //   const options = {
  //     key: import.meta.VITE_RAZORPAY_KEY_ID,
  //     amount: order.amount,
  //     currency: order.currency,
  //     name: "Appointment Payment",
  //     description: "Appointment Payment",
  //     order_id: order.id,
  //     receipt: order.receipt,
  //     headers: async(response) =>{
  //       console.log(response)

  //       try {

  //         const {data} = await axios.post(backendUrl+'/api/user/verify', response, {headers:{Authorization:`Bearer ${token}`}})
  //         if(data.success){
  //           getUserAppointment()
  //           navigate('/my-appointments')
  //         }

  //       } catch (error) {
  //         console.log(error)
  //         toast.error(error.message)
  //       }

  //     }
  //   }

  //   const rzp = new window.Razorpay(options)
  //   rzp.open()

  // }

  // const appointmentPayment = async(appointmentId)=>{

  //   try {

  //     const {data} = await axios.post(backendUrl+'/api/user/payment',{appointmentId}, {headers:{Authorization:`Bearer ${token}`}})

  //     if(data.success){
  //       initPay(data.order)
  //     }

  //   } catch (error) {
  //     console.log(error)
  //     toast.error(error.message)
  //   }

  // }

  useEffect(() => {
    if (token) {
      getUserAppointment();
    }
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My Appointments
      </p>
      <div>
        {appointment.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_3fr] sm:flex sm:gap-6 py-2 border-b"
            key={index}
          >
            <div>
              <img
                className="w-32 bg-[#BCCDF5] rounded-lg"
                src={item.docData.image}
                alt=""
              />
            </div>
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">
                {item.docData.name}
              </p>
              <p>{item.docData.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">Address :</p>
              <p className="text-xs">{item.docData.address.line1}</p>
              <p className="text-xs">{item.docData.address.line2}</p>
              <p className="text-xs mt-1">
                <span className="text-sm font-medium text-neutral-700">
                  Date & Time :{" "}
                </span>
                {slotDateFormate(item.slotDate)} | {item.slotTime}
              </p>
            </div>

            <div></div>

            <div className="flex flex-col justify-end gap-2">
              {/* {!item.cancelled && item.payment && !item.isCompleted && (
                <button className="text-sm text-green-500 text-center sm:min-w-48 py-2 border border-green-700 rounded-md">
                  Paid
                </button>
              )} */}

              {!item.cancelled  && !item.isCompleted && (
                <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded-md hover:bg-primary hover:text-white transition-all duration-300">
                  Pay Online
                </button>
              )}
              {!item.cancelled && !item.isCompleted && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded-md hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Cancel Appointment
                </button>
              )}
              {item.cancelled && !item.isCompleted && (
                <button className="text-sm text-red-700 text-center sm:min-w-48 py-2 border border-red-800 rounded-md">
                  Appointmrnt Cancelled
                </button>
              )}
              {item.isCompleted && !item.cancelled &&
                (<button className="text-sm text-green-600 text-center sm:min-w-48 py-2 border border-green-700 rounded-md">Completed</button>)
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
