import { createContext, useState } from "react";

export const UserContext = createContext();

export default function UserContextProvider({ children }) {
  const [isLogin, setLogin] = useState(
    localStorage.getItem("userToken") ? true : false
  );

  return (
    <UserContext.Provider value={{ isLogin, setLogin }}>
      {children}
    </UserContext.Provider>
  );
}
