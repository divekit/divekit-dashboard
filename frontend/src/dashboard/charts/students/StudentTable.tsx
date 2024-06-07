import { Dispatch, SetStateAction, useState } from "react";
import { calculateStudentProgress } from "../chartData";
import { useMilestoneContext } from "../../DashboardContext";
import StudentInfo from "./StudentInfo";
import { IStudent } from "../../../rest/types";
import { Color } from "../../../theme/colors";
import StudentDetail from "../../students-view/StudentDetail";

export const colorScheme = ["#5fecff", "#58d6fd", "#51c1fb", "#4aacf8", "#4398f6", "#3c83f4", "#356ef2", "#356ef2", "#356ef2", "#356ef2", "#356ef2", "#356ef2"]

// refactor to not have the (almost) same table twice..
export function StudentTableDetail({students} : {students: IStudent[]}) {
  const [showDetail, setShowDetail] = useState("")

  const studentRows = [];
  for (let i = 0; i < students.length; i++) {
    const tests = students[i].milestoneTests
    const passedTests = tests.filter(test => test.passed).length
    const progress = +((passedTests / tests.length) * 100).toFixed(2)
    const color = progress === 100 ? "#fff" : Color.unfinishedTests;
    const isSelected = students[i].name === showDetail;

    const studentRow = <tbody key={i}>
      <tr style={{ backgroundColor: color, textAlign: "center" }} className={"student-row" + (isSelected ? " selected-row" : "")} onClick={() => {
        if (showDetail === students![i].name) {
          setShowDetail("")
        } else {
          setShowDetail(students![i].name)
        }
      }}>
        <td>{students[i].name}</td>
        <td>{students[i].commits.length}</td>
        <td>{students[i].commits.length > 0 ? formatDate(students[i].commits[0].date)  : ""}</td>
        <td>{passedTests}/{tests.length}</td>
        <td>{progress}%</td>
      </tr>
      { showDetail === students[i].name && <tr>
        <td colSpan={5}><StudentDetail student={students.find(student => student.name === showDetail)!}/></td>
      </tr> }
    </tbody>
    studentRows.push(studentRow);
  }

  return <div className="chart student-table">
    <table style={{ textAlign: "center", borderCollapse: "collapse" }} className="table sortable">
      <tr className="table-header">
        <th className="table-header">Campus ID</th>
        <th className="table-header">Commit Count</th>
        <th className="table-header">First Commit</th>
        <th className="table-header">Passed Tests</th>
        <th className="table-header">Milestone Progress</th>
      </tr>
      {studentRows}
    </table>
  </div>;
}

export function StudentTable({students, setSelectedStudent} : {students: IStudent[], setSelectedStudent: Dispatch<SetStateAction<IStudent | undefined>>}) {
  const studentRows = [];
  for (let i = 0; i < students.length; i++) {
    const tests = students[i].milestoneTests
    const passedTests = tests.filter(test => test.passed).length
    const progress = +((passedTests / tests.length) * 100).toFixed(2)

    const color = progress === 100 ? "#fff" : Color.unfinishedTests;

    const studentRow = <tbody key={i}>
      <tr style={{ backgroundColor: color }} className={"student-row"} onClick={() => setSelectedStudent(students[i])}>
        <td>{students[i].name}</td>
        <td>{students[i].commits.length}</td>
        <td>{students[i].commits.length > 0 ? formatDate(students[i].commits[0].date)  : ""}</td>
        <td>{passedTests}/{tests.length}</td>
        <td>{progress}%</td>
      </tr>
    </tbody>
    studentRows.push(studentRow);
  }

  return <div className="chart student-table" style={{ minHeight: "44vw"}}>
    <table style={{ textAlign: "center", borderCollapse: "collapse" }} className="table sortable">
      <tr className="table-header">
        <th className="table-header">Campus ID</th>
        <th className="table-header">Commit Count</th>
        <th className="table-header">First Commit</th>
        <th className="table-header">Passed Tests</th>
        <th className="table-header">Milestone Progress</th>
      </tr>
      {studentRows}
    </table>
  </div>;
}

function formatDate(date: Date){
  return (new Date(date)).toLocaleString("de-DE", {day: "2-digit", month: "2-digit", year: "2-digit"})
}

