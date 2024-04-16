import { useContext } from "react";
import { DashboardContext, useDashboardContext } from "../DashboardContext";
import { getProgressDistribution, getTestDistribution } from "../chartData";
import { Bar, ResponsiveBar } from "@nivo/bar";

export function TestBarChartOverview(){
  const students = useDashboardContext().students
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
  const students = useDashboardContext().students
  return <div>
    <h3 className="chart-header">{students[0].milestoneTests[testNumber].name}</h3>
    <div style={{height: 45, width: 400}}>
      <ResponsiveBar
        data={getTestDistribution(students, testNumber)}
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