import { createContext } from "react";

const AppContext = createContext();

const currency = "$";

const AppContextProvider = (props) => {
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);

    let age = today.getFullYear() - birthDate.getFullYear();
    return age;
  };

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

  const value = {
    calculateAge,
    currency,
    slotDateFormate,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
export { AppContext };
