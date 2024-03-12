import { ReactNode } from "react";
import { IMilestoneTest, IStudent } from "../rest/types";
import { useMilestoneContext } from "./MilestoneContext";

const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
  arr.reduce((groups, item) => {
    (groups[key(item)] ||= []).push(item);
    return groups;
  }, {} as Record<K, T[]>);

function getGroupTestOverview(student: IStudent, tests: IMilestoneTest[]): ReactNode[]{
  const testRows: ReactNode[] = []
  tests.forEach(test => testRows.push(
    <nav><a className="test" href={student.testOverviewUrl + "/#report-" + (test.id)}>
      <div className="test-icon" style={{backgroundColor: test.passed ? "#2ec27e" : "#e01b24"}}/>
      {test.name}
    </a></nav>))
  return testRows
}

function allTestsPassed(tests: IMilestoneTest[]){
  return tests.filter(test => !test.passed).length === 0 
}

export default function StudentDetail({id} : {id: number}) {
  const student = useMilestoneContext().students.find(student => student.id === id);
  if(!student){
    return <>Cannot find student with id: {id}</>
  }

  const tests = student?.milestoneTests
  const testGroups = groupBy(tests, test => test.groupName)
  const testOverview: ReactNode[] = []
  Object.keys(testGroups).forEach(key => testOverview.push(
    <div>
      <h2 className="test-group" style={{color: allTestsPassed(testGroups[key]) ? "#26A269" : "#C01C28"}}>
        {key}
      </h2>
      {getGroupTestOverview(student, testGroups[key])}
    </div>
  ))

  return <div className="chart" style={{textAlign: 'left'}}>
    <p>Name: {student.name}</p>
    <a href={student.codeRepoUrl}>Code Repository</a>&nbsp;
    <a href={student.testRepoUrl}>Test Repository</a>&nbsp;
    <a href={student.testOverviewUrl}>Test Result Page</a>
    <p>Commit Count: {student.commits.length}</p>

    {testOverview}
  </div>
  //"#4D946E" : "#B05070" alternate colours
}
