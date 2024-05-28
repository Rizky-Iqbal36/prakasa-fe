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

    useEffect(() => {
      if (token) {
        const user = JSON.parse(localStorage.getItem("user") ?? "false");
        if (!user) {
          const backendInteractor = new BackendInteractor(token);
          backendInteractor.profile().then((data) => {
            localStorage.setItem("user", JSON.stringify(data));
          });
        }
      } else localStorage.removeItem("user");
    }, []);
  
    return (
      <AuthContext.Provider value={defaultValue}>{children}</AuthContext.Provider>
    );
  };
  
  export default AuthProvider;
  
  export const useAuth = () => useContext(AuthContext);