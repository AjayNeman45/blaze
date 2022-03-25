import React, { useState } from "react";
import styles from "./Reports.module.css";
import Header from "../../components/header/Header";
import Subheader from "../../components/subheader/Subheader";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  LinearProgress,
  MenuItem,
  Select,
} from "@mui/material";
import { Box } from "@mui/system";
import { AiOutlineInfoCircle, AiOutlineCheck } from "react-icons/ai";
import { BiChevronDown, BiInfoCircle } from "react-icons/bi";
import {
  RiUserFollowLine,
  RiTimerLine,
  RiFullscreenExitFill,
  RiAncientGateLine,
} from "react-icons/ri";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import SurveyInfo from "../../components/survey-info/SurveyInfo";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ExternalSupplier from "../../components/miratsExternalSupplier/ExternalSupplier";
import { useReportsContext } from "./ReportsContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%" }}>
        <LinearProgress
          variant="determinate"
          {...props}
          style={{
            height: `${props.height}px`,
            borderRadius: "20px",
            backgroundColor: "#ecebeb",
          }}
        />
      </Box>
    </Box>
  );
}

let external_supplier_completes1 = {
  title: "mirats external supplier completes",
  table_data: [
    { supplier_name: "Cint AB", completes: 234, avg_cpi: 3.6, amount: 900 },
    {
      supplier_name: "Pure Spectrum",
      completes: 123,
      avg_cpi: 4.5,
      amount: 600,
    },
    { supplier_name: "Prodege", completes: 112, avg_cpi: 6.2, amount: 700 },
    {
      supplier_name: "Data diggers",
      completes: 156,
      avg_cpi: 2.5,
      amount: 200,
    },
  ],
  table_footer: { total_completes: 625, total_cpi: 3.9, total_amount: 2400 },
};
let external_supplier_completes2 = {
  title: "mirats external supplier completes",
  table_data: [
    { supplier_name: "Mirats Quanto", completes: 10, avg_cpi: 5, amount: 50 },
  ],
  table_footer: { total_completes: 10, total_cpi: 5, total_amount: 50 },
};

const clientStatusesData = [
  {
    title: "In Client Survey",
    value: "in_client_survey",
    statusCode: 3,
    desc: "Currently in current survey or drop",
  },
  {
    title: "Completed",
    statusCode: 10,
    desc: "Survey Completed by User",
  },
  {
    title: "Terminated",
    statusCode: 20,
    desc: "Survey terminated at client side",
  },
];

const Reports = () => {
  const { statusesCnt } = useReportsContext();
  return (
    <>
      <Header />
      <Subheader />
      <div className={styles.reports_page}>
        <SurveyInfo />
        <div className={styles.main}>
          <div className={styles.left}>
            {/* respondent activity  */}
            <RespondantActivity />
            <div style={{ margin: "1rem 0 0 1rem" }}>
              <Grid container spacing={2} alignItems="flex-end">
                <Grid itme xs={7}>
                  <AlertCard
                    title="Length of Interview"
                    subtitle="completion loi"
                    count={10}
                    unit="min"
                    expectedCount={20}
                    alertMsg={"alert: HIGH LOI"}
                  />
                </Grid>
                <Grid item xs={5}>
                  <AlertCard
                    title="Length of Interview"
                    subtitle="completion loi"
                    count={10}
                    unit="min"
                    expectedCount={20}
                    alertMsg={"alert: HIGH LOI"}
                  />
                </Grid>
              </Grid>

              <div className={styles.container2}>
                <div>
                  <AlertCard
                    title="Conversion"
                    subtitle="conversion rate"
                    count={43}
                    unit="%"
                    expectedCount={55}
                    alertMsg={"alert: LOW"}
                  />
                </div>
                <div>
                  <AlertCard
                    title="Drop-off"
                    subtitle="drop-off rate"
                    count={20}
                    unit="%"
                    expectedCount={20}
                    alertMsg="No alerts"
                  />
                </div>
                <div>
                  <AlertCard
                    title="quota rate"
                    subtitle="quota rate"
                    count={10}
                    expectedCount={20}
                    alertMsg={"alert: LOW"}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.right}>
            <div className={styles.client_statuses_card}>
              <StatusCard
                cardTitle="Client Statuses"
                cardData={clientStatusesData}
                statusesCnt={statusesCnt}
              />
            </div>
            <div className={styles.mirats_internal_statuses_card}>
              <StatusCard />
            </div>
            <div className={styles.total_survey_cost_card}>
              <span className={styles.legend}>Total Survey Cost</span>
              <span className={styles.value}>$2540</span>
            </div>
          </div>
        </div>

        <div className={styles.externalsuppliercontainer}>
          <div>
            <ExternalSupplier data={external_supplier_completes1} />
          </div>
          <div>
            <ExternalSupplier data={external_supplier_completes2} />
          </div>
        </div>
      </div>
    </>
  );
};

