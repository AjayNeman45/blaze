import React from "react";
import styles from "./SurveydashboardTeamCard.module.css";
const SurveydashboardTeamCard = () => {
  const MiratsTeam = [
    {
      projectCoordinator: ["Mahmood Alam", "Shruit S T"],
      salesCoordinator: ["Juhi Saini"],
      accountManager: ["Janhavi K Rajput"],
    },
  ];
  return (
    <>
      <div className={styles.Teamcard}>
        <h1>Mirats Team</h1>
        <div>
          <h2>Project Coordinator</h2>
          <div className={styles.subMenuBtn}>
            <h3>Mahmood Alam</h3>
            <h3>Shruit S T</h3>
          </div>
          <h2>Sales Coordinator</h2>
          <div className={styles.subMenuBtn}>
            <h3>Juhi Saini</h3>
          </div>
          <h2>Account Manager</h2>
          <div className={styles.subMenuBtn}>
            <h3>Janhavi K Rajput</h3>
          </div>
        </div>
      </div>
    </>
  );
};
{
  /* <Dashboard title="" teams={Mirats} />; */
}

export default SurveydashboardTeamCard;
