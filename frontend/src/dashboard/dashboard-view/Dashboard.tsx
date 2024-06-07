import "../style.css";
import { useCallback, useEffect, useState } from "react";
import { IMilestone } from "../../rest/types";
import { DashboardContext, useStudentFilterContext, useInitialDashboardContext, useMilestoneContext } from '../DashboardContext';
import { fetchMilestones } from "../../rest/service";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import StudentsOverview from "../students-view/StudentsOverview";
import  { useNavigate } from 'react-router-dom'
import { NavBar } from "../NavBar";
import Popup from '../Popup';
import NoSourceSetNotice from "./NoSourceSet";
import { ChartsOverview } from "./ChartsOverview";
import { getGradient } from "../../theme/schemes";

export default function Dashboard() {
  const [loadingData, setLoadingData] = useState(false)
  const [loggedIn, setLoggedIn] = useState(true)
  const navigate = useNavigate()

  const dashboardContext = useInitialDashboardContext()

  const selectedMilestone = dashboardContext.milestone
  const milestones = dashboardContext.milestones

  const fetchMilestonesAndUpdateCharts = useCallback(() => {
    setLoadingData(true)
    fetchMilestones().then((response) => {
      if (response.status === 401) {
        setLoggedIn(false)
        return
      } else if (!response || !response.ok) {
        toast.error("Could not fetch milestones.")
        return
      }

      response.json().then((ms: IMilestone[]) => {
        console.log(`fetched ${ms.length} milestones: `, ms)
        ms.sort((one, two) => (one.name < two.name ? -1 : 1));

        if(ms && ms.length){
          milestones?.set(ms)
          setLoadingData(false)
          if (selectedMilestone?.get !== ms[0]) {
            selectedMilestone?.set(ms[0])
          }
        }
      }).then(() => setLoadingData(false))
    })
  }, [selectedMilestone?.get])

  useEffect(() => {
    if(!milestones || !milestones.get?.length){
      fetchMilestonesAndUpdateCharts()
    }
  }, [])

  useEffect(() => {
    if (!loggedIn) {
      navigate("/login")
    }
  }, [loggedIn, navigate])

  return <DashboardContext.Provider value={dashboardContext}>
    <NavBar 
      setLoggedIn={setLoggedIn}
      fetchMilestonesAndUpdateCharts={fetchMilestonesAndUpdateCharts}
    />
    {selectedMilestone?.get ?
      <Overview/> :
      loadingData ?
        <div className="milestone-loader"><ClipLoader color="#00b7ff" size={50}/></div> :
        <NoSourceSetNotice/>
    }
    <ToastContainer/>
  </DashboardContext.Provider>
}

function Overview(){
  const filteredStudents = useStudentFilterContext().filteredStudents
  return filteredStudents ? <StudentsOverview/> : <ChartsOverview/>
}


