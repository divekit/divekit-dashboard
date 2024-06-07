import { ColorScheme } from "../../theme/schemes";
import { useMilestoneContext, useStudentFilterContext } from "../DashboardContext";
import { getStudentsByTestFinished, getTestDistribution } from "./chartData";
import { ResponsiveBar } from "@nivo/bar";

export function TestBarChartOverview(){
  const milestone = useMilestoneContext().get
  if(!milestone){
    return <></>
  }
  const students = milestone.students;
  const testCharts = []
  var currentGroup = ""
  var key = 0

  for (let i = 0; i < students[0].milestoneTests.length; i++) {  
    const testGroup = students[0].milestoneTests[i].groupName
    if(testGroup !== currentGroup){
      testCharts.push(<hr key={++key}/>)
      testCharts.push(<p style={{color: "#424242"}}  key={++key}>{testGroup}</p>)
      currentGroup = testGroup
    }
    testCharts.push(<TestBarChart testNumber={i}  key={++key}/>)
  }
  return <div className="test-overview">
    {testCharts}
  </div>
}

export function TestBarChart({testNumber} : {testNumber: number}) { 
  const setFilteredStudents = useStudentFilterContext().setFilteredStudents
  const students = useMilestoneContext().get?.students
  if(!students) {
    return <></>
  }
  return <div>
    <h3 className="chart-header">{students[0].milestoneTests[testNumber].name}</h3>
    <div style={{height: 45, width: 400}}>
      <ResponsiveBar
        data={getTestDistribution(students, testNumber)}
        onClick={(node) => {
          setFilteredStudents(getStudentsByTestFinished(students, testNumber + 1, node.id === "finished"))
        }}
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
        colors={ColorScheme.testBar}    
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