// import { Outlet } from "react-router";
import React from "react";
// import {
//   isEmail,
//   comparePassword,
//   isPassword,
// } from "../Controller/AuthenticateTools";
// import { myAxios } from "../context/Globals";
import { Link } from "react-router-dom";
import CertificateGenerator from "./CertificateGenerator";
// import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import SideBar from "./SideBar";

import { SideBarToggle } from "../Controller/SideBarToggle";

const Dashboard = () => {
  const { logout, verify } = useAuth();

  // console.log(axios.defaults.headers.common);
  React.useEffect(() => {
    var verified = verify();
    return () => (verified ? null : verify());
  }, [verify]);

  return (
    <div>
      <div className="">
        <nav className="flex justify-between p-8 items-center border-b-2">
          <div className="text-3xl">
            <Link to="/">
              <span className="font-bold">CertME</span>&trade;
            </Link>
          </div>
          <SideBar id="dash-side" />
          <div className="block sm:hidden cursor-pointer" onClick={SideBarToggle("dash-side")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="hidden sm:block">
            <ul className="flex gap-4 font-semibold ">
              <li>
                <Link to="/status">
                  <span className="cursor-pointer">Status</span>
                </Link>
              </li>
              <li>
                <div
                  onClick={logout}
                  className="cursor-pointer border-slate-300"
                >
                  <span>Logout</span>
                </div>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <CertificateGenerator />
    </div>
  );
};

export default Dashboard;