const RespondantActivity = () => {
  const [entrants, setEntrants] = useState(false);
  const [prescreens, setPrescreens] = useState(false);
  const [completes, setCompletes] = useState(false);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
  };

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];
  const Entrants = entrants ? [39, 47, 26, 36, 59, 10, 30] : [];
  const Prescreens = prescreens ? [50, 50, 50, 60, 30, 70, 40] : [];
  const Completes = completes ? [40, 30, 10, 80, 40, 65, 67] : [];

  const data = {
    labels,
    datasets: [
      {
        label: "Entrants",
        data: Entrants.map((data) => data),
        backgroundColor: "#f7b438",
        barThickness: 20,
      },
      {
        label: "Prescreens",
        data: Prescreens.map((data) => data),
        backgroundColor: "rgb(127, 133, 255)",
        barThickness: 20,
      },
      {
        label: "Completes",
        data: Completes.map((data) => data),
        barThickness: 20,
        backgroundColor: "rgb(21, 222, 147)",
      },
    ],
  };

  return (
    <div className={styles.respondant_activity}>
      <p className={styles.legend}>Respondant Activity</p>

      <div className={styles.head}>
        <div
          style={{ borderBottom: entrants && "5px solid orange" }}
          className={styles.entrants}
          onClick={() => setEntrants(!entrants)}
        >
          <div className={styles.title}>
            <RiAncientGateLine size={24} />
            <span>entrants</span>
          </div>

          <span className={styles.value}>511</span>
        </div>
        <div
          style={{
            borderBottom: prescreens && "5px solid rgb(127, 133, 255)",
          }}
          onClick={() => setPrescreens(!prescreens)}
          className={styles.prescreens}
        >
          <div className={styles.title}>
            <RiFullscreenExitFill size={24} />
            <span>prescreens</span>
          </div>
          <span className={styles.value}>458</span>
        </div>
        <div
          className={styles.completes}
          style={{
            borderBottom: completes && "5px solid rgb(21, 222, 147)",
          }}
          onClick={() => setCompletes(!completes)}
        >
          <div className={styles.title}>
            <AiOutlineCheck size={24} />
            <span>completes</span>
          </div>
          <span className={styles.value}>0</span>
        </div>
      </div>
      <Bar options={options} data={data} height={100} />
    </div>
  );
};

const AlertCard = ({
  title,
  subtitle,
  count,
  unit,
  expectedCount,
  alertMsg,
}) => {
  return (
    <div className={styles.alert_card}>
      <p className={styles.legend}>{title}</p>
      <div className={styles.main_boby}>
        <p className={styles.subtitle}>{subtitle}</p>
        <div className={styles.cnt_and_alert_container}>
          <p className={styles.count_and_unit}>
            {count} {unit}
          </p>
          <p className={styles.alert_msg}>{alertMsg}</p>
        </div>
        <div>
          <LinearProgressWithLabel />
        </div>
        <p className={styles.expected_count}>
          expected : {expectedCount} {unit}
        </p>
      </div>
    </div>
  );
};

const StatusCard = ({ cardTitle, cardData, statusesCnt }) => {
  return (
    <div className={styles.clientStatus_conatiner}>
      <h4>{cardTitle}</h4>
      {cardData?.map((data) => {
        return (
          <>
            <div className={styles.clientStatus_title}>
              <div className={styles.clientStatus_div}>
                <h3>{data?.title}</h3>
              </div>
              <p>{data?.statusCode}</p>
            </div>

            <div className={styles.clientStatus_progressDiv}>
              <p>
                {data?.desc}
                <span>{}</span>
              </p>
              <div className={styles.clientStatus_progressBar}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ width: "100%", mr: 1 }}>
                    <LinearProgress variant="determinate" value={10} />
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">
                      10%
                    </Typography>
                  </Box>
                </Box>
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
};

export default Reports;
