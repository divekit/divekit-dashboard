import "./style.css";
import { useEffect, useState } from "react";
import { IMilestone } from "../rest/types";
import { DashboardContext } from './DashboardContext';
import { ProgressBarChart, ProgressLineChart } from "./chart_modules/ProgressCharts";
import { CommitBarChart, CommitPieChart } from "./chart_modules/CommitCharts";
import { TestBarChartOverview } from "./chart_modules/TestCharts";
import StudentOverview from "./chart_modules/student_overview/StudentTable";
import { fetchMilestones, getMilestoneSourcePaths, postMilestoneSource, requestRefresh } from "../rest/service";
import { ClipLoader, PulseLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function ChartsOverview() {
  return <div className="charts-overview">
    <div style={{ display: "flex" }}>
      <div className="chart-container">
        <div className="chart" style={{height: 240, width: 400}}>
          <h3 className="chart-header">Test Progress</h3>
          <ProgressBarChart/>
        </div>
        <div className="chart" style={{height: 350, width: 400}}>
          <h3 className="chart-header">Commit Count</h3>
          <CommitPieChart/>
        </div>
      </div>
      <div className="chart" style={{height: 400, width: 950, paddingBottom: 270}}>
        <h3 className="chart-header">Student Progress</h3>
        <ProgressLineChart/>
      </div>
      {/* <ResizableChart milestone={selectedMilestone}/>  <- keep this for later */} 
      <div className="chart">
        <h3 className="chart-header">Tests</h3>
        <TestBarChartOverview/>
      </div>
    </div>
    <div style={{ display: "flex" }}>
      <div className="chart" style={{height: 400, width: 900}}>
        <h3 className="chart-header">Commit Distribution</h3>
        <CommitBarChart/>
      </div>
      <StudentOverview/>
    </div>
  </div>
}

export default function Dashboard() {
  const [fetchedData, setFetchedData] = useState<IMilestone[]>([])
  const [selectedMilestone, setSelectedMilestone] = useState<IMilestone>()

  async function fetchMilestonesAndUpdateCharts() { //async and await might be useless here idk yet
    try {
      await fetchMilestones().then((milestones : IMilestone[])=> {
        console.log("the fetched data:", milestones)
        milestones.sort((one, two) => (one.name < two.name ? -1 : 1));
        if(milestones && milestones.length){
          console.log(milestones.length)
          console.log("displaying this data")
          setFetchedData(milestones)
          if (selectedMilestone !== milestones[0]) {
            setSelectedMilestone(milestones[0])
          }
        } else {
          // displayEmptyCharts()
        }
       });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    if(!fetchedData.length){
      fetchMilestonesAndUpdateCharts()
    }
  })

  return <DashboardContext.Provider value={selectedMilestone}>
    <NavBar setSelectedMilestone={setSelectedMilestone} milestones={fetchedData} fetchMilestonesAndUpdateCharts={fetchMilestonesAndUpdateCharts}/>
    {selectedMilestone ?
      <ChartsOverview/> :
      <NoSourceSetNotice/>
    }
    <ToastContainer/>
  </DashboardContext.Provider>
}

function NavBar({setSelectedMilestone, milestones, fetchMilestonesAndUpdateCharts} : 
    {setSelectedMilestone: React.Dispatch<React.SetStateAction<IMilestone | undefined>>, milestones: IMilestone[], fetchMilestonesAndUpdateCharts(): Promise<void>}){
  // milestoneLink can be set to empty or the most recent/common milestone overview link
  const [milestoneLink, setMilestoneLink] = useState("https://git.archi-lab.io/staff/st1/ws23/milestone-overview")
  const [pathsToProcess, setPathsToProcess] = useState(0)
  const [pathsFinished, setPathsFinished] = useState(0)
  const [disableButton, setDisableButton] = useState(false)
  const [isRefreshingMilestones, setisRefreshingMilestones] = useState(false)

  useEffect(() => {
    if (pathsToProcess === pathsFinished) {
      setPathsToProcess(0)
      setPathsFinished(0)
      setDisableButton(false)
    }
  }, [pathsFinished, pathsToProcess])

  function addMilestoneSource(milestoneLink: string){
    const linkTrimmed = milestoneLink.replace("https://git.archi-lab.io/", "");

    getMilestoneSourcePaths(linkTrimmed).then((paths: string[]) => {
      if (paths.length === 0) {
        toast("Overview path does not exist. Please try a different link.");
        setDisableButton(false)
        return;
      }

      setPathsToProcess(paths.length);
      paths.forEach(async (path) => postMilestoneSource(path)
        .then((response) => {
          setPathsFinished(paths => paths + 1)
          if (response?.ok) {
            fetchMilestonesAndUpdateCharts()
          } else {
            toast(`Could not post milestone source: ${path}. Please try again.`)
          }
        })
      )
    })
  }

  function onRequestRefresh(){
    setisRefreshingMilestones(true)
    requestRefresh().then((milestones) => {
      setisRefreshingMilestones(false)
      if (milestones.length === 0) {
        toast(`Could not refresh current milestone data. Please try refreshing again if necessary.`)
      }
    })
  }

  return <div style={{backgroundColor: 'white', display:"flex", alignItems: "center"}} className="nav-bar">
    Milestone:<MilestoneDropdown setSelectedMilestone={setSelectedMilestone} milestones={milestones}/>
    <button onClick={() => onRequestRefresh()} disabled={isRefreshingMilestones}>
      {isRefreshingMilestones ? 
        <ClipLoader size={11} color="#5fecff"/> : 
        "⟳"
      }
    </button>
    <div className="milestone-source">
      Milestone-Overview:<input className="input" size={70} value={milestoneLink} onChange={e => setMilestoneLink(e.target.value)}/>
      <button disabled={disableButton} onClick={() => {
        setDisableButton(true)
        addMilestoneSource(milestoneLink)
      }}>
        {">>"}
      </button>
      { pathsToProcess !== 0 && pathsFinished + "/" + pathsToProcess + " MS" }
    </div>
    <PulseLoader cssOverride={{marginRight: 16}} loading={pathsToProcess !== 0} size={9} color="#5fecff"/>
  </div>
}

function MilestoneDropdown({setSelectedMilestone, milestones} : 
  {setSelectedMilestone: React.Dispatch<React.SetStateAction<IMilestone | undefined>>, milestones: IMilestone[]}){
  const options = []
  milestones.sort((one, two) => (one.name < two.name ? -1 : 1));
  for (let i = 0; i < milestones.length; i++) {
    options.push(<option key={i} value={milestones[i].name}>{milestones[i].name}</option>)
  }
  return <select className="input" onChange={e => {
    setSelectedMilestone(milestones.find(milestone => milestone.name === e.target.value))
  }}>
    {options}
  </select>
}

function NoSourceSetNotice(){
  return <div className="card" style={{textAlign: "center"}}>
    <h1 className="divekit-header">Divekit Dashboard</h1>
    <p style={{width: "700px", margin: "auto", paddingBottom: "20px"}}>
      Please set a milestone source to view milestones.<br/>
      Milestone sources are found in the repositories under https://git.archi-lab.io/ 
      and can be added with the button on the upper right.</p>
  </div>
}
