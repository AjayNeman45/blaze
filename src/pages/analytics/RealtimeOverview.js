import React, { useEffect, useState } from "react";
import AnalyticsUserCountCard from "../../components/analyticsUserCountCard/AnalyticsUserCountCard";
import styles from "./Analytics.module.css";
import { useAanalyticsContext } from "./AnalyticsContext";
import RealTimeOverViewDoughnutChart from "./realtime-overview-doughnut-chart/RealtimeOverviewDoughnutChart";

const drop_by_suppliers = [
  {
    name: "Cint AB",
    count: "222",
    progress: "45",
  },
  {
    name: "PureSpectrum",
    count: "222",
    progress: "45",
  },
  {
    name: "Prodege",
    count: "222",
    progress: "45",
  },
];

const RealtimeOverview = () => {
  const [last30MinutesSessions, setLast30MinutesSession] = useState([]);
  const [usersBySuppliersData, setUsersBySuppliersData] = useState({});
  const [usersByGender, setUsersByGender] = useState({
    Male: 0,
    Female: 0,
    Other: 0,
  });
  const [usersByCompletesSuppliersData, setUsersByCompletesSuppliersData] =
    useState({});
  const [inClientAcSupplier, setInClientAcSupplier] = useState({});
  const [inClientAcLast30Minutes, setInClientAcLast30Minutes] = useState(0);
  const [dropsBySuppliersData, setDropsBySuppliersData] = useState({});

  const [usersByDeviceTypes, setUsersByDeviceTypes] = useState({
    desktop: 0,
    mobile: 0,
  });
  const [usersByClientStatusData, setUsersByClientStatusData] = useState({
    "10-Complete": 0,
    "20-Terminated": 0,
    "30-Quality Terminated": 0,
    "40-Quota Full": 0,
  });
  const { allSessions, survey, statusesCnt } = useAanalyticsContext();
  useEffect(() => {
    allSessions?.forEach((session) => {
      let diff =
        (session.data()?.date?.toDate()?.getTime() - new Date().getTime()) /
        1000;
      diff = Math.abs(Math.round(diff / 60));
      if (
        session.data()?.date.toDate().getDate() === new Date().getDate() &&
        diff < 30 &&
        session.data()?.mirats_status === 3
      ) {
        setLast30MinutesSession((prevData) => [...prevData, session.data()]);
      }

      const handleUsersByGender = (gender) => {
        setUsersByGender((prevData) => {
          return {
            ...prevData,
            [gender]: prevData?.[gender] + 1,
          };
        });
      };

      if (session.data()?.client_status === 10) {
        if (session.data()?.responses[1]?.user_response === 0) {
          handleUsersByGender("Male");
        } else if (session.data()?.responses[1]?.user_response === 1) {
          handleUsersByGender("Female");
        } else {
          handleUsersByGender("Other");
        }
      }
    });
  }, [allSessions]);

  useEffect(() => {
    setUsersBySuppliersData({});
    setUsersByCompletesSuppliersData({});
    setInClientAcSupplier({});
    // for users by supliers card
    survey?.external_suppliers?.map((supp) => {
      // if no sessions are there for last 30 minutes then set every suppliers as zero
      if (!last30MinutesSessions.length) {
        setUsersBySuppliersData((prevData) => {
          return {
            ...prevData,
            [supp?.supplier_account]: 0,
          };
        });
      } else
        last30MinutesSessions?.map((session) => {
          setUsersBySuppliersData((prevData) => {
            if (supp?.supplier_account_id === session?.supplier_account_id) {
              return {
                ...prevData,
                [supp?.supplier_account]:
                  (prevData?.[supp?.supplier_account]
                    ? prevData?.[supp?.supplier_account]
                    : 0) + 1,
              };
            } else {
              return {
                ...prevData,
                [supp?.supplier_account]: 0,
              };
            }
          });
        });
      allSessions?.forEach((session) => {
        // condition for calculating the suppliers by completes
        if (
          supp?.supplier_account_id === session.data()?.supplier_account_id &&
          session.data()?.client_status === 10
        ) {
          setUsersByCompletesSuppliersData((prevData) => {
            return {
              ...prevData,
              [supp?.supplier_account]:
                (prevData?.[supp?.supplier_account]
                  ? prevData?.[supp?.supplier_account]
                  : 0) + 1,
            };
          });
        }
        if (
          supp?.supplier_account_id === session.data()?.supplier_account_id &&
          session.data()?.mirats_status === 3
        ) {
          setInClientAcSupplier((prevData) => {
            return {
              ...prevData,
              [supp?.supplier_account]:
                (prevData?.[supp?.supplier_account]
                  ? prevData?.[supp?.supplier_account]
                  : 0) + 1,
            };
          });
        }
      });
    });

    // for users by client status card
    last30MinutesSessions?.map((session) => {
      const handleUsersByClientStatus = (status) => {
        setUsersByClientStatusData((prevData) => {
          return {
            ...prevData,
            [status]: prevData?.[status] + 1,
          };
        });
      };

      if (session?.mirats_status === 3) {
        setInClientAcLast30Minutes((prevData) => prevData + 1);
      }
      if (session?.client_status === 10) {
        handleUsersByClientStatus("10-Complete");
      } else if (session?.client_status === 20) {
        handleUsersByClientStatus("20-Terminated");
      } else if (session?.client_status === 30) {
        handleUsersByClientStatus("30-Quality Terminated");
      } else if (session?.client_status === 40) {
        handleUsersByClientStatus("40-Quota Full");
      }

      //condition for desktop and mobile session users in last 30 minutes
      if (session?.session_techincal_details?.deviceType === "Desktop") {
        setUsersByDeviceTypes((prevData) => {
          return {
            ...prevData,
            desktop: prevData?.desktop + 1,
          };
        });
      } else if (session?.session_techincal_details?.deviceType === "Mobile") {
        setUsersByDeviceTypes((prevData) => {
          return {
            ...prevData,
            mobile: prevData?.mobile + 1,
          };
        });
      }
    });
  }, [last30MinutesSessions, survey, allSessions]);

  console.log(dropsBySuppliersData);

  return (
    <>
      <div className={styles.realtime_overview_page}>
        <div className={styles.left}>
          <div className={styles.realtime_doughnut_chart}>
            <RealTimeOverViewDoughnutChart
              data={usersByDeviceTypes}
              inClientAcLast30Minutes={inClientAcLast30Minutes}
            />
          </div>
          <div className={styles.drops_by_suppliers_card}>
            <AnalyticsUserCountCard
              cardTitle="drops by suppliers"
              cardSubtitle={["suppliers", "drops"]}
              data={{}}
            />
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.users_by_suppliers_card}>
            <AnalyticsUserCountCard
              cardTitle="users by suppliers"
              cardSubtitle={["suppliers", "users"]}
              data={usersBySuppliersData}
              inClientSessions={statusesCnt?.inClient}
              last30MinutesCard={true}
            />
          </div>
          <div className={styles.users_by_client_status_card}>
            <AnalyticsUserCountCard
              cardTitle="users by client status"
              cardSubtitle={["suppliers", "users"]}
              data={usersByClientStatusData}
              inClientSessions={statusesCnt?.inClient}
              last30MinutesCard={true}
            />
          </div>

          <div className={styles.gender_by_complets_and_completes_by_suppliers}>
            <div className={styles.gender_by_complete_card}>
              <AnalyticsUserCountCard
                cardTitle="gender by completes"
                cardSubtitle={["suppliers", "completes"]}
                data={usersByGender}
                inClientSessions={statusesCnt?.inClient}
              />
            </div>
            <div className={styles.completes_by_suppliers}>
              <AnalyticsUserCountCard
                cardTitle="completes by suppliers"
                cardSubtitle={["suppliers", "users"]}
                data={usersByCompletesSuppliersData}
                inClientSessions={inClientAcSupplier}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RealtimeOverview;
