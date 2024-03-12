import { useContext } from "react";
import { MilestoneContext, useMilestoneContext } from "../MilestoneContext";
import { getProgressDistribution, getTestDistribution } from "../studentData";
import { Bar, ResponsiveBar } from "@nivo/bar";

export function TestBarChartOverview(){
  const students = useMilestoneContext().students
  const testCharts = []
  var currentGroup = ""

  for (let i = 0; i < students[0].milestoneTests.length; i++) {  
    const testGroup = students[0].milestoneTests[i].groupName
    if(testGroup !== currentGroup){
      testCharts.push(<hr/>)
      testCharts.push(<p style={{color: "#424242"}}>{testGroup}</p>)
      currentGroup = testGroup
    }
    testCharts.push(<TestBarChart testNumber={i}/>)
  }
  return <div className="test-overview">
    {testCharts}
  </div>
}

export function TestBarChart({testNumber} : {testNumber: number}) { 
  const students = useMilestoneContext().students
  return <div>
    <h3 className="chart-header">{students[0].milestoneTests[testNumber].name}</h3>
    <div style={{height: 45, width: 400}}>
      <ResponsiveBar
        data={getTestDistribution(students, testNumber)}
        keys={[
          'unfinished',
          'finished'
        ]}
        label={(data) => data.value + "%"}
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