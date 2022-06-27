import React from "react";
import { v4 as uuid } from "uuid";
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
          <div className={styles.projectCard} key={uuid()}>
            <h1>{e.title}</h1>
            <p>{e.desc}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectServiceCard;
