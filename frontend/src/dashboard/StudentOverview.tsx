import { useContext, useState } from "react";
import { calculateStudentProgress } from "./studentData";
import { MilestoneContext, useMilestoneContext } from "./MilestoneContext";
import StudentDetail from "./StudentDetail";
import { IMilestone } from "../rest/types";

export const colorScheme = ["#5fecff", "#58d6fd", "#51c1fb", "#4aacf8", "#4398f6", "#3c83f4", "#356ef2", "#356ef2", "#356ef2", "#356ef2", "#356ef2", "#356ef2"]

export default function StudentOverview() {
  const students = useMilestoneContext().students
  const [showDetail, setShowDetail] = useState("")

  const studentRows = [];
  for (let i = 0; i < students.length; i++) {
    const progress = calculateStudentProgress(students[i]);
    const studentRow = <>
      <tr style={{ backgroundColor: progress === 100 ? "#fff" : "#ACF5FF" }} onClick={() => {
        if (showDetail === students[i].name) {
          setShowDetail("")
        } else {
          setShowDetail(students[i].name)
        }
      }}>
        <td className="student-row">{students[i].name}</td>
        <td>{students[i].commits.length}</td>
        <td>{progress}%</td>
      </tr>
      { showDetail === students[i].name &&
       <tr><td colSpan={2}><StudentDetail id={students.find(student => student.name === showDetail)!.id}/></td></tr> }
    </>
    studentRows.push(studentRow);
  }

  return <div className="chart student-table">
    <table style={{ textAlign: "center", borderCollapse: "collapse" }} className="table sortable">
      <tr className="table-header">
        <th className="table-header">GMID</th>
        <th className="table-header">Commit Count</th>
        <th className="table-header">Milestone Progress</th>
      </tr>
      {studentRows}
    </table>
  </div>;
}
