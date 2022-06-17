// import React from "react";
import axios from "axios";

export const myAxios = axios.create({
  withCredentials: true,
  baseURL: "/api",
});

export const Info = ({ message }) => {
  return (
    <div className="text-slate-500 flex gap-1 my-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 flex-none "
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
      <div className="text-xs font-semibold">{message}</div>
    </div>
  );
};

// let refresh = false;
// myAxios.interceptors.response.use(
//   (resp) => {
//     return resp;
//   },
//   (err) => {
//     console.log("error ERROR error ERROR");
//     if (err.response.status === 401 && !refresh) {
//       refresh = true;
//       console.log("refreshing token...");
//       myAxios
//         .post("/token")
//         .then((res) => {
//           if (res.status === 200) {
//             console.log("token refreshed");
//           }
//           return axios(err.config());
//         })
//         .catch((err) => {});
//     } else {
//       refresh = false;
//       return Promise.reject(err);
//     }
//   }
// );
