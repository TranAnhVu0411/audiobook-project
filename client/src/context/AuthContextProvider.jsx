import {main_axios_instance} from '../service/custom-axios';
import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const setLocalUser = (user, remember) => {
    localStorage.setItem('remember-me', JSON.stringify({ rememberLogin: remember }));
    localStorage.setItem("current-user", JSON.stringify(user));
  }

  const getLocalUser = () => {
    const remember = JSON.parse(localStorage.getItem('remember-me'));
    if (remember && remember.rememberLogin) {
        return JSON.parse(localStorage.getItem('current-user'));
    }
    return null;
  };

  const clearLocalUser = () => {
    localStorage.removeItem('remember-me');
    localStorage.removeItem('current-user');
  };

  const [currentUser, setCurrentUser] = useState(
    getLocalUser()
  );

  const login = async (inputs) => {
    try{
      const res = await main_axios_instance.post("/auth/login", {
        email: inputs.email,
        password: inputs.password
      });
      if (res.data.accessToken){
        setLocalUser(res.data, inputs.remember)
        setCurrentUser(res.data);
        return res;
      }
      return res
    }catch(error){
      return error;
    }
  };

  const logout = async () => {
    setCurrentUser(null);
    clearLocalUser()
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};