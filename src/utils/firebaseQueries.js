import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  FieldValue,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { ClientJS } from "clientjs";
import { encryptText } from "./enc-dec.utils";
const client = new ClientJS();

const fetchIP = async () => {
  let url = "https://get.geojs.io/v1/ip.json";
  const response = await fetch(url);
  return response.json();
};
const fingerPrint = client.getFingerprint();
export const getSessionID = async (surveyID, setSessionID, gamma) => {
  let sessionType = "Sessions";
  if (gamma === "alpha") sessionType = "TestSessions";
  const sessions = await getDocs(
    collection(db, "miratsinsights", "blaze", "surveys", surveyID, sessionType)
  );
  sessions.forEach((session) => {
    fetchIP().then((data) => {
      if (session.data()?.fingerprint === fingerPrint) {
        setSessionID(session.id);
      }
    });
  });
};

export const updateSession = async (surveyID, sessionID, gamma, body) => {
  let sessionType = "Sessions";
  if (gamma === "alpha") sessionType = "TestSessions";

  return await updateDoc(
    doc(
      db,
      "miratsinsights",
      "blaze",
      "surveys",
      String(surveyID),
      sessionType,
      sessionID
    ),
    {
      ...body,
    },
    {
      merge: true,
    }
  );
};

export const addSession = async (body, surveyID) => {
  return await addDoc(
    collection(db, "miratsinsights", "blaze", "surveys", surveyID, "Sessions"),
    {
      ...body,
    }
  );
};

export const getSurvey = async (surveyID) => {
  const survey = await getDoc(
    doc(db, "miratsinsights", "blaze", "surveys", String(surveyID))
  );
  return survey.data();
};

export const getAllSurveys = async () => {
  return await getDocs(
    collection(db, "miratsinsights", "blaze", "surveys"),
    orderBy("creation_date", "asc")
  );
};

export const getAllSessions = async (surveyID, gamma) => {
  let sessionType = "Sessions";
  if (gamma === "alpha") sessionType = "TestSessions";
  const q = query(
    collection(
      db,
      "miratsinsights",
      "blaze",
      "surveys",
      String(surveyID),
      sessionType
    ),
    orderBy("date", "asc")
  );
  return await getDocs(q);
};

export const getAllTestSessions = async (surveyID) => {
  return await getDocs(
    collection(
      db,
      "miratsinsights",
      "blaze",
      "surveys",
      String(surveyID),
      "TestSessions"
    )
  );
};

export const addQualificationResponse = async (
  sid,
  sessionID,
  body,
  gamma,
  mirats_status
) => {
  let sessionType = "Sessions";
  let client_status = mirats_status === 3 ? 1 : -1;
  if (gamma === "alpha") sessionType = "TestSessions";
  return await setDoc(
    doc(
      db,
      "miratsinsights",
      "blaze",
      "surveys",
      String(sid),
      sessionType,
      String(sessionID)
    ),
    {
      responses: arrayUnion(body),
      mirats_status,
      client_status,
    },
    {
      merge: true,
    }
  );
};

export const getQuestion = async (questionNumber) => {
  return await getDoc(
    doc(
      db,
      "miratsinsights",
      "blaze",
      "question_library",
      String(questionNumber)
    )
  );
};

export const addDocumentToSurvey = async (surveyID, body) => {
  return await setDoc(
    doc(db, "miratsinsights", "blaze", "surveys", String(surveyID)),
    {
      documents: arrayUnion(body),
    },
    { merge: true }
  );
};

export const addSecurityChecks = async (surveyID, body) => {
  return await setDoc(
    doc(db, "miratsinsights", "blaze", "surveys", String(surveyID)),
    {
      security_checks: body,
    },
    { merge: true }
  );
};

export const addBlockedData = async (surveyID, body) => {
  return await setDoc(
    doc(db, "miratsinsights", "blaze", "surveys", String(surveyID)),
    body,
    { merge: true }
  );
};

export const updateQualificationStatus = async (surveyID, question_id) => {
  const survey = await getDoc(
    doc(db, "miratsinsights", "blaze", "surveys", surveyID)
  );
  const questions = survey.data()?.qualifications?.questions;
  questions?.map(async (que) => {
    if (que?.question_id === question_id) {
      que.status = false;
    }
  });
  const res = await updateDoc(
    doc(db, "miratsinsights", "blaze", "surveys", surveyID),
    {
      "qualifications.questions": questions,
    },
    { merge: true }
  );
};

export const getQuestions = async (question_type, survey) => {
  let questions = [];
  try {
    if (question_type === "All") {
      const q = query(
        collection(db, "miratsinsights", "blaze", "question_library")
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (
          doc.data()?.lang?.[survey?.country?.code]?.question_text !== undefined
        ) {
          questions.push(doc.data());
        }
      });
    } else {
      const q = query(
        collection(db, "miratsinsights", "blaze", "question_library"),
        where("question_type", "==", question_type)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (
          doc.data()?.lang?.[survey?.country?.code]?.question_text !== undefined
        ) {
          questions.push(doc.data());
        }
      });
    }
    return questions;
  } catch (err) {
    return err;
  }
};

