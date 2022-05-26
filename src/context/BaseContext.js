import { createContext, useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { getUserData } from "../utils/firebaseQueries";
const BaseContext = createContext();

export const useBaseContext = () => {
  return useContext(BaseContext);
};

const BaseContextProvider = ({ children }) => {
  const [baseLoading, setBaseLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
    if (user) {
      getUserData(user?.uid).then((res) => {
        setUserData(res.data());
      });
    }
  }, [user]);

  const value = {
    baseLoading,
    setBaseLoading,
    userData,
    setUserData,
  };
  return <BaseContext.Provider value={value}>{children}</BaseContext.Provider>;
};

export default BaseContextProvider;
