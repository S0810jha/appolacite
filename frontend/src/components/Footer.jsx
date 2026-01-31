import React from "react";
import { assets } from "../assets/assets_frontend/assets";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className="md:mx-10  ">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-20 text-sm border-t border-t-gray-400 py-10">
        {/* ----Left-section---- */}
        <div>
          <img className="mb-5 w-40" src={assets.apollocite_logo} alt="" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea quam
            voluptas velit ratione totam dolores, temporibus aperiam facilis
            mollitia explicabo quidem et amet cupiditate inventore tenetur illo
            pariatur aspernatur .
          </p>
        </div>

        {/* ----Center-section---- */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>
              <button
                onClick={() => {
                  navigate("/");
                  scrollTo(0, 0);
                }}
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  navigate("/about");
                  scrollTo(0, 0);
                }}
              >
                About
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  navigate("/contact");
                  scrollTo(0, 0);
                }}
              >
                Contact
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  navigate("");
                  scrollTo(0, 0);
                }}
              >
                Privacy Policy
              </button>
            </li>
          </ul>
        </div>

        {/* ----Right-section---- */}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+91 11012 01311</li>
            <li>apollocite@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* ----copyright text---- */}

      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          CopyRight 2025@ Apollacite - All Right Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