export const getAllQuestionLibraryQuestions = async () => {
  const q = query(
    collection(db, "miratsinsights", "blaze", "question_library"),
    orderBy("question_id", "desc")
  );
  return await getDocs(q);
};

export const updateReconciliationStatus = async (
  surveyID,
  ids,
  reconciliationType
) => {
  let data = {};
  if (reconciliationType == "Completes and Adjusted Termination") {
    data.status = "approved";
    data.date = new Date();
  } else if (reconciliationType == "Post Survey Termination") {
    data.status = "rejected";
    data.date = new Date();
  } else if (reconciliationType === "Security Disqualification") {
    data.status = "rejected";
    data.reason = "security reason";
    data.date = new Date();
  }
  getDocs(
    query(
      collection(
        db,
        "miratsinsights",
        "blaze",
        "surveys",
        String(surveyID),
        "Sessions"
      ),
      where("status", "in", [10, 1])
    )
  )
    .then((res) => {
      res.forEach((d) => {
        if (ids.includes(d.data()?.rid)) {
          updateDoc(
            doc(
              db,
              "miratsinsights",
              "blaze",
              "surveys",
              surveyID,
              "Sessions",
              d.id
            ),
            {
              reconciliation: data,
            },
            {
              merge: true,
            }
          );
          console.log("reconciliation status updated");
        } else {
          console.log("rid not matched");
        }
      });
    })
    .catch((err) => err);
};

export const addTestSession = async (body, surveyID) => {
  return await addDoc(
    collection(
      db,
      "miratsinsights",
      "blaze",
      "surveys",
      String(surveyID),
      "TestSessions"
    ),
    {
      ...body,
    }
  );
};

export const getSessionBasedOnType = async (
  surveyID,
  sessionID,
  sessionType
) => {
  return await getDoc(
    doc(
      db,
      "miratsinsights",
      "blaze",
      "surveys",
      String(surveyID),
      sessionType,
      String(sessionID)
    )
  );
};

export const addQualificationQuestion = async (body, surveyID) => {
  console.log("Question added for survey id ", surveyID, body);
  await updateDoc(
    doc(db, "miratsinsights", "blaze", "surveys", surveyID),
    {
      "qualifications.questions": arrayUnion(body),
    },
    {
      merge: true,
    }
  );
};

export const updateQualificationQuestion = async (body, surveyID) => {
  console.log(body);
  const survey = await getDoc(
    doc(db, "miratsinsights", "surveys", "survey", surveyID)
  );
  let questions = survey.data()?.qualifications?.questions;
  questions?.map(async (que, index) => {
    if (que?.question_id === body?.question_id) {
      questions[index] = body;
    }
  });
  console.log(questions);
  return await updateDoc(
    doc(db, "miratsinsights", "surveys", "survey", surveyID),
    {
      "qualifications.questions": questions,
    },
    { merge: true }
  );
};

export const getSuppier = async (srcID) => {
  const staticRedirects = await getDoc(
    doc(db, "miratsinsights", "supplier", "supplier", String(srcID))
  );
  return staticRedirects.data();
};

export const updateSurvey = async (surveyID, body) => {
  return await updateDoc(
    doc(db, "miratsinsights", "blaze", "surveys", String(surveyID)),
    {
      ...body,
    },
    { merge: true }
  );
};

export const addSurvey = async (surveyID, body) => {
  return await setDoc(
    doc(db, "miratsinsights", "blaze", "surveys", String(surveyID)),
    { ...body },
    { merge: true }
  );
};

export const getStatusDesc = async (statusType, code) => {
  const result = await getDoc(
    doc(db, "miratsinsights", "error_codes", statusType, String(code))
  );
  return result.data();
};

export const addQuota = async (surveyID, questionID, body) => {
  let result = await getDoc(
    doc(db, "miratsinsights", "blaze", "surveys", String(surveyID))
  );
  let questions = result.data().qualifications?.questions?.map((question) => {
    if (question?.question_id === questionID) {
      return {
        ...question,
        conditions: {
          ...question?.conditions,
          quotas: body,
        },
      };
    } else return question;
  });

  return await updateDoc(
    doc(db, "miratsinsights", "blaze", "surveys", String(surveyID)),
    {
      "qualifications.questions": questions,
    },
    { merge: true }
  );
};

export const getAllSuppliers = async () => {
  return await getDocs(collection(db, "miratsinsights", "spark", "supplier"));
};

export const addStaticRedirects = async (supplier_id, body) => {
  console.log(supplier_id, body);
  return await updateDoc(
    doc(db, "miratsinsights", "supplier", "supplier", String(supplier_id)),
    {
      global_redirects: body,
    },
    {
      merge: true,
    }
  );
};
export const updateSurveyData = async (surveyID, sData, changes) => {
  const newEncryptedCid = encryptText(sData?.country?.country);
  return await updateDoc(
    doc(db, "miratsinsights", "blaze", "surveys", String(surveyID)),
    {
      ...sData,
      changes: arrayUnion(changes),
      "encrypt.cid": newEncryptedCid,
    },
    {
      merge: true,
    }
  );
};

