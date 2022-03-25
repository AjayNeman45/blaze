import React from "react";
import styles from "./teamcards.module.css";

const TeamCards = ({ title, co_ordinators }) => {

  return (
    <>
      <div className={styles.Teamcard}>
        <h1>{title}</h1>
        <div>
          {co_ordinators?.map((value) => {
            return (
              <>
                <h2>{value.title}</h2>
                <div className={styles.subMenuBtn}>
                  {value.members.map((member) => {
                    return <h3>{member}</h3>;
                  })}
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default TeamCards;
