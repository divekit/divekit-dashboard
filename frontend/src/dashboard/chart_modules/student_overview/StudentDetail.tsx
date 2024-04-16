import { ReactNode } from "react";
import { IMilestoneTest, IStudent } from "../../../rest/types";
import { useDashboardContext } from "../../DashboardContext";

export default function StudentDetail({id} : {id: number}) {
  const student = useDashboardContext().students.find(student => student.id === id);
  if(!student){
    return <>Cannot find student with id: {id}</>
  }

  const tests = student?.milestoneTests
  const testGroups = groupBy(tests, test => test.groupName)
  const testOverview: ReactNode[] = []
  Object.keys(testGroups).forEach(key => testOverview.push(
    <div key={key}>
      <h2 className="test-group" style={{color: allTestsPassed(testGroups[key]) ? "#26A269" : "#C01C28"}}>
        {key}
      </h2>
      {getGroupTestOverview(student, testGroups[key])}
    </div>
  ))

  return <div>
    <p>Name: {student.name}</p>
    <a href={student.codeRepoUrl} target="_blank" rel="noopener noreferrer">Code Repository</a>&nbsp;
    <a href={student.testRepoUrl} target="_blank" rel="noopener noreferrer">Test Repository</a>&nbsp;
    <a href={student.testOverviewUrl} target="_blank" rel="noopener noreferrer">Test Result Page</a>
    <p>Commit Count: {student.commits.length}</p>

    {testOverview}
  </div>
}

function getGroupTestOverview(student: IStudent, tests: IMilestoneTest[]): ReactNode[]{
  const testRows: ReactNode[] = []
  tests.forEach((test, index) => testRows.push(
    <nav key={index}><a className="test" href={student.testOverviewUrl + "/#report-" + (test.id)} target="_blank" rel="noopener noreferrer">
      <div className="test-icon" style={{backgroundColor: test.passed ? "#2ec27e" : "#e01b24"}}/>
      {test.name}
    </a></nav>))
  return testRows
}

function allTestsPassed(tests: IMilestoneTest[]){
  return tests.filter(test => !test.passed).length === 0 
}

const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
  arr.reduce((groups, item) => {
    (groups[key(item)] ||= []).push(item);
    return groups;
  }, {} as Record<K, T[]>);