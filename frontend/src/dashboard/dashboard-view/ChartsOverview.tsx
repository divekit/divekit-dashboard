import { useMilestoneContext, useStudentFilterContext } from "../DashboardContext"
import { CommitPieChart, CommitBarChart } from "../charts/CommitCharts"
import { ProgressBarChart, ProgressLineChart } from "../charts/ProgressCharts"
import { TestBarChartOverview } from "../charts/TestCharts"
import { StudentTableDetail } from "../charts/students/StudentTable"
import html2canvas from "html2canvas"
import { toast } from "react-toastify"
import { IStudent } from "../../rest/types"
import { FraudMessageChart } from "../charts/FraudCharts"

export function ChartsOverview() {
  const students = useMilestoneContext().get?.students

  return <div className="charts-overview">
    <div style={{ display: "flex" }}>
      <div className="chart-container">
        <div className="chart" style={{height: 240, width: 400}}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <h3 className="chart-header">Test Progress</h3>
            <ClipboardButton/>
          </div>
          <div id="progress-bar-chart" style={{height: 170, width: 400}}>
            <ProgressBarChart/>
          </div>
        </div>
        <div className="chart" style={{height: 350, width: 400}}>
          <h3 className="chart-header">Commit Count</h3>
          <CommitPieChart/>
        </div>
      </div>
      <div className="chart" style={{height: 500, width: 950, paddingBottom: 170}}>
        <h3 className="chart-header" style={{paddingBottom: 20}}>Student Progress</h3>
        <ProgressLineChart/>
      </div>
      <div className="chart">
        <h3 className="chart-header">Tests</h3>
        <TestBarChartOverview/>
      </div>
    </div>
    <div style={{ display: "flex" }}>
      <div className="chart" style={{height: 400, minWidth: 500, paddingBottom: 70}}>
        <h3 className="chart-header">Commit Distribution</h3>
        <CommitBarChart/>
      </div>
      {students && 
      <div className="chart" style={{height: 440, overflowY: "clip"}}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <h3 className="chart-header">Student Overview</h3>
            <ViewAllStudentsButton students={students}/>
          </div>
          <StudentTableDetail students={students}/>
      </div>}
    </div>
    <div className="chart">
      <h3 className="chart-header">Fraud Warnings</h3>
      <FraudMessageChart/>
    </div>
  </div>
}

function ViewAllStudentsButton({students} : {students : IStudent[]}){
  const setFilteredStudents = useStudentFilterContext().setFilteredStudents
  return <button onClick={() => setFilteredStudents((students))} style={{height: "35px", width: "35px", marginLeft: 15, padding: 2, fontSize: "14pt"}}>↪</button>  
}

function ClipboardButton(){
  return <button onClick={() => copyToClipboard('progress-bar-chart')} style={{height: "35px", width: "35px", marginLeft: "auto"}}>⎘</button>  
}

function copyToClipboard(id: string){
  var element = document.getElementById(id);
  if(!element) { return }

  html2canvas(element).then((canvas) => {
    canvas.toBlob(blob => {
      if(!blob) { return }
      navigator.clipboard.write([
        new ClipboardItem(
          Object.defineProperty({}, blob.type, {
            value: blob,
            enumerable: true
          })
        )
      ])
      .then(function() {
        toast("Copied to clipboard!", { autoClose: 1200 })
      }).catch(_ => {
        toast.error("Could not copy to clipboard due to unfocused window. Please try again.", { autoClose: 2500 });
      });
    })
  })
}