import { ResponsiveLine } from "@nivo/line";
import { ICommit, IStudent } from "../../rest/types";
import { StudentCalendar } from "../charts/students/StudentCalendar";
import { formatCommitData } from "../charts/chartData";
import { AllStudentTests } from "./charts/StudentTestBarChart";
import { ReactNode } from "react";

export default function StudentDetail({student} : {student: IStudent}){
  return (
  <div className="student-detail">
    <center style={{flex: "70%"}}>
      <div>
        <StudentInfo student={student}/>
        {student.commits.length > 0 && <>
          <CommitCalendar student={student}/>
          <Timeline student={student}/>
        </>}
      </div>
    </center>
    <div>
      {/* test overview */}
      <h2>Test Overview</h2>
      <AllStudentTests student={student}/>
    </div>
  </div>
)}

function StudentInfo({student} : {student: IStudent}){
  return <div>
    <h2> {student.name}</h2>
    <button><a href={student.codeRepoUrl} target="_blank" rel="noopener noreferrer">Code Repository</a></button>&nbsp;
    <button><a href={student.testRepoUrl} target="_blank" rel="noopener noreferrer">Test Repository</a></button>&nbsp;
    <button><a href={student.testOverviewUrl} target="_blank" rel="noopener noreferrer">Test Result Page</a></button>
    <p>Commit Count: {student.commits.length}</p>
  </div>
}

export function CommitCalendar({student} : {student: IStudent}){ 
  return <div className="chart" style={{height: 240, width: 600}}>
    <h3 className="chart-header">Commit Calendar</h3>
    <StudentCalendar student={student}/>
  </div>
}

function Timeline({student} : {student: IStudent}){ 
  return <div className="chart" style={{width: 600}}>
    <h3 className="chart-header">Commit Timeline</h3>
    <CommitTimeline student={student}/>
  </div>
}

function CommitTimeline({student} : {student: IStudent}){
  const items: ReactNode[] = []
  // TODO: needs to be sorted by date still
  student.commits.toReversed().forEach((commit: ICommit) => items.push(
    <li>
      <div className="timestamp">
        <span style={{fontSize: "14px"}}>{new Date(commit.date).toLocaleDateString()}</span><br/>
        <span style={{color: "#7F7F7F"}}>{new Date(commit.date).toLocaleTimeString()}</span>
      </div>
      <div className="item-content">
        {commit.message}
      </div>
    </li>
  ))
  return <div className="timeline">
  <div className="timeline-container">
    <ul className="timeline-list">
      {items}
    </ul>
  </div>
</div>
}