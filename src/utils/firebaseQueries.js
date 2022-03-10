import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  FieldValue,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { ClientJS } from "clientjs";
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
    collection(db, "mirats", "surveys", "survey", surveyID, sessionType)
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
      "mirats",
      "surveys",
      "survey",
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
    collection(db, "mirats", "surveys", "survey", surveyID, "Sessions"),
    {
      ...body,
    }
  );
};

export const getSurvey = async (surveyID) => {
  const survey = await getDoc(
    doc(db, "mirats", "surveys", "survey", String(surveyID))
  );
  return survey.data();
};

export const getAllSurveys = async () => {
  return await getDocs(collection(db, "mirats", "surveys", "survey"));
};

export const getAllSessions = async (surveyID, gamma) => {
  let sessionType = "Sessions";
  if (gamma === "alpha") sessionType = "TestSessions";
  return await getDocs(
    collection(db, "mirats", "surveys", "survey", String(surveyID), sessionType)
  );
};

export const getAllTestSessions = async (surveyID) => {
  return await getDocs(
    collection(
      db,
      "mirats",
      "surveys",
      "survey",
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
  let client_status = mirats_status === 3 && 1;
  if (gamma === "alpha") sessionType = "TestSessions";
  return await setDoc(
    doc(
      db,
      "mirats",
      "surveys",
      "survey",
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
      "mirats",
      "Qualifications",
      "QuestionLibrary",
      String(questionNumber)
    )
  );
};

export const addDocumentToSurvey = async (surveyID, body) => {
  return await setDoc(
    doc(db, "mirats", "surveys", "survey", String(surveyID)),
    {
      documents: arrayUnion(body),
    },
    { merge: true }
  );
};

export const addSecurityChecks = async (surveyID, body) => {
  return await setDoc(
    doc(db, "mirats", "surveys", "survey", String(surveyID)),
    {
      security_checks: body,
    },
    { merge: true }
  );
};

export const addBlockedData = async (surveyID, body) => {
  return await setDoc(
    doc(db, "mirats", "surveys", "survey", String(surveyID)),
    body,
    { merge: true }
  );
};

export const updateQualificationStatus = async (surveyID, question_id) => {
  const survey = await getDoc(doc(db, "mirats", "surveys", "survey", surveyID));
  const questions = survey.data()?.qualifications?.questions;
  questions?.map(async (que) => {
    if (que?.question_id === question_id) {
      que.status = false;
    }
  });
  const res = await updateDoc(
    doc(db, "mirats", "surveys", "survey", surveyID),
    {
      "qualifications.questions": questions,
    },
    { merge: true }
  );
};

export const getQuestions = async (question_type) => {
  let questions = [];
  try {
    if (question_type === "All") {
      const q = query(
        collection(db, "mirats", "Qualifications", "QuestionLibrary")
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.data()?.lang?.["ENG-IN"]?.question_text !== undefined) {
          questions.push(doc.data());
        }
      });
    } else {
      const q = query(
        collection(db, "mirats", "Qualifications", "QuestionLibrary"),
        where("question_type", "==", question_type)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.data()?.lang?.["ENG-IN"]?.question_text !== undefined) {
          questions.push(doc.data());
        }
      });
    }
    return questions;
  } catch (err) {
    return err;
  }
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
        "mirats",
        "surveys",
        "survey",
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
            doc(db, "mirats", "surveys", "survey", surveyID, "Sessions", d.id),
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
      "mirats",
      "surveys",
      "survey",
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
      "mirats",
      "surveys",
      "survey",
      String(surveyID),
      sessionType,
      String(sessionID)
    )
  );
};

export const addQualificationQuestion = async (body, surveyID) => {
  console.log("Question added for survey id ", surveyID, body);
  await updateDoc(
    doc(db, "mirats", "surveys", "survey", surveyID),
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
  const survey = await getDoc(doc(db, "mirats", "surveys", "survey", surveyID));
  let questions = survey.data()?.qualifications?.questions;
  questions?.map(async (que, index) => {
    if (que?.question_id === body?.question_id) {
      questions[index] = body;
    }
  });
  console.log(questions);
  return await updateDoc(
    doc(db, "mirats", "surveys", "survey", surveyID),
    {
      "qualifications.questions": questions,
    },
    { merge: true }
  );
};

export const getSuppier = async (srcID) => {
  const globalRedirects = await getDoc(
    doc(db, "mirats", "supplier", "supplier", String(srcID))
  );
  return globalRedirects.data();
};

export const updateSurvey = async (surveyID, body) => {
  const survey = await updateDoc(
    doc(db, "mirats", "surveys", "survey", surveyID),
    {
      ...body,
    },
    { merge: true }
  );
};

export const addSurvey = async (surveyID, body) => {
  return await setDoc(
    doc(db, "mirats", "surveys", "survey", String(surveyID)),
    { ...body },
    { merge: true }
  );
};