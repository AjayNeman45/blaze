import React, { useEffect, useState } from "react";
import { useProjectSettingsContext } from "./ProjectSettingContext";
import "./ChangeLog.css";

const ChangeLogComponent = () => {
  const [displaychanges, setDisplayChanges] = useState([]);
  const { surveyData } = useProjectSettingsContext();

  useEffect(() => {
    setDisplayChanges(surveyData?.changes?.slice(0, 5).reverse());
  }, [surveyData]);
  return (
    <>
      <div className="change_log">
        <p className="change_log_title">Change log</p>
        <p className="change_log_instruction">
          Review Changes to your survey configurations. See who made changes and
          when
        </p>
        <div style={{ overflowX: "auto" }}>
          <table className="change_log_table" border="1">
            <thead>
              <tr>
                <th>
                  {" "}
                  <span>Time@Date</span>{" "}
                </th>

                <th width="200px">
                  {" "}
                  <span>Changesby</span>{" "}
                </th>

                <th>
                  {" "}
                  <span>Changes</span>{" "}
                </th>
              </tr>
            </thead>
            <tbody>
              {displaychanges?.map((change) => {
                return (
                  <tr>
                    {/* {/ <td>{change?.updated_date.toDate()}</td> /} */}
                    <td>{change?.updated_date.toDate().toLocaleString()}</td>
                    <td>
                      <div>
                        {" "}
                        <p>Profile Name</p>
                        <small>profile@gmail.com</small>{" "}
                      </div>
                    </td>
                    <td>
                      <table className="innertable">
                        <th>Changed Elements/Fields</th>
                        <th>Removed</th>
                        <th>Changed to</th>
                        <tbody>
                          {Object.keys(change).map((oneKey, i) => {
                            if (oneKey != "updated_date") {
                              return (
                                <>
                                  {/* {/ <table> /} */}

                                  <tr>
                                    <td>{oneKey}</td>
                                    <td>
                                      {change[oneKey]?.previous_change
                                        ? change[oneKey]?.previous_change
                                        : "-"}
                                    </td>
                                    <td>{change[oneKey]?.changed_to}</td>
                                  </tr>
                                  {/* {/ </table> /} */}
                                </>
                              );
                            }
                          })}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ChangeLogComponent;