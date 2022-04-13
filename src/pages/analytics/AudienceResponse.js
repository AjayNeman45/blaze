import React, { useEffect, useState } from "react";
import AnalyticsUserCountCard from "../../components/analyticsUserCountCard/AnalyticsUserCountCard";
import styles from "./Analytics.module.css";
import { useAanalyticsContext } from "./AnalyticsContext";
import AudienceResponse_BarChart from "./audience-response-bar-chart/AudienceResponse_BarChart";
import cardStyle from "../../components/analyticsUserCountCard/userAnalytcs.module.css";
import { v4 as uuid } from "uuid";
import { LinearProgress } from "@mui/material";

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
  const { allSessions, survey, completesByEmployees } = useAanalyticsContext();

  const [usersByGender, setUsersByGender] = useState({
    Male: { numerator: 0, denominator: 0 },
    Female: { numerator: 0, denominator: 0 },
  });

  const [usersByQTBySupp, setUsersByQTBySupp] = useState({});
  const [usersByCountry, setUsersByCountry] = useState({});

  const handleUsersByGenderCard = (gender, forStatus) => {
    setUsersByGender((prevData) => {
      return {
        ...prevData,
        [gender]: {
          ...prevData?.[gender],
          [forStatus]: prevData?.[gender]?.[forStatus] + 1,
        },
      };
    });
  };

  useEffect(() => {
    survey?.external_suppliers?.map((supp) => {
      allSessions?.forEach((session) => {
        const sd = session.data();
        const sid = supp?.supplier_account_id;
        const suppName = supp?.supplier_account;
        // condition for quality terminate by supplier
        if (supp?.supplier_account_id === sd?.supplier_account_id) {
          if (sd?.mirats_status === 3) {
            setUsersByQTBySupp((prevData) => {
              return {
                ...prevData,
                [suppName]: {
                  ...prevData?.[suppName],
                  denominator:
                    (prevData?.[suppName]?.denominator
                      ? prevData?.[suppName]?.denominator
                      : 0) + 1,
                },
              };
            });
          }
          if (sd?.client_status === 30) {
            setUsersByQTBySupp((prevData) => {
              return {
                ...prevData,
                [suppName]: {
                  ...prevData?.[suppName],
                  numerator:
                    (prevData?.[suppName]?.numerator
                      ? prevData?.[suppName]?.numerator
                      : 0) + 1,
                },
              };
            });
          }
        }
      });
    });

    const noOfSessions = 8;
    allSessions?.forEach((session) => {
      const sd = session.data();

      //conditions for user by gender card
      if (sd?.responses?.[1]?.user_response === 0) {
        if (sd?.mirats_status === 3) {
          handleUsersByGenderCard("Male", "denominator");
        }
        if (sd?.client_status === 10) {
          handleUsersByGenderCard("Male", "numerator");
        }
      } else if (sd?.responses?.[1]?.user_response === 1) {
        if (sd?.mirats_status === 3) {
          handleUsersByGenderCard("Female", "denominator");
        }
        if (sd?.client_status === 10) {
          handleUsersByGenderCard("Female", "numerator");
        }
      }

      // conditions for user by country
      const country = sd?.geo_data?.country.toUpperCase();
      setUsersByCountry((prevData) => {
        return {
          ...prevData,
          [country]: (prevData?.[country] ? prevData?.[country] : 0) + 1,
        };
      });
      if (sd?.geo_data?.country_code) {
      }
    });
  }, [allSessions, survey]);

  console.log(usersByCountry);

  return (
    <>
      <div className={styles.audience_response_page}>
        <div className={styles.left}>
          <div className={styles.audience_response_graph}>
            <AudienceResponse_BarChart />
          </div>

          {/* comlpetes by employees card  */}
          <div>
            <AudienceResponseCard
              data={completesByEmployees}
              cardTitle="Completes by employees card"
              cardSubtitle={["no of employees", "users"]}
            />
          </div>
        </div>
        <div className={styles.right}>
          {/* completes by gender card  */}
          <div className={styles.completes_by_gender_card}>
            <AudienceResponseCard
              data={usersByGender}
              cardTitle="completes by gender"
              cardSubtitle={["gender", "users"]}
            />
          </div>

          {/* quality terminate by supplier  */}
          <div className={styles.quality_terminate_card}>
            <AudienceResponseCard
              data={usersByQTBySupp}
              cardTitle="quality terminates by supplier"
              cardSubtitle={["supplier", "quality terminates"]}
            />
          </div>

          {/* users by country card  */}
          <div className={styles.terminate_by_questions_card}>
            <div className={cardStyle.UserAnalytics_container}>
              <div className={cardStyle.legend}>
                <h1 className={cardStyle.cardTitle}>users by country</h1>
              </div>
              <div className={cardStyle.UserAnalytics_header}>
                <h4>country</h4>
                <h4>user base</h4>
              </div>
              {Object.keys(usersByCountry).map((key) => {
                return (
                  <div key={uuid()}>
                    <div className={cardStyle.platform_type}>
                      <p>{key}</p>{" "}
                      <p>
                        {(usersByCountry[key] * 100) / allSessions.docs.length}{" "}
                        %
                      </p>
                    </div>

                    <LinearProgress
                      color="inherit"
                      variant="determinate"
                      value={
                        ((usersByCountry[key] ? usersByCountry[key] : 0) *
                          100) /
                        allSessions.docs.length
                      }
                      // value={item.progress}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AudienceResponse;

const AudienceResponseCard = ({ data, cardTitle, cardSubtitle }) => {
  return (
    <div className={cardStyle.UserAnalytics_container}>
      <div className={cardStyle.legend}>
        <h1 className={cardStyle.cardTitle}>{cardTitle}</h1>
      </div>
      <div className={cardStyle.UserAnalytics_header}>
        <h4>{cardSubtitle[0]}</h4>
        <h4>{cardSubtitle[1]}</h4>
      </div>
      {Object.keys(data).map((key) => {
        return (
          <div key={uuid()}>
            <div className={cardStyle.platform_type}>
              <p>{key}</p>{" "}
              <p>
                {data[key]?.numerator ? data[key]?.numerator : 0} /{" "}
                {data[key]?.denominator}
              </p>
            </div>

            <LinearProgress
              color="inherit"
              variant="determinate"
              value={
                ((data[key]?.numerator ? data[key]?.numerator : 0) /
                  data[key]?.denominator) *
                100
              }
              // value={item.progress}
            />
          </div>
        );
      })}
    </div>
  );
};
