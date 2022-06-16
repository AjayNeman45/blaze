import React, { useEffect, useState } from "react";
import AnalyticsUserCountCard from "../../components/analyticsUserCountCard/AnalyticsUserCountCard";
import styles from "./Analytics.module.css";
import { useAanalyticsContext } from "./AnalyticsContext";
import RealTimeOverViewDoughnutChart from "./realtime-overview-doughnut-chart/RealtimeOverviewDoughnutChart";

const RealtimeOverview = () => {
  const [lastTimeSessions, setLastTimeSessions] = useState([]);
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
  const { allSessions, survey, statusesCnt, lastPresentTime } =
    useAanalyticsContext();

  useEffect(() => {
    setLastTimeSessions([]);
    setInClientAcLast30Minutes(0);
    allSessions?.forEach((session) => {
      const sd = session.data();
      let diff = (sd?.date?.toDate()?.getTime() - new Date().getTime()) / 1000;
      diff = Math.abs(Math.round(diff / 60));
      if (
        sd?.date.toDate().getDate() === new Date().getDate() &&
        diff < parseInt(lastPresentTime) &&
        sd?.mirats_status === 3
      ) {
        setLastTimeSessions((prevData) => [...prevData, sd]);
        if (sd?.mirats_status === 3) {
          setInClientAcLast30Minutes((prevData) => prevData + 1);
        }
      }
    });
  }, [allSessions, lastPresentTime]);

  useEffect(() => {
    setUsersBySuppliersData({});
    setUsersByCompletesSuppliersData({});
    setInClientAcSupplier({});
    setUsersByClientStatusData({});
    setUsersByDeviceTypes({ desktop: 0, mobile: 0 });
    // for users by supliers card
    survey?.external_suppliers?.map((supp) => {
      lastTimeSessions?.map((session) => {
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
      // condition for calculating the suppliers by completes
      lastTimeSessions?.forEach((session) => {
        if (
          supp?.supplier_account_id === session?.supplier_account_id &&
          session?.client_status === 10
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
          supp?.supplier_account_id === session?.supplier_account_id &&
          session?.mirats_status === 3
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

    lastTimeSessions?.map((session) => {
      // for users by client status card
      const handleUsersByClientStatus = (status) => {
        setUsersByClientStatusData((prevData) => {
          return {
            ...prevData,
            [status]: (prevData?.[status] ? prevData?.[status] : 0) + 1,
          };
        });
      };

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
      if (session?.session_technical_details?.deviceType === "Desktop") {
        setUsersByDeviceTypes((prevData) => {
          return {
            ...prevData,
            desktop: prevData?.desktop + 1,
          };
        });
      } else if (session?.session_technical_details?.deviceType === "Mobile") {
        setUsersByDeviceTypes((prevData) => {
          return {
            ...prevData,
            mobile: prevData?.mobile + 1,
          };
        });
      }

      //for gender by completes card
      const handleUsersByGender = (gender) => {
        setUsersByGender((prevData) => {
          return {
            ...prevData,
            [gender]: prevData?.[gender] + 1,
          };
        });
      };
      //for gender by completes card
      session?.responses?.map((resp) => {
        if (
          parseInt(resp?.question_id) === 43 &&
          session?.client_status === 10
        ) {
          if (session?.responses[1]?.user_response === 0) {
            handleUsersByGender("Male");
          } else if (session?.responses[1]?.user_response === 1) {
            handleUsersByGender("Female");
          }
        }
      });
    });
  }, [lastTimeSessions, survey, allSessions]);

  return (
    <>
      <div className={styles.realtime_overview_page}>
        <div className={styles.left}>
          <div className={styles.realtime_doughnut_chart}>
            <RealTimeOverViewDoughnutChart
              data={usersByDeviceTypes}
              inClientAcLast30Minutes={inClientAcLast30Minutes}
              lastPresentTime={lastPresentTime}
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
              lastPresentTime={lastPresentTime}
            />
          </div>
          <div className={styles.users_by_client_status_card}>
            <AnalyticsUserCountCard
              cardTitle="users by client status"
              cardSubtitle={["suppliers", "users"]}
              data={usersByClientStatusData}
              inClientSessions={statusesCnt?.inClient}
              last30MinutesCard={true}
              lastPresentTime={lastPresentTime}
            />
          </div>

          <div className={styles.gender_by_complets_and_completes_by_suppliers}>
            <div className={styles.gender_by_complete_card}>
              <AnalyticsUserCountCard
                cardTitle="gender by completes"
                cardSubtitle={["suppliers", "completes"]}
                data={usersByGender}
                last30MinutesCard={true}
                lastPresentTime={lastPresentTime}
                inClientSessions={statusesCnt?.inClient}
              />
            </div>
            <div className={styles.completes_by_suppliers}>
              <AnalyticsUserCountCard
                cardTitle="completes by suppliers"
                cardSubtitle={["suppliers", "users"]}
                data={usersByCompletesSuppliersData}
                last30MinutesCard={true}
                lastPresentTime={lastPresentTime}
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
