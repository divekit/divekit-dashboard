import "./style.css"
import { useEffect, useRef, useState } from "react";
import { IMilestone, IStudent } from "../rest/types";
import { MilestoneContext } from './MilestoneContext';
import { ProgressBarChart, ProgressLineChart } from "./chart_modules/ProgressCharts";
import { CommitBarChart, CommitPieChart } from "./chart_modules/CommitCharts";
import { TestBarChartOverview } from "./chart_modules/TestCharts";
import { ImperativePanelHandle, Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import StudentOverview from "./StudentOverview";
import { fetchMilestones, getMilestoneSourcePaths, postMilestoneSource, wait } from "../rest/service";
import PacmanLoader from "react-spinners/PacmanLoader";

function ChartsOverview() {
  return <>
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
  </>
}

interface ResizableChartProps {
  chart?: React.ReactNode,
  title?: string,
  isLastElement?: boolean
}

function ChartPanel({chart, title, isLastElement = false} : ResizableChartProps){
  const [currentHeight, setCurrentHeight] = useState(500)
  const [currentWidth, setCurrentWidth] = useState(300)

  const ref = useRef<ImperativePanelHandle>(null);
  function updateSize(){
    const panel = ref.current
    if(panel){
      setCurrentWidth(panel.getSize() * 10)
    }
  }

  // necessary extra panel for last row/column -- maybe there is a better way..
  const resizeHandle =  isLastElement ? <> 
      <PanelResizeHandle onDragging={() => updateSize()}/>
      <Panel minSize={0} maxSize={0}></Panel>
    </> :
    <PanelResizeHandle onDragging={() => updateSize()}/>

  return <>
    <Panel minSize={30} ref={ref}>
      <div style={{height: currentHeight, width: currentWidth, paddingBottom: 270}}> 
        <h3 className="chart-header">{title}</h3>
        {chart}
      </div>
    </Panel>
    {resizeHandle}
  </>
}

function ResizableChart(){
  // padding and other styling options i will look at later
  return  <PanelGroup direction="horizontal">
    <ChartPanel chart={<ProgressLineChart/>} title="Student Progress"/>
    <ChartPanel chart={<CommitPieChart/>} title="Commit Count"/>
    {/* <ChartPanel chart={<TestBarChartOverview milestone={milestone}/>} title="Tests" isLastElement={true}/> TODO readd */}
  </PanelGroup>
}

function runQuery(query: string){
  console.log("i'm not doing anything: " + query)
}

function MilestoneDropdown({setSelectedMilestone, milestones} : 
  {setSelectedMilestone: React.Dispatch<React.SetStateAction<IMilestone | undefined>>, milestones: IMilestone[]}){
  const options = []
  for (let i = 0; i < milestones.length; i++) {
    options.push(<option key={i} value={milestones[i].id}>{milestones[i].name}</option>)
  }
  return <select onChange={e => {
    console.log("current selected milestone: ", milestones.find(milestone => milestone.id === Number(e.target.value)))
    setSelectedMilestone(milestones.find(milestone => milestone.id === Number(e.target.value)))
  }}>
    {options}
  </select>
}

function NavBar({setSelectedMilestone, milestones, fetchMilestonesAndUpdateCharts} : 
    {setSelectedMilestone: React.Dispatch<React.SetStateAction<IMilestone | undefined>>, milestones: IMilestone[], fetchMilestonesAndUpdateCharts(): Promise<void>}){

  const [query, setQuery] = useState("")
  // TODO: remove default link later
  const [milestoneLink, setMilestoneLink] = useState("https://git.archi-lab.io/staff/st1/ws23/milestone-overview")
  const [pathsToProcess, setPathsToProcess] = useState(0)
  const [pathsFinished, setPathsFinished] = useState(0)
  const [disableButton, setDisableButton] = useState(false)

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
        return; // TODO: display message to user that milestone exists already
      }
      setPathsToProcess(paths.length);

      paths.forEach(async (path) => {
        postMilestoneSource(path).then(() => {
          fetchMilestonesAndUpdateCharts()
          setPathsFinished(paths => paths + 1)
        })
      })
    })
  }

  return <div style={{backgroundColor: 'white', display:"flex"}} className="card">
    Milestone:&nbsp; <MilestoneDropdown setSelectedMilestone={setSelectedMilestone} milestones={milestones}/>&nbsp;
    Milestone-Overview:&nbsp; <input size={70} value={milestoneLink} onChange={e => setMilestoneLink(e.target.value)}/>&nbsp;
    <button disabled={disableButton} onClick={() => {
      setDisableButton(true)
      addMilestoneSource(milestoneLink)
    }}>
      {">>"}
    </button>&nbsp;
    { pathsToProcess !== 0 && pathsFinished + "/" + pathsToProcess + " MS" }
    <PacmanLoader cssOverride={{marginLeft: 8}} loading={pathsToProcess !== 0} size={11} color="#5fecff"/>
    <div className="query-input">
      Query: <input size={70} value={query} onChange={e => setQuery(e.target.value)}/>&nbsp;
      <button onClick={() => runQuery(query)}>{">>"}</button>
    </div>
  </div>
}

export default function Dashboard() {
  const [fetchedData, setFetchedData] = useState<IMilestone[]>([])
  const [displayedData, setDisplayedData] = useState<IStudent[]>([])
  const [selectedMilestone, setSelectedMilestone] = useState<IMilestone>()

  async function fetchMilestonesAndUpdateCharts() { //async and await might be useless here idk yet
    try {
      await fetchMilestones().then((milestones : IMilestone[])=> {
        console.log("the fetched data:", milestones)
        if(milestones && milestones.length){ 
          console.log(milestones.length)
          console.log("displaying this data")
          setFetchedData(milestones)
          if(displayedData.length == 0){ // only update the current displayed milestone if there wasn't any before (gets set to the first one)
            setDisplayedData(milestones[0].students)
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
  }, [])

  return <MilestoneContext.Provider value={selectedMilestone}>
    <NavBar setSelectedMilestone={setSelectedMilestone} milestones={fetchedData} fetchMilestonesAndUpdateCharts={fetchMilestonesAndUpdateCharts}/>
    {selectedMilestone &&
      <ChartsOverview/> 
    }
  </MilestoneContext.Provider>
}
