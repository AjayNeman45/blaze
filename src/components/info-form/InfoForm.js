import styles from "./InfoForm.module.css";

const InfoForm = ({ infoFormData }) => {
  return (
    <>
      <div className={styles.info_form}>
        {infoFormData.map((data) => (
          <div className={styles.infoFormData}>
            <form>
              <div className={styles.labelContainer}>
                <label>{data.labelHeader}</label>
              </div>
              <input type="text" placeholder={data.labelInput}></input>
              <span>{data.edit}</span>
            </form>
          </div>
        ))}
      </div>
    </>
  );
};

export default InfoForm;
