import {
  createContext,
  useState,
} from "react";


export const AuthContext = createContext();


const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );


  const signin = (userData, callback) => {

    setUser(userData);

    callback();
  };


  const signout = (callback) => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setUser(null);

    callback();
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        signin,
        signout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
