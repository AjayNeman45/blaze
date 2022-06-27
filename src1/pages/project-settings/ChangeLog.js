import React, { useEffect, useState } from "react";
import { useProjectSettingsContext } from "./ProjectSettingContext";
import "./ChangeLog.css";
import { v4 as uuid } from "uuid";

const ChangeLogComponent = () => {
  const [displaychanges, setDisplayChanges] = useState([]);
  const { surveyData } = useProjectSettingsContext();

  useEffect(() => {
    setDisplayChanges(surveyData?.changes?.reverse()?.slice(0, 5));
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
                  <tr key={uuid()}>
                    {/* {/ <td>{change?.updated_date.toDate()}</td> /} */}
                    <td>
                      {change?.changed_by?.updated_at
                        ?.toDate()
                        .toLocaleString()}
                    </td>
                    <td>
                      <div>
                        {" "}
                        <p>{change?.changed_by?.name}</p>
                        <small>{change?.changed_by?.email}</small>{" "}
                      </div>
                    </td>
                    <td>
                      <table className="innertable">
                        <thead>
                          <th>Changed Elements/Fields</th>
                          <th>Removed</th>
                          <th>Changed to</th>
                        </thead>
                        <tbody>
                          {Object.keys(change).map((oneKey, i) => {
                            if (oneKey !== "changed_by") {
                              return (
                                <>
                                  {/* {/ <table> /} */}

                                  <tr>
                                    <td>{oneKey}</td>
                                    <td className="removed_value_field">
                                      <p>
                                        {change[oneKey]?.previous_change
                                          ? change[oneKey]?.previous_change
                                          : "-"}
                                      </p>
                                    </td>
                                    <td className="new_value_field">
                                      <p>{change[oneKey]?.changed_to}</p>
                                    </td>
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
