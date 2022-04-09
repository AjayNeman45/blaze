import styles from "./AccountHeader.module.css";

const AccountHeader = ({ headerData, heading, head }) => {
  return (
    <>
      <div className={styles.header_container}>
        <div className={styles.top}>
          <span className={styles.heading}>{heading}</span>
          <h1 className={styles.head}>{head}</h1>
        </div>

        <div className={styles.bottom}>
          {headerData.map((data) => (
            <div className={styles.bottom_data}>
              <p className={styles.bottom_title}>{data.title}</p>
              <p className={styles.highlight}>{data.link}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AccountHeader;
