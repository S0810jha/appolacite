import { createContext } from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [dToken, setDtoken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
  );
  const [appointment, setAppointment] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState([]);

  const getAppointment = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/doctor/doctor-appointment",
        { headers: { dToken } }
      );

      if (data.success) {
        setAppointment(data.appointment);
        console.log(data.appointment);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const appointmentComplet = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/complete-appointment",
        { appointmentId },
        { headers: { dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointment();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const appointmentCancel = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/cancel-appointment",
        { appointmentId },
        { headers: { dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointment();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/dashboard", {
        headers: { dToken },
      });
      if (data.success) {
        setDashData(data.dashData);
        console.log(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getProfileData = async()=>{

    try {
      const {data} = await axios.get(backendUrl+'/api/doctor/profile', {headers:{dToken}})
      if(data.success){
        setProfileData(data.profileData)
        console.log(data.profileData)
      }

      
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }

  } 

  const value = {
    backendUrl,
    dToken,
    setDtoken,
    appointment,
    setAppointment,
    getAppointment,
    appointmentComplet,
    appointmentCancel,
    dashData,
    setDashData,
    getDashData,
    profileData,
    setProfileData,
    getProfileData
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
export { DoctorContext };
