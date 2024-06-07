import { ResponsiveCalendar, ResponsiveTimeRange } from '@nivo/calendar'
import { IStudent } from '../../../rest/types'
import { getCommitsByDate } from '../chartData'

const colorScheme = ["#5fecff", "#58d6fd", "#51c1fb", "#4aacf8", "#4398f6", "#3c83f4", "#356ef2"]

export function StudentCalendar({student} : {student: IStudent}) {
  // TODO: getCommitsByDate function is not fully accurate yet?
  const commits = getCommitsByDate(student)
  if(commits.length === 0){
    return <></>
  }
  return <ResponsiveTimeRange
    data={commits}
    from={commits[0].day}
    to={commits[commits.length - 1].day}
    onClick={() => console.log(getCommitsByDate(student))}
    emptyColor="#eeeeee"
    colors={ colorScheme}
    margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
    dayBorderWidth={2}
    dayBorderColor="#ffffff"
  />
}