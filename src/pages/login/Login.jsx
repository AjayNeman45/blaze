import React from "react";
import styles from "./login.module.css";
const Login = () => {
  return (
    <>
      <div className={styles.loginContainer}>
        <div className={styles.login}>
          <form>
            <div className={styles.formInputes}>
              <h2>Log in to Mirats Insights</h2>
              <label htmlFor="email">Mirats Insights Email ID</label>
              <input
                type="email"
                required
                placeholder="Enter Email"
                name="email"
              />
              <label htmlFor="password">Password for your account.</label>
              <input
                required
                type="password"
                placeholder="Enter Password"
                name="password"
              />
              <button type="submit" className={styles.loginBtn}>
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
