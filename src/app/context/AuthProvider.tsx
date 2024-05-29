import React, {
    useContext,
    createContext,
    ReactNode,
    useState,
    useEffect,
  } from "react";
  import { Cookies } from "react-cookie";
  import BackendInteractor from "../api";
  
  let defaultValue = {
    token: "",
    setToken: (token: string) => token,
  };
  const AuthContext = createContext(defaultValue);
  
  const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const cookies = new Cookies();
    const [token, setToken] = useState(cookies.get("accessToken") || "");
    defaultValue.token = token;
    (defaultValue as any).setToken = setToken;
  
    return (
      <AuthContext.Provider value={defaultValue}>{children}</AuthContext.Provider>
    );
  };
  
  export default AuthProvider;
  
  export const useAuth = () => useContext(AuthContext);