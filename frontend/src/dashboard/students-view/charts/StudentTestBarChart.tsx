import { ResponsiveBar } from "@nivo/bar";
import { IStudent } from "../../../rest/types";

export default function StudentTestBarChart({student, testNumber} : {student: IStudent, testNumber: number}){
  if(!student || student.milestoneTests.length === 0 || !student.milestoneTests[testNumber]) {
    return <></>
  }
  return <div>
    <h3 className="chart-header">{student.milestoneTests[testNumber].name}</h3>
    <div style={{height: 45, width: 400}}>
      <ResponsiveBar
        data={ [{notStarted: student.milestoneTests[testNumber].passed ? 0 : 100, finished: student.milestoneTests[testNumber].passed ? 100 : 0}]}
        valueFormat={(value) => (value) + "%"}
        keys={[
          'unfinished',
          'finished'
        ]}
        label={(data) => data.value + "%"}
        tooltipLabel={(data) => data.id + ""}
        margin={{ top: -20, right: 20, left: 10 }}
        labelSkipWidth={20}
        padding={0.2}
        layout="horizontal"
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={ ["#5297e6", "#5fecff"] }    
        borderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    1.6
                ]
            ]
        }}
        axisBottom={null}
        axisLeft={null}
      />
    </div>
  </div>
}

export function AllStudentTests({student} : {student: IStudent}){
  const testCharts = []
  var currentGroup = ""
  var key = 0

  for (let i = 0; i < student.milestoneTests.length; i++) {  
    const testGroup = student.milestoneTests[i].groupName
    if(testGroup !== currentGroup){
      testCharts.push(<hr key={++key}/>)
      testCharts.push(<p style={{color: "#424242"}}  key={++key}>{testGroup}</p>)
      currentGroup = testGroup
    }
    testCharts.push(<StudentTestBarChart student={student} testNumber={i}  key={++key}/>)
  }
  return <div className="test-overview" style={{ minHeight: "40vw"}}>
    {testCharts}
  </div>
}