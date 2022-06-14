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
  const [errMsg, setErrMsg] = useState({});
  const { setUserData } = useBaseContext();
  const [loading, setLoading] = useState(false);
  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    signInWithEmailAndPassword(auth, loginCred?.email, loginCred?.password)
      .then((userCredential) => {
        const user = userCredential.user;
        getUserData(user?.uid).then(async (res) => {
          if (!res.data()?.Portal_Access?.blaze_portal) {
            await signOut(auth);
            setErrMsg({
              msg: "You Don't have permission to access the portal.",
              type: "warning",
            });
          } else {
            setErrMsg({});
            setUserData(res.data());
            history.push("/");
          }
          setLoading(false);
        });
      })
      .catch((err) => {
        switch (err.code) {
          case "auth/wrong-password":
            setErrMsg({
              msg: "Oops! wrong password try again.",
              type: "error",
            });
            break;
          case "auth/user-not-found":
            setErrMsg({ msg: "User does not found.", type: "error" });
            break;
          default:
            break;
        }
        setLoading(false);
      });
  };
  const value = { handleLogin, loginCred, setLoginCred, errMsg, loading };
  return (
    <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
  );
};

export default LoginContextProvider;
