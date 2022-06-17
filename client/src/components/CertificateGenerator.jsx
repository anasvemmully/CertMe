import { Info, myAxios } from "../context/Globals";
import React from "react";
import useAuth from "../context/useAuth";

const CertificateGenerator = () => {
  const [csv, setCSV] = React.useState(null);
  const [template, setTemplate] = React.useState(null);

  const { authInfo } = useAuth();

  const [message, setMessage] = React.useState({
    message: null,
    type: null,
  });
  console.log("authInfo");
  console.log(authInfo);
  const upload = React.useCallback(
    (e) => {
      e.preventDefault();

      if (csv && template) {
        const data = new FormData();
        data.append("csv", csv);
        data.append("ppt", template);
        myAxios
          .post("/upload/", data, {
            headers: {
              "Content-Type": "application/octet-stream",
            },
          })
          .then((res) => {
            console.log(res.data.message);
            setTemplate(null);
            setCSV(null);
            setMessage({
              message: res.data.message,
              type: "success",
            });
          })
          .catch((err) => {
            console.log(err.response.data.message);
            setTemplate(null);
            setCSV(null);
            setMessage({
              message: err.response.data.message,
              type: "error",
            });
          });
      } else {
        setMessage({
          message: "Please upload the files",
          type: "error",
        });
        console.log("Please upload the files");
      }
    },
    [csv, template]
  );
  // console.log(authInfo);
  return (
    <div>
      <div className="rounded-sm my-7 mx-7 sm:mx-16 md:mx-56">
        {authInfo && (
          <div className="inline mb-4 py-2 px-4 bg-purple-600 rounded-full">
            <span className="font-semibold text-sm text-white">
              Hi, welcome {authInfo.username}
            </span>
          </div>
        )}
        <div className="mt-4">
          <span className="font-bold text-xl">Certificate Generator</span>
        </div>
        <div className="mt-4">
          <div className="flex justify-between">
            <span className="font-semibold">Upload the Excel file</span>
            {csv ? (
              <button className="flex gap-2" onClick={() => setCSV(null)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-red-500 font-bold">Reset</span>
              </button>
            ) : (
              ""
            )}
          </div>

          <div className="flex justify-center items-center w-full my-2">
            <label
              htmlFor="dropzone-file"
              className={`flex flex-col justify-center items-center w-full h-64 rounded-lg border-2  border-dashed cursor-pointer ${
                csv
                  ? "bg-green-100 border-green-400"
                  : "hover:bg-gray-100 border-gray-400"
              }`}
            >
              {csv ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-green-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="flex flex-col justify-center items-center pt-5 pb-6">
                    <p className="mb-2 text-sm font-semibold text-green-500">
                      {csv.name}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {" "}
                  <div className="flex flex-col justify-center items-center pt-5 pb-6">
                    <svg
                      className="mb-3 w-10 h-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag & drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      .XLXS or .XLS
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    name="csv"
                    onChange={(e) => setCSV(e.target.files[0])}
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  />
                </>
              )}
            </label>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between">
            <span className="font-semibold">
              Upload the powerpoint template file
            </span>
            {template ? (
              <button className="flex gap-2" onClick={() => setTemplate(null)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-red-500 font-bold">Reset</span>
              </button>
            ) : (
              ""
            )}
          </div>
          <div className="flex justify-center items-center w-full my-2">
            <label
              htmlFor="dropzone-file-ppt"
              className={`flex flex-col justify-center items-center w-full h-64 rounded-lg border-2 border-dashed cursor-pointer ${
                template
                  ? "bg-green-100 border-green-400"
                  : "hover:bg-gray-100 border-gray-400"
              }`}
            >
              {template ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-green-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="flex flex-col justify-center items-center pt-5 pb-6">
                    <p className="mb-2 text-sm font-semibold text-green-500">
                      {template.name}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col justify-center items-center pt-5 pb-6">
                    <svg
                      className="mb-3 w-10 h-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag & drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      .PPTX or .PPT
                    </p>
                  </div>
                  <input
                    id="dropzone-file-ppt"
                    type="file"
                    className="hidden"
                    name="ppt"
                    onChange={(e) => setTemplate(e.target.files[0])}
                    accept=".ppt, .pptx"
                  />
                </>
              )}
            </label>
          </div>
          {message.message?.length > 0 && (
            <>
              <div
                className={`flex justify-between px-2 sm:px-8 font-semibold border-2 border-dashed rounded-md py-4 text-red-500 mt-4 flex justify-center items-center ${
                  message.type === "error"
                    ? "bg-red-400 text-white"
                    : "bg-green-600 text-white"
                }`}
              >
                <div className="flex gap-2 items-center">
                  {message.type === "error" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <span className="text-white text-xs sm:text-normal">{message.message}</span>
                </div>
                <button
                  onClick={() =>
                    setMessage({
                      message: null,
                      type: null,
                    })
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </>
          )}
          <div className="cursor-pointer mb-6 hover:bg-green-700 rounded-md bg-green-600 font-semibold text-center my-2 sm:my-6 py-3 px-full">
            <button onClick={upload}>
              <span className="font-bold text-white">
                Generate & Mail Certificate
              </span>
            </button>
          </div>
          <div className="mb-12">
            <Info message="Upload excel with tags as each field." />
            <Info message="Make sure the template contains tags as per the excel file." />
            <Info message="Certificates will be uploaded to the mail specified in the excel file." />
            <Info message="Make sure email field is provided in the excel file." />
            <Info message="Each tag in the template should in the form of {d.TAG} and should be exactly as per in the excel." />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;