export const getErrorCodesForClientStatus = async () => {
  return await getDocs(
    query(collection(db, "miratsinsights", "blaze", "client_codes"))
  );
};

export const getErrorCodesForMiratsStatus = async () => {
  return await getDocs(
    query(collection(db, "miratsinsights", "blaze", "mirats_codes"))
  );
};

export const getClients = async () => {
  return await getDocs(
    query(collection(db, "miratsinsights", "spark", "customer"))
  );
};

export const addSurveyGroup = async (data, surveyGrpID) => {
  return await setDoc(
    doc(db, "miratsinsights", "blaze", "survey_groups", String(surveyGrpID)),
    { ...data },
    { merge: true }
  );
};

export const getAllSurveyGroups = async () => {
  return await getDocs(
    collection(db, "miratsinsights", "blaze", "survey_groups")
  );
};

export const addQuestion = async (body, id) => {
  return await setDoc(
    doc(db, "miratsinsights", "blaze", "question_library", String(id)),
    { ...body },
    {
      merge: true,
    }
  );
};

export const getSurveyGrpData = async (surveyGrpNumber) => {
  return await getDocs(
    query(
      collection(db, "miratsinsights", "blaze", "survey_groups"),
      where("survey_group_number", "==", surveyGrpNumber)
    )
  );
};

export const deleteSurveyGroup = async (surveyGrpNum) => {
  console.log(surveyGrpNum);
  return getDocs(
    query(
      collection(db, "miratsinsights", "blaze", "survey_groups"),
      where("survey_group_number", "==", surveyGrpNum)
    )
  ).then(async (surveyGrpDoc) => {
    console.log(surveyGrpDoc.docs[0].id);
    return await deleteDoc(
      doc(
        db,
        "miratsinsights",
        "blaze",
        "survey_groups",
        surveyGrpDoc.docs[0].id
      )
    );
  });
};

export const updateSupplier = async (survey, supplier) => {
  const updatedExternalSupplier = survey?.external_suppliers?.map((supp) => {
    if (supp?.supplier_account_id === supplier?.supplier_account_id) {
      return supplier;
    }
    return supp;
  });

  survey.external_suppliers = updatedExternalSupplier;
  console.log(survey?.survey_id);
  return await updateSurvey(survey?.survey_id, survey);
};

export const deleteSurveys = async (elem) => {
  return await deleteDoc(
    doc(db, "miratsinsights", "blaze", "surveys", String(elem))
  );
};

export const getUserData = async (id) => {
  return await getDoc(doc(db, "miratsinsights", "peoples", "employee", id));
};

export const updateQuestion = async (questionID, body) => {
  return await updateDoc(
    doc(db, "miratsinsights", "blaze", "question_library", String(questionID)),
    { ...body }
  );
};

export const deleteLangFromQualification = async (
  questionID,
  deletedLangQue
) => {
  console.log(questionID, deletedLangQue);
  return await updateDoc(
    doc(db, "miratsinsights", "blaze", "question_library", questionID),
    { ...deletedLangQue },
    { merge: true }
  );
};

export const getAllEmployees = async () => {
  return await getDocs(collection(db, "miratsinsights", "peoples", "employee"));
};

export const getMiratsInsightsTeam = async () => {
  try {
    let peoples = {
      sales_managers: [],
      account_managers: [],
      project_managers: [],
    };
    const allEmps = await getAllEmployees();
    allEmps.forEach((empp) => {
      let emp = empp.data();
      let fullName = emp?.basicinfo?.firstname + " " + emp?.basicinfo?.lastname;
      let userID = emp?.UserID;
      let teamName = emp?.WorkDetails?.teamname;
      // --->> if its ayan ali then store in sales team and accounts team
      if (emp?.WorkDetails?.employeeID === "160620-1A") {
        peoples["sales_managers"].push({
          label: fullName,
          value: userID,
        });
        peoples["account_managers"].push({
          label: fullName,
          value: userID,
        });
        return;
      }
      // --->> if its janhavi ali then store in project managers team and accounts team
      if (emp?.WorkDetails?.employeeID === "250820-1A") {
        peoples["project_managers"].push({
          label: fullName,
          value: userID,
        });
        peoples["account_managers"].push({
          label: fullName,
          value: userID,
        });
        return;
      }
      switch (teamName) {
        case "Mirats OTC / illustrate Projects Support":
          peoples["project_managers"].push({
            label: fullName,
            value: userID,
          });
          break;
        case "Sales":
          peoples["sales_managers"].push({
            label: fullName,
            value: userID,
          });
      }
    });
    return peoples;
  } catch (error) {
    return error.message;
  }
};
