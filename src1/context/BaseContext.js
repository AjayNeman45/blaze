import { addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { auth, db, miratsFulDb } from "../firebase";
import { data } from "../tmp";
import { getUserData } from "../utils/firebaseQueries";
const BaseContext = createContext();

export const useBaseContext = () => {
  return useContext(BaseContext);
};

const BaseContextProvider = ({ children }) => {
  const [baseLoading, setBaseLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [user, loading, error] = useAuthState(auth);
  const history = useHistory();
  useEffect(() => {
    if (!loading) {
      if (user) {
        console.log("user found", user);
        getUserData(user?.uid).then((res) => {
          setUserData(res.data());
        });
      }
    }
  }, [user, loading]);

  const value = {
    baseLoading,
    setBaseLoading,
    userData,
    setUserData,
  };
  return <BaseContext.Provider value={value}>{children}</BaseContext.Provider>;
};

export default BaseContextProvider;
