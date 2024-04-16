import { useState } from "react";
import { calculateStudentProgress } from "../../chartData";
import { useDashboardContext } from "../../DashboardContext";
import StudentDetail from "./StudentDetail";

export const colorScheme = ["#5fecff", "#58d6fd", "#51c1fb", "#4aacf8", "#4398f6", "#3c83f4", "#356ef2", "#356ef2", "#356ef2", "#356ef2", "#356ef2", "#356ef2"]

export default function StudentOverview() {
  const students = useDashboardContext().students
  const [showDetail, setShowDetail] = useState("")

  const studentRows = [];
  for (let i = 0; i < students.length; i++) {
    const progress = calculateStudentProgress(students[i]);
    const color = progress === 100 ? "#fff" : "#ACF5FF";
    const isSelected = students[i].name === showDetail;

    const studentRow = <tbody key={i}>
      <tr style={{ backgroundColor: color }} className={"student-row" + (isSelected ? " selected-row" : "")} onClick={() => {
        if (showDetail === students[i].name) {
          setShowDetail("")
        } else {
          setShowDetail(students[i].name)
        }
      }}>
        <td>{students[i].name}</td>
        <td>{students[i].commits.length}</td>
        <td>{progress}%</td>
      </tr>
      { showDetail === students[i].name && <tr>
        <td colSpan={3} className="student-detail"><StudentDetail id={students.find(student => student.name === showDetail)!.id}/></td>
      </tr> }
    </tbody>
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
