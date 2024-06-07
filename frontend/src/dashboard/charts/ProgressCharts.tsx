import { getProgressDistribution, getStudentProgress, getStudentsByTestProgress } from "./chartData";
import { useMilestoneContext, useStudentFilterContext } from "../DashboardContext";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ColorScheme } from "../../theme/schemes";
import { Color } from "../../theme/colors";

export function ProgressLineChart(){
  const students = useMilestoneContext().get?.students
  if(!students) {
    return <></>
  }

  return <ResponsiveLine
    data={getStudentProgress(students)}
    margin={{ top: 50, right: 10, bottom: 50, left: 60 }}
    xFormat={(value) => value + "%"}
    yFormat={(value) => value + " student(s)"}
    xScale={{ type: 'linear' }}
    yScale={{
        type: 'linear',
        min: 0,
        max: 'auto',
        stacked: true,
        reverse: false
    }}
    colors={ ColorScheme.progressLine }
    curve="monotoneX"
    enableArea
    axisTop={null}
    axisRight={null}
    axisBottom={{
        legend: 'Progress',
        legendOffset: 36,
        legendPosition: 'middle',
        format: (data) => data + "%"
    }}
    axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Students',
        legendOffset: -40,
        legendPosition: 'middle'
    }}
    pointSize={10}
    pointColor={{ theme: 'background' }}
    pointBorderWidth={2}
    pointBorderColor={{ from: 'serieColor' }}
    pointLabelYOffset={-12}
    useMesh={true}
  />
}

export function ProgressBarChart() {
  const students = useMilestoneContext().get?.students
  const setFilteredStudents = useStudentFilterContext().setFilteredStudents
  if(!students) {
    return <></>
  }
  const progressDistribution = getProgressDistribution(students)
  const colorScheme = ColorScheme.progressBar

  return <div style={{height: 130, width: 400}}>
      <center><h4 style={{color: Color.notStarted}}>
        {progressDistribution[0].notStarted + "% of students did not start yet"}
      </h4></center>
        <ResponsiveBar
          data={getProgressDistribution(students)}
          onClick={(node) => {
            setFilteredStudents(getStudentsByTestProgress(students, node.id + ""))
          }}
          keys={[
            'notStarted',
            'started',
            'sixtyPercent',
            'ninetyPercent',
            'finished'
          ]}
          label={(data) => data.value + "%"}
          valueFormat={(value) => value + "%"}          
          tooltipLabel={(data) => {
            if(data.id === "notStarted"){
              return "not started"
            } if(data.id === "sixtyPercent"){
              return "60%"
            } if(data.id === "ninetyPercent"){
              return "90%"
            } else {
              return data.id + ""
            }
          }}
          margin={{ top: -20, right: 20, bottom: 50, left: 10 }}
          padding={0.2}
          layout="horizontal"
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={ colorScheme }    
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
          labelSkipWidth={20}
          labelSkipHeight={12}
          labelTextColor={{
              from: 'color',
              modifiers: [
                  [
                      'darker',
                      1.6
                  ]
              ]
          }}
          legendLabel={(data) => {
            if(data.id === "notStarted"){
              return "not started"
            } if(data.id === "sixtyPercent"){
              return "60% +"
            } if(data.id === "ninetyPercent"){
              return "90% +"
            } else {
              return data.id + ""
            }
          }}
          legends={[
            {
                dataFrom: 'keys',
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 0,
                itemWidth: 70,
                itemHeight: 0,
                itemDirection: 'top-to-bottom',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
    />
  </div>
}