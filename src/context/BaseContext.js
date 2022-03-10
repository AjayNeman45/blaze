import { createContext, useContext, useEffect, useState } from "react";
import { app, db } from "../firebase";
import {
  collection,
  addDoc,
  getDoc,
  query,
  Timestamp,
  doc,
  deleteDoc,
  listDocuments,
  onSnapshot,
} from "firebase/firestore";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

const BaseContext = createContext();

export const useBaseContext = () => {
  return useContext(BaseContext);
};

const BaseContextProvider = ({ children }) => {
  const [baseLoading, setBaseLoading] = useState(false);
  const [sessionTechnicalDetails, setSessionTechnicalDetails] = useState({});
  const [deviceType, setDeviceType] = useState(null);
  // const [os, setOs] = useState(null)
  const [language, setLanguage] = useState(null);
  const [version, setVersion] = useState(null);
  const [browserName, setBrowserName] = useState(null);
  const [isOnline, setIsOnline] = useState(null);
  const [platform, setPlatForm] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [cookieEnabled, setCookieEnabled] = useState(false);
  const [ip, setIp] = useState(null);
  const [geoData, setGeoData] = useState({});
  const [userAgent, setUserAgent] = useState(null);

  const { encryptedID } = useParams();

  const value = {
    baseLoading,
    setBaseLoading,
  };
  return <BaseContext.Provider value={value}>{children}</BaseContext.Provider>;
};

export default BaseContextProvider;
