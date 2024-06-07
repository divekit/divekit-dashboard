import { useCallback, useEffect, useState } from "react";
import { IMilestone } from "../rest/types";
import { useDashboardContext, useMilestoneContext, useMilestonesContext, useStudentFilterContext } from './DashboardContext';
import { getMilestoneSourcePaths, postMilestoneSource, requestRefresh } from "../rest/service";
import { ClipLoader, PulseLoader } from "react-spinners";
import { toast } from "react-toastify";
import Popup from './Popup';

export function NavBar({ setLoggedIn, fetchMilestonesAndUpdateCharts }: {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  fetchMilestonesAndUpdateCharts(): void;
}) {
  // milestoneLink can be set to empty or the most recent/common milestone overview link
  const [milestoneLink, setMilestoneLink] = useState("https://git.archi-lab.io/staff/st1/ws23/milestone-overview");
  const [pathsToProcess, setPathsToProcess] = useState(0);
  const [pathsFinished, setPathsFinished] = useState(0);
  const [disableButton, setDisableButton] = useState(false);
  const [isRefreshingMilestones, setisRefreshingMilestones] = useState(false);
  const filteredContext = useStudentFilterContext();

  const setCurrentMilestone = useMilestoneContext().set;
  const getCurrentMilestone = useMilestoneContext().get;
  const milestones = useMilestonesContext().get;

  const addMilestoneSource = useCallback((milestoneLink: string) => {
    const linkTrimmed = milestoneLink.replace("https://git.archi-lab.io/", "");

    getMilestoneSourcePaths(linkTrimmed).then((response) => {
      if (response?.status === 401) {
        setLoggedIn(false);
        return;
      } else if (!response || !response.ok) {
        toast.error("Overview path does not exist. Please try a different link.");
        setDisableButton(false);
        return;
      }

      response.json().then((paths: string[]) => {
        setPathsToProcess(paths.length);

        paths.forEach(async (path) => postMilestoneSource(path).then((response) => {
          setPathsFinished(paths => paths + 1);
          if (response?.ok) {
            fetchMilestonesAndUpdateCharts();
          } else if (response?.status === 401) {
            setLoggedIn(false);
          } else {
            toast.error(`Could not post milestone source: ${path}. Please try again.`);
          }
        }));
      });
    });
  }, [fetchMilestonesAndUpdateCharts, setLoggedIn]);

  const onRequestRefresh = useCallback(() => {
    setisRefreshingMilestones(true);
    requestRefresh().then((response) => {
      if (response?.ok) {
        setisRefreshingMilestones(false);
      } else if (response?.status === 401) {
        setLoggedIn(false);
      } else {
        toast.error(`Could not refresh current milestone data. Please try refreshing again if necessary.`);
      }
    });
  }, [setLoggedIn])

  useEffect(() => {
    if (pathsToProcess === pathsFinished) {
      setPathsToProcess(0);
      setPathsFinished(0);
      setDisableButton(false);
    }
  }, [pathsFinished, pathsToProcess]);

  return <div style={{ backgroundColor: 'white', display: "flex", alignItems: "center" }} className="nav-bar">
    {filteredContext.filteredStudents ?
      <div>
        <button onClick={() => {
          filteredContext.setFilteredStudents(undefined);
        }}>
          {"←"}
        </button>
      </div> :
      <div>
        {milestones && 
        <div>
          Milestone:<MilestoneDropdown setSelectedMilestone={setCurrentMilestone} selectedMilestone={getCurrentMilestone} milestones={milestones} />
          <button onClick={() => onRequestRefresh()} disabled={isRefreshingMilestones || milestones.length === 0}>
            {isRefreshingMilestones ?
              <ClipLoader size={11} color="#5fecff" /> :
              "⟳"}
          </button>
          <Popup></Popup>
          {/* settings button is not centered for whatever reason.. */}
          <a href="#settings"><button>
            ⚙
          </button></a>
        </div>}
      </div>
    }

    <div className="milestone-source">
      Milestone-Overview:<input className="input" size={70} value={milestoneLink} onChange={e => setMilestoneLink(e.target.value)} />
      <button disabled={disableButton} onClick={() => {
        setDisableButton(true);
        addMilestoneSource(milestoneLink);
      }}>
        {">>"}
      </button>
      {pathsToProcess !== 0 && pathsFinished + "/" + pathsToProcess + " MS"}
    </div>
    <PulseLoader cssOverride={{ marginRight: 5, marginLeft: 6 }} loading={pathsToProcess !== 0} size={9} color="#5fecff" />
  </div>;
}

function MilestoneDropdown({ setSelectedMilestone, selectedMilestone, milestones }: { setSelectedMilestone: React.Dispatch<React.SetStateAction<IMilestone | undefined>>; selectedMilestone: IMilestone | undefined; milestones: IMilestone[]; }) {
  const options = [];
  milestones.sort((one, two) => (one.name < two.name ? -1 : 1));
  for (let i = 0; i < milestones.length; i++) {
    options.push(<option key={i} value={milestones[i].name}>{milestones[i].name}</option>);
  }
  return <select className="input" value={selectedMilestone?.name} onChange={e => {
    setSelectedMilestone(milestones.find(milestone => milestone.name === e.target.value));
  }}>
    {options}
  </select>;
}
