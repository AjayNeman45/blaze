import React,{createContext, useEffect, useState} from 'react'
import {getAllSurveys} from '../../utils/firebaseQueries'
let DashboardContext=createContext()
function DashboardContextProvider({children}) {
    let [allSurveys,setAllSurveys]=useState([])
    useEffect(()=>{
        getAllSurveys().then(querysnapshot=>{
            querysnapshot.forEach((doc)=>{
                setAllSurveys(prear=>[...prear,doc.data()])
            })
        })
    },[])
    console.log(allSurveys)

  function FetchTodaySurveyCreated(){
    let count=0;
    allSurveys?.map((survey)=>{
      if(survey?.creation_date?.toDate()?.toDateString()===new Date().toDateString()){
        count=count+1
      }
    })
    return count
  }
  return (
    <DashboardContext.Provider value={{allSurveys,FetchTodaySurveyCreated}}>
    {children}
    </DashboardContext.Provider>
  )
}

export default DashboardContextProvider
export {DashboardContext}