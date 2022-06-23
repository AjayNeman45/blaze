import { createContext, useContext, useEffect, useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getUserData } from "../../utils/firebaseQueries";
import { useHistory } from "react-router-dom";
import { useBaseContext } from "../../context/BaseContext";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const LoginContext = createContext();

export const useLoginContext = () => {
  return useContext(LoginContext);
};

const LoginContextProvider = ({ children }) => {
  const history = useHistory();
  const [loginCred, setLoginCred] = useState({});
  const [errMsg, setErrMsg] = useState({});
  const { setUserData } = useBaseContext();
  const [loginLoading, setLoginLoading] = useState(false);
  const [user, loading] = useAuthState(auth);
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginLoading(true);
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
          setLoginLoading(false);
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
        setLoginLoading(false);
      });
  };

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (window.location.href.includes("login")) {
          console.log("user is logged in... you cannot go the login page");
          history.goBack();
        }
      }
    }
  }, [user, loading]);
  const value = {
    handleLogin,
    loginCred,
    setLoginCred,
    errMsg,
    loading: loginLoading,
  };
  return (
    <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
  );
};

export default LoginContextProvider;
