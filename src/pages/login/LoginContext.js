import { createContext, useContext, useEffect, useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getUserData } from "../../utils/firebaseQueries";
import { useHistory } from "react-router-dom";
import { useBaseContext } from "../../context/BaseContext";
import { auth } from "../../firebase";

const LoginContext = createContext();

export const useLoginContext = () => {
  return useContext(LoginContext);
};

const LoginContextProvider = ({ children }) => {
  const history = useHistory();
  const [loginCred, setLoginCred] = useState({});
  const { setUserData } = useBaseContext();
  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, loginCred?.email, loginCred?.password)
      .then((userCredential) => {
        const user = userCredential.user;
        getUserData(user?.uid).then(async (res) => {
          if (!res.data()?.portal_access?.blaze_portal) {
            await signOut(auth);
            console.log("nikal... tereko permission nahi hai portal ka");
          } else {
            console.log(
              "hurr re.. you have the permission to access the portal"
            );
            setUserData(res.data());
            history.push("/");
          }
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const value = { handleLogin, loginCred, setLoginCred };
  return (
    <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
  );
};

export default LoginContextProvider;
