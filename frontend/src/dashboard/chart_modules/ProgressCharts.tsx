import { getProgressDistribution, getStudentProgress } from "../chartData";
import { useDashboardContext } from "../DashboardContext";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";

const colorScheme = ["#5fecff", "#5fe2fc", "#5ed9fa", "#5ecff7", "#5dc6f4", "#5bbcf1", "#59b3ef", "#57aaec", "#55a0e9", "#5297e6", "#4f8ee3", "#4b85e0", "#477cdd", "#4373da", "#3e6ad7", "#3861d4", "#3158d1", "#294fce", "#1f46cb", "#0f3dc8"]
/*TODO: define color scheme only once somewhere else*/

export function ProgressLineChart(){
  const students = useDashboardContext().students
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
    colors={ colorScheme }
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
  const students = useDashboardContext().students
  const progressDistribution = getProgressDistribution(students)
  return <div style={{height: 130, width: 400}}>
      <center><h4 style={{color: "#5297e6"}}>
        {progressDistribution[0].notStarted + "% of students did not start yet"}
      </h4></center>
        <ResponsiveBar
          data={getProgressDistribution(students)}
          keys={[
            'notStarted',
            'started',
            'finished'
          ]}
          label={(data) => data.value + "%"}
          valueFormat={(value) => value + "%"}
          // tooltip={ point => <div style={{fontSize: '12px'}}>{point.value}</div>}
          tooltipLabel={(data) => {
            if(data.id === "notStarted"){
              return "not started"
            } else {
              return data.id + ""
            }
          }}
          margin={{ top: -20, right: 20, bottom: 50, left: 10 }}
          padding={0.2}
          layout="horizontal"
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={ ["#5297e6", "#5dc6f4", "#5fecff"] }    
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
                itemsSpacing: 2,
                itemWidth: 100,
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