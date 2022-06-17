import { Link } from "react-router-dom";
import useAuth from "../context/useAuth";

import { myAxios } from "../context/Globals";

import SideBar from "./SideBar";
import React from "react";
import { SideBarToggle } from "../Controller/SideBarToggle";

const Status = () => {
  const { logout } = useAuth();
  return (
    <div>
      <div className="">
        <nav className="flex justify-between p-8 items-center border-b-2">
          <div className="text-3xl">
            <Link to="/">
              <span className="font-bold">CertME</span>&trade;
            </Link>
          </div>
          <SideBar id="status-side" />
          <div
            className="block sm:hidden cursor-pointer"
            onClick={SideBarToggle("status-side")}
          >
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
            <ul className="font-semibold flex gap-4">
              <li>
                <Link to="/dashboard">
                  <span className="cursor-pointer">Dashboard</span>
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
      <ViewStatus />
    </div>
  );
};

const ViewStatus = () => {
  const [status, setStatus] = React.useState(null);

  React.useEffect(() => {
    myAxios
      .post("/status")
      .then((res) => {
        setStatus({
          status: res.data.status,
          fields: res.data.fields,
        });
      })
      .catch((err) => {});
    // console.log(status);
  }, []);

  return (
    <div className="flex justify-center items-center my-7 mx-7">
      <div className="">
        <div className="mt-4">
          <span className="font-bold text-xl">Status</span>
        </div>
        <div className="mt-4">
          <table className="table-fixed">
            <thead className="border-slate-400 border-t-2 border-b-2">
              <tr>
                <td className="font-semibold text-center py-1">S.No</td>
                <td className="font-semibold text-center py-1">Email</td>
                <td className="font-semibold text-center py-1">Status</td>
              </tr>
            </thead>
            <tbody>
              {status &&
                status.status.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      className={`border-b-2 border-t-2 border-slate-300`}
                    >
                      <td className="py-1 px-[3px]  text-center">
                        {index + 1}.
                      </td>
                      <td className="py-1 px-[3px]  truncate">
                        {item.data["EMAIL"]}
                      </td>
                      <td className="py-1 px-[3px]  flex items-center gap-1">
                        {item.bool ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-green-600"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-red-600"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        <span>{item.status}</span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Status;
