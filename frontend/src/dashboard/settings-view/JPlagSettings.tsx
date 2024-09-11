import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { deleteRepositoriesFolder, downloadJPlagReport, fetchRepositoryData, downloadRepositoryArchives as triggerRepositoryDownload } from "../../rest/service";
import { IMilestone, IRepositoryData, JPlagConfig } from "../../rest/types";
import { useMilestonesContext } from "../DashboardContext";
import { MilestoneDropdown } from "../NavBar";
import { toast } from "react-toastify";

export function JPlagSettings(){
    const milestones = useMilestonesContext().get
    const [selectedMilestone, setSelectedMilestone] = useState<IMilestone>()
    const [disableDownload, setDisableDownload] = useState(true);
    const [disableButtons, setDisableButtons] = useState(false);
    const [repositoryData, setRepositoryData] = useState<IRepositoryData>()
    const [jplagConfig, setJPlagConfig] = useState({minToken: "15", threshold: "0.3", useBaseCode: false, doRedirect: true});

    useEffect(() => {
        if(milestones && !selectedMilestone){
            setSelectedMilestone(milestones[0])       
            setDisableDownload(false)     
        }
    }, [milestones])

    useEffect(() => {
        if(selectedMilestone){
            fetchRepositoryData(selectedMilestone.name)
                .then(data => data.json())
                .then(data => setRepositoryData(data))         
        }
    }, [selectedMilestone, disableDownload])

    useEffect(() => {
        if(!repositoryData || !repositoryData.sizeInByte){
            setDisableButtons(true)
        } else {
            setDisableButtons(false)
        }
    }, [repositoryData])

    if(!milestones) {
        return <h1>Cannot load milestones</h1>
    }

    let dataOverview = <p>No downloaded repositories can be found.</p>
    if(repositoryData && repositoryData.sizeInByte){
        dataOverview =  <>
            <p>Downloaded Repositories: {repositoryData.downloadedRepositories}</p>
            <p>Size: {Math.round((repositoryData.sizeInByte! / 1024 / 1024+ Number.EPSILON) * 100) / 100 + " MB"}</p>
        </>
    }

    return <div>
        <h2>Repositories</h2>
        Milestone:<MilestoneDropdown setSelectedMilestone={setSelectedMilestone} selectedMilestone={selectedMilestone} milestones={milestones} />
        {dataOverview}
        <button className="text-button" onClick={() => downloadRepositories(selectedMilestone!.name, setDisableDownload)} disabled={disableDownload}>Download Repositories</button>
        <button className="text-button" onClick={() => deleteRepositories(selectedMilestone!.name, setDisableButtons, setRepositoryData)} disabled={disableButtons}>Delete Repositories</button>
        <br></br>
        <h3>JPlag Settings</h3>
        <div className="jplag-config">
            Minimum Token Match:
            <div>
                <input type="range" min="9" max="15" value={jplagConfig.minToken} onChange={e => setJPlagConfig({...jplagConfig, minToken: e.target.value})}></input>
                <span className="jplag-slider-label">{jplagConfig.minToken}</span>
            </div>
        </div>
        <div className="jplag-config">
            Similarity Threshold:
            <div>
                <input type="range" min="0.0" max="1.0" step="0.1" value={jplagConfig.threshold} onChange={e => setJPlagConfig({...jplagConfig, threshold: e.target.value})}></input>
                <span className="jplag-slider-label">{jplagConfig.threshold}</span>
            </div>
        </div>
        <div className="jplag-config">
            <label>Use base repository:</label>
            <input type="checkbox" 
            checked={jplagConfig.useBaseCode}
            onChange={() => setJPlagConfig({...jplagConfig, useBaseCode: !jplagConfig.useBaseCode})}
            className="jplag-checkbox"></input>
        </div>
        <div className="jplag-config">
            <label>Download in Report Viewer:</label>
            <input type="checkbox" 
            checked={jplagConfig.doRedirect}
            onChange={() => setJPlagConfig({...jplagConfig, doRedirect: !jplagConfig.doRedirect})}
            className="jplag-checkbox"></input>
        </div>
        {!jplagConfig.doRedirect && selectedMilestone && 
            <button className="text-button" onClick={() => runJPlag(selectedMilestone.name, jplagConfig, setDisableButtons, setDisableDownload)} disabled={disableButtons}>Download JPlag Report</button>        
        }
        {jplagConfig.doRedirect && selectedMilestone && 
            <a href={`report-viewer/index.html?milestoneId=${selectedMilestone.name}&minToken=${jplagConfig.minToken}&threshold=${jplagConfig.threshold}&useBaseCode=${jplagConfig.useBaseCode}`} 
            target="_blank" rel="noopener noreferrer">
            <button className="text-button" disabled={disableButtons}>Download JPlag Report</button>
            </a>
        }
        <a href={`report-viewer/index.html`} 
            target="_blank" rel="noopener noreferrer">
            <button className="text-button" disabled={disableButtons} style={{ float: 'right', backgroundColor: "#B4B4B6"}}>Open JPlag Report Viewer</button>
        </a> 
        
    </div>
}

function downloadRepositories(milestoneId: string, setDisableButtons: Dispatch<SetStateAction<boolean>>){
    toast("Downloading repositories...", { autoClose: 4000 })
    setDisableButtons(true)
    triggerRepositoryDownload(milestoneId)
    .then(response => response.json())
    .then(() => toast("Successfully downloaded all milestone repositories.", { autoClose: 1500 }))
    .catch(() => toast.error("Failed downloading repositories. Please try again."))
    .finally(() => setDisableButtons(false))
}

function deleteRepositories(milestoneId: string, setDisableButtons: Dispatch<SetStateAction<boolean>>, setRepositoryData:  Dispatch<SetStateAction<IRepositoryData | undefined>>){
    toast("Deleting repositories...", { autoClose: 1500 })
    setDisableButtons(true)
    deleteRepositoriesFolder(milestoneId)
    .catch(() => toast.error("Failed deleting repositories. Please try again."))
    .finally(() => {
        setTimeout(() => {
            setDisableButtons(false)
            fetchRepositoryData(milestoneId)
            .then(data => data.json())
            .then(data => {
                setRepositoryData(data)
            })    
        }, 1000)
    })
}

function runJPlag(milestoneId: string,  jplagConfig: JPlagConfig, setDisableButtons: Dispatch<SetStateAction<boolean>>, setDisableDownload: Dispatch<SetStateAction<boolean>>){
    toast("Running JPlag...", { autoClose: 5000 })    
    setDisableButtons(true)
    setDisableDownload(true)
    downloadJPlagReport(milestoneId, jplagConfig).then(data => data.blob()).then(data => {
        var downloadURL = window.URL.createObjectURL(data);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = `${milestoneId.replace(".md", "")}.zip`;
        link.click();
    }).finally(() => {
        setDisableButtons(false)
        setDisableDownload(false)
    })
}