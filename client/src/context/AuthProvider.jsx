import { createContext, useState } from "react";
import React from "react";
import { myAxios } from "./Globals";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAnimation, setIsAnimation] = React.useState(false);

  const [auth, setAuth] = useState(false);
  const [authInfo, setAuthInfo] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || location.pathname;

  React.useEffect(() => {
    //refresh  logic
    navigate(from, { replace: true });
  }, [from, navigate]);

  React.useEffect(() => {
    const store = localStorage.getItem("connect");
    if (store) {
      try {
        const user = JSON.parse(atob(store));

        if (user?.auth) {
          setAuthInfo(user.user);
          setAuth(user.auth);
        }
      } catch (err) {
        setAuth(false);
      }
    } else {
      setAuth(false);
    }
  }, []);

  const verify = () => {
    myAxios
      .post("/verify")
      .then((res) => {
        setAuth(true);
        return true;
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          setAuth(false);
          localStorage.removeItem("connect");
          return false;
        }
      });
  };

  const login = React.useCallback((user) => {
    setAuthInfo(user);
    localStorage.setItem(
      "connect",
      btoa(JSON.stringify({ auth: true, user: user }))
    );
    setAuth(true);
  }, []);

  const logout = React.useCallback(() => {
    myAxios.post("/logout").then((res) => {
      if (res.status === 200) {
        setAuth(false);
        localStorage.removeItem("connect");
        navigate(from, { replace: true });
      }
    });
  }, [from, navigate]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        logout,
        login,
        verify,
        authInfo,
        setAuthInfo,
        setIsAnimation,
        isAnimation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
