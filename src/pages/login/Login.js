import React from "react";
import styles from "./login.module.css";
import { useLoginContext } from "./LoginContext";
import { Loading } from "@nextui-org/react";
const Login = () => {
  const { handleLogin, setLoginCred, errMsg, loading } = useLoginContext();

  const handleInputChange = (e) => {
    setLoginCred((prevData) => {
      return {
        ...prevData,
        [e.target.name]: e.target.value,
      };
    });
  };
  return (
    <>
      <div className={styles.loginContainer}>
        <div className={styles.login}>
          <form onSubmit={handleLogin}>
            <div className={styles.formInputes}>
              {errMsg?.msg ? (
                <large
                  className={
                    errMsg?.type === "error"
                      ? styles.error_msg
                      : styles.warning_msg
                  }
                >
                  {errMsg.msg}
                </large>
              ) : null}
              <h2>Log in to Mirats Insights</h2>
              <label htmlFor="email">Mirats Insights Email ID</label>
              <input
                type="email"
                required
                placeholder="Enter Email"
                name="email"
                onChange={handleInputChange}
              />
              <label htmlFor="password">Password for your account.</label>
              <input
                required
                type="password"
                placeholder="Enter Password"
                name="password"
                onChange={handleInputChange}
              />

              {loading ? (
                <div className={styles.spinner}>
                  <Loading type="spinner" size="lg" />
                </div>
              ) : (
                <button type="submit" className={styles.loginBtn}>
                  Log in
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
