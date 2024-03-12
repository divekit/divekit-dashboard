import { Pie, ResponsivePie } from "@nivo/pie"
import { getCommitFrequency, getProgressDistribution, getStudentProgress, getStudentsByCommitCount } from "../studentData"
import { useContext } from "react";
import { MilestoneContext, useMilestoneContext } from "../MilestoneContext";
import { Bar, ResponsiveBar } from "@nivo/bar";
import { IMilestone } from "../../rest/types";

const colorScheme = ["#5fecff", "#58d6fd", "#51c1fb", "#4aacf8", "#4398f6", "#3c83f4", "#356ef2"]

export function CommitPieChart(){
  const students = useMilestoneContext().students
  return <ResponsivePie
      data={getCommitFrequency(students, true)}
      onClick={(node) => {
        console.log(getStudentsByCommitCount(students, node.id + ""))
      }}
      valueFormat={(value) => (value * 100).toFixed(1) + "%"}
      arcLabel={(data) => (data.id + "")}
      arcLabelsSkipAngle={15}
      arcLinkLabel={(data) => (data.value * 100).toFixed(1).replace(/[.,]0$/, "") + "%"}      
      colors={colorScheme}
      margin={{ top: 0, right: 80, bottom: 10, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
    />
}

export function CommitBarChart(){
  const students = useMilestoneContext().students
  return <ResponsiveBar
    data={getCommitFrequency(students)}
    onClick={(node) => {
        console.log(getStudentsByCommitCount(students, node.indexValue + ""))
      }}
    indexBy="id"
    margin={{ top: 50, right: 10, bottom: 50, left: 60 }}
    padding={0.3}
    valueScale={{ type: 'linear' }}
    colorBy="indexValue"
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
    axisBottom={{
        tickSize: 1,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Commit Count',
        legendPosition: 'middle',
        legendOffset: 32,
        truncateTickAt: 0
    }}
    axisLeft={{
        legend: 'Students',
        legendPosition: 'middle',
        legendOffset: -40,
        truncateTickAt: 0
    }}
    labelSkipWidth={12}
    labelSkipHeight={12}
    labelTextColor={{
        from: 'color',
        modifiers: [
            [
                'darker',
                1.6
            ]
        ]
    }}/>
}