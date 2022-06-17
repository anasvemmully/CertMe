import {
  isEmail,
  comparePassword,
  isPassword,
  isUsername,
} from "../Controller/AuthenticateTools";
import { myAxios, Info } from "../context/Globals";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";

import React from "react";

const useCloseOutside = (handler, D) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        handler();
      }
    };
    if (D) {
      document.addEventListener("click", handleClickOutside, true);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handler, D]);
  return ref;
};

const Account = () => {
  const [popUp, setpopUp] = React.useState(null);
  const [doRegister, setdoRegister] = React.useState(false);
  // const [email, setEmail] = React.useState("");
  // const [username, setUsername] = React.useState("");
  // const [pass, setPass] = React.useState("");
  // const [passC, setPassC] = React.useState("");

  // const [message, setMessage] = React.useState(null);

  // const [emailError, setEmailError] = React.useState(false);
  // const [passError, setPassError] = React.useState(false);
  // const [usernameError, setUsernameError] = React.useState(false);

  // const navigate = useNavigate();

  const ref = useCloseOutside(() => {
    close();
  }, popUp);

  const settDefault = React.useCallback(() => {
    setdoRegister(false);
    // setEmail("");
    // setUsername("");
    // setPass("");
    // setPassC("");
  }, []);

  const close = React.useCallback(() => {
    settDefault();
    setpopUp(false);
    // setPassError(false);
    // setEmailError(false);
    // setUsernameError(false);
    // setMessage();
  }, [settDefault, setpopUp]);

  //sign up algorithm efficiency must be improved
  //error message box should be implemented

  return (
    <>
      <div>
        <button
          onClick={() => {
            setpopUp(true);
          }}
          className="font-semibold px-2 py-1 border-2 rounded-md border-slate-300"
        >
          Sign In
        </button>
        {popUp && (
          <div className="absolute top-0 left-0 h-full w-full">
            <div
              ref={ref}
              className="popup-center z-50 px-4 pt-0 pb-6 rounded-lg border-4 w-10/12 sm:w-7/12 md:w-1/3 bg-white shadow-lg"
            >
              {doRegister ? (
                <Register setpopUp={setpopUp} setdoRegister={setdoRegister} />
              ) : (
                <SignIn setpopUp={setpopUp} setdoRegister={setdoRegister} />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const SignIn = ({ setpopUp, setdoRegister }) => {
  const [username, setUsername] = React.useState("");
  const [pass, setPass] = React.useState("");

  const [message, setMessage] = React.useState(null);

  const [passError, setPassError] = React.useState(false);
  const [usernameError, setUsernameError] = React.useState(false);

  const { login } = useAuth();

  const settDefault = React.useCallback(() => {
    setdoRegister(false);
    setUsername("");
    setPass("");
  }, [setdoRegister]);

  const close = React.useCallback(() => {
    settDefault();
    setpopUp(false);
    setPassError(false);
    setUsernameError(false);
    setMessage();
  }, [settDefault, setpopUp]);

  const navigate = useNavigate();

  const SignInAccount = React.useCallback(
    (e) => {
      if (isPassword(pass)) setPassError(false);
      else setPassError(true);

      if (isUsername(pass)) setUsernameError(false);
      else setUsernameError(true);

      if (isPassword(pass) && isUsername(username)) {
        e.target.disabled = true;
        e.target.classList.toggle("cursor-not-allowed");
        setPass("");
        setUsername("");
        myAxios
          .post("/login", {
            username: username,
            password: pass,
          })
          .then((res) => {
            if (res.status === 200) {
              login(res.data.user);
              setMessage(res.data.message);
            }
            setMessage(res.data.message);
            e.target.disabled = false;
            e.target.classList.toggle("cursor-not-allowed");

            navigate("/dashboard");
          })
          .catch(({ response }) => {
            setMessage(response.data.message);
            setPassError(true);
            setUsernameError(true);
          });
        e.target.classList.toggle("cursor-not-allowed");
      }
    },
    [login, navigate, pass, username]
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xl font-semibold py-6">Sign In</h3>
        <div onClick={close}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-500 cursor-pointer"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      {message && (
        <div className="text-xs text-center mb-8 font-semibold">{message}</div>
      )}

      <div>
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 ${
              usernameError ? "text-red-500" : "text-slate-500"
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
          <div className="relative z-0 w-full mb-2 group">
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              className={`block py-2.5 px-0 w-full text-sm  bg-transparent border-0 border-b-2 ${
                usernameError ? "border-red-300" : "border-gray-300"
              } appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
              placeholder=" "
              required
            />
            <label
              htmlFor="username"
              className={`peer-focus:font-semibold absolute text-sm ${
                usernameError ? "text-red-500" : "text-slate-500"
              } duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6`}
            >
              Username
            </label>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${
              passError ? "text-red-500" : "text-slate-500"
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
              clipRule="evenodd"
            />
          </svg>
          <div className="relative z-0 w-full my-2 group mb-4">
            <input
              type="password"
              name="password"
              value={pass}
              onChange={(e) => {
                setPass(e.target.value);
              }}
              className={`block py-2.5 px-0 w-full text-sm  bg-transparent border-0 border-b-2 ${
                usernameError ? "border-red-300" : "border-gray-300"
              } appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
              placeholder=" "
              required
            />
            <label
              htmlFor="password"
              className={`peer-focus:font-semibold absolute text-sm ${
                passError ? "text-red-500" : "text-slate-500"
              } duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6`}
            >
              Password
            </label>
          </div>
        </div>
        <button
          onClick={SignInAccount}
          className="block w-full cursor-pointer hover:bg-green-500 rounded-md bg-green-400 font-semibold text-center my-6 py-3 "
        >
          <span className="font-semibold text-white">Sign In</span>{" "}
        </button>
        <div
          onClick={() => {
            setdoRegister(true);
            setUsernameError(false);
            setPassError(false);
          }}
          className="mt-3 cursor-pointer underline font-semibold text-xs text-center"
        >
          Dont have an account? Register here !
        </div>
      </div>
    </div>
  );
};

const Register = ({ setpopUp, setdoRegister }) => {
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [passC, setPassC] = React.useState("");

  const [message, setMessage] = React.useState(null);

  const [emailError, setEmailError] = React.useState(false);
  const [passError, setPassError] = React.useState(false);
  const [usernameError, setUsernameError] = React.useState(false);

  const settDefault = React.useCallback(() => {
    setdoRegister(false);
    setUsername("");
    setPass("");
  }, [setdoRegister]);

  const close = React.useCallback(() => {
    settDefault();
    setpopUp(false);
    setPassError(false);
    setUsernameError(false);
    setMessage();
  }, [settDefault, setpopUp]);

  const SignUpAccount = React.useCallback(
    (e) => {
      if (isEmail(email)) setEmailError(false);
      else setEmailError(true);

      if (isUsername(username)) setUsernameError(false);
      else setUsernameError(true);

      if (isPassword(pass)) setPassError(false);
      else setPassError(true);

      if (
        comparePassword(pass, passC) &&
        isEmail(email) &&
        isPassword(pass) &&
        isUsername(username)
      ) {
        console.log(message);
        e.target.disabled = true;
        e.target.classList.toggle("cursor-not-allowed");
        setPass("");
        setPassC("");
        setUsername("");
        setEmail("");
        myAxios
          .post("/register", {
            username: username,
            email: email,
            password: pass,
            confirmPassword: passC,
          })
          .then((res) => {
            if (res.status === 201) {
              setdoRegister(false);
              setPassError(true);
              setUsernameError(true);
              setEmailError(true);
            } else {
              setMessage(res.data.message);
            }
            e.target.disabled = false;
            e.target.classList.toggle("cursor-not-allowed");
          })
          .catch(({ response }) => {
            // console.log(response.data.message);
            setMessage(response.data.message);
            setEmailError(false);
            setUsernameError(false);
            setPassError(false);
          });
        e.target.classList.toggle("cursor-not-allowed");
      }
    },
    [email, message, pass, passC, setdoRegister, username]
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xl font-semibold py-6">Register</h3>
        <div onClick={close}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-500 cursor-pointer"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      {message && (
        <div className="text-xs text-center mb-8 font-semibold">{message}</div>
      )}

      <div>
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 ${
              usernameError ? "text-red-500" : "text-slate-500"
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
          <div className="relative z-0 w-full mb-2 group">
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              className={`block py-2.5 px-0 w-full text-sm  bg-transparent border-0 border-b-2 ${
                usernameError ? "border-red-300" : "border-gray-300"
              } appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
              placeholder=" "
              required
            />
            <label
              htmlFor="username"
              className={`peer-focus:font-semibold absolute text-sm ${
                usernameError ? "text-red-500" : "text-slate-500"
              } duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6`}
            >
              Username
            </label>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 ${
              emailError ? "text-red-500" : "text-slate-500"
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <div className="relative z-0 w-full my-2 group">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className={`block py-2.5 px-0 w-full text-sm  bg-transparent border-0 border-b-2 ${
                emailError ? "border-red-300" : "border-gray-300"
              } appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
              placeholder=" "
              required
            />
            <label
              htmlFor="email"
              className={`peer-focus:font-semibold absolute text-sm ${
                emailError ? "text-red-500" : "text-slate-500"
              } duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6`}
            >
              Email address
            </label>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${
              passError ? "text-red-500" : "text-slate-500"
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
              clipRule="evenodd"
            />
          </svg>
          <div className="relative z-0 w-full my-2 group">
            <input
              type="password"
              name="password"
              value={pass}
              onChange={(e) => {
                setPass(e.target.value);
              }}
              className={`block py-2.5 px-0 w-full text-sm  bg-transparent border-0 border-b-2 ${
                passError ? "border-red-300" : "border-gray-300"
              } appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
              placeholder=" "
              required
            />
            <label
              htmlFor="password"
              className={`peer-focus:font-semibold absolute text-sm ${
                passError ? "text-red-500" : "text-slate-500"
              } duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6`}
            >
              Password
            </label>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${
              passError ? "text-red-500" : "text-slate-500"
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
              clipRule="evenodd"
            />
          </svg>
          <div className="relative z-0 w-full my-2 group">
            <input
              type="password"
              name="password"
              value={passC}
              onChange={(e) => {
                setPassC(e.target.value);
              }}
              className={`block py-2.5 px-0 w-full text-sm  bg-transparent border-0 border-b-2 ${
                passError ? "border-red-300" : "border-gray-300"
              } appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
              placeholder=" "
              required
            />
            <label
              htmlFor="password"
              className={`peer-focus:font-semibold absolute text-sm ${
                passError ? "text-red-500" : "text-slate-500"
              } duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6`}
            >
              Confirm Password
            </label>
          </div>
        </div>
        <Info message="Password must be 8 characters long minimum." />
        <Info message="Use combination of alphabets, numbers and special characters." />

        <button
          className="block w-full cursor-pointer hover:bg-green-500 rounded-md bg-green-400 font-semibold text-center my-6 py-3 px-full"
          onClick={SignUpAccount}
        >
          <span className="font-semibold text-white">Sign Up</span>{" "}
        </button>

        <div
          onClick={() => {
            setdoRegister(false);
            setUsernameError(false);
            setPassError(false);
            setEmailError(false);
          }}
          className="mt-3 cursor-pointer underline font-semibold text-xs text-center"
        >
          Have an account? Sign in !
        </div>
      </div>
    </div>
  );
};

export default Account;
