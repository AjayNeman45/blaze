import React from "react";
import styles from "./projectServiceCard.module.css";
const ProjectServiceCard = () => {
  const projectCoordinator = [
    {
      title: "Project Coordinator",
      desc: "Your Position",
    },
    {
      title: "Support and Service",
      desc: "Your Department",
    },
    {
      title: "Mirats OTC / illustrate Projects Support",
      desc: "Your Team Name",
    },
  ];

  return (
    <div className={styles.projectCardContainer}>
      {projectCoordinator.map((e, i) => {
        return (
          <div className={styles.projectCard} key={i}>
            <h1>{e.title}</h1>
            <p>{e.desc}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectServiceCard;
