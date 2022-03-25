import React from "react";
import AnalyticsUserCountCard from "../../components/analyticsUserCountCard/AnalyticsUserCountCard";
import styles from "./Analytics.module.css";
import AudienceResponse_BarChart from "./audience-response-bar-chart/AudienceResponse_BarChart";

const completes_by_employees_data = {
  "1-100": 20,
  "500-1000": 30,
  "1000+": 24,
};

const quotafull_by_questions_data = [
  {
    name: "AGE",
    count: "201/300",
    progress: "56",
  },
  {
    name: "GENDER",
    count: "201/300",
    progress: "56",
  },
  {
    name: "CITY",
    count: "201/300",
    progress: "56",
  },
];

const completes_by_gender_data = [
  {
    name: "Male",
    count: "210/300",
    progress: "56",
  },
  {
    name: "Female",
    count: "210/300",
    progress: "56",
  },
  {
    name: "Other",
    count: "210/300",
    progress: "56",
  },
];

const quality_terminate_by_supplier_data = [
  {
    name: "lucid ab",
    count: "210/300",
    progress: "67",
  },
  {
    name: "lucid ab",
    count: "210/300",
    progress: "67",
  },
  {
    name: "lucid ab",
    count: "210/300",
    progress: "67",
  },
];

const users_by_country_data = [
  { name: "INDIA", count: "100%", progress: "87" },
];

const AudienceResponse = () => {
  return (
    <>
      <div className={styles.audience_response_page}>
        <div className={styles.left}>
          <div className={styles.audience_response_graph}>
            <AudienceResponse_BarChart />
          </div>
          {/* completes by employees card  */}
          <div className={styles.completes_by_employees_card}>
            <AnalyticsUserCountCard
              cardTitle="complets by employees"
              cardSubtitle={["no of employees", "users"]}
              data={completes_by_employees_data}
              inClientSessions={3}
            />
          </div>

          {/* quotafull by questions card  */}
          <div className={styles.quotafull_by_questions_card}>
            {/* <AnalyticsUserCountCard
              cardTitle="quotafull by questions"
              cardSubtitle={["questions", "quota full"]}
              data={quotafull_by_questions_data}
            /> */}
          </div>
        </div>
        <div className={styles.right}>
          {/* completes by gender card  */}
          <div className={styles.completes_by_gender_card}>
            {/* <AnalyticsUserCountCard
              cardTitle="complets by gender"
              cardSubtitle={["gender", "users"]}
              data={completes_by_gender_data}
            /> */}
          </div>

          {/* quality terminate by supplier  */}
          <div className={styles.quality_terminate_card}>
            {/* <AnalyticsUserCountCard
              cardTitle="Quality Terminate Card"
              cardSubtitle={["supplier", "users"]}
              data={quality_terminate_by_supplier_data}
            /> */}
          </div>

          {/* terminate by questions  */}
          <div className={styles.terminate_by_questions_card}>
            {/* <AnalyticsUserCountCard
              cardTitle="terminate by questions"
              cardSubtitle={["questions", "terms"]}
              data={quality_terminate_by_supplier_data}
            /> */}
          </div>

          {/* users by country */}
          <div className={styles.users_by_count_card}>
            {/* <AnalyticsUserCountCard
              cardTitle="Users by country"
              cardSubtitle={["country", "user base"]}
              data={users_by_country_data}
            /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default AudienceResponse;
