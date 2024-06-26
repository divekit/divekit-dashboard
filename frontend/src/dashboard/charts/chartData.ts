import { ICommit, IStudent } from "../../rest/types";

type commitDataPoint = {
  id: string;
  value: number;
};

type calendarDataPoint = {
  value: number;
  day: string;
};

type dataPoint = {
  x: number;
  y: number;
};

function getCommitRange(ranges: string[], commitCount: number){
  if(commitCount === 0){
    return "0"
  }
  const lastLimit = Number(ranges[ranges.length-1].split('-')[1])
  if(lastLimit < commitCount && lastLimit !== -1){
    return lastLimit+1 + "+"
  }

  for (let i = 0; i < ranges.length; i++) {
    const upperLimit = Number(ranges[i].split('-')[1])
    if(commitCount <= upperLimit){
      return ranges[i]
    }
  }

  throw RangeError(`Commit count ${commitCount} does not fit the following ranges: ${ranges}`)
}

export function getCommitFrequency(students: IStudent[], usePercentages: boolean = false){
  const ranges = ["1-5", "6-10", "11-20", "21-40", "41-60"]
  const commitOccurences = students.reduce(
    (acc: commitDataPoint[], student: IStudent) => {
      const commitCount = student.commits.length
      const commitRange = getCommitRange(ranges, commitCount)
      
      const existingEntry = acc.find(entry => entry.id === commitRange);
      if (existingEntry) {
        existingEntry.value++;
      } else {
        acc.push({ id: commitRange, value: 1 });
      }
      return acc.sort((a, b) => {
        const first = ranges.indexOf(a.id)
        const second = ranges.indexOf(b.id)
        if(a.id === "0" || second === -1){
          return -1
        } else if (b.id === "0" || first === -1){
          return 1
        }
        return first - second
      });
    },
    []
  );

  if(usePercentages){
    commitOccurences.forEach((commit) => commit.value /= students.length)
  } else {
    commitOccurences.forEach((commit) => commit.value)
  }

  return commitOccurences;
}

export function calculateStudentProgress(student: IStudent) : number{
  const tests = student.milestoneTests
  let passedTests = tests.filter(test => test.passed).length

  return +((passedTests / tests.length) * 100).toFixed(2) // floating point calc might create issues, OK for test display
}

export function getStudentProgress(students: IStudent[]){
  const studentProgress = students.reduce(
    (acc: dataPoint[], student: IStudent) => {
      const studentProgress = calculateStudentProgress(student)
      const existingEntry = acc.find(entry => entry.x === studentProgress);
      if (existingEntry) {
        existingEntry.y++;
      } else {
        acc.push({ x: studentProgress, y: 1 });
      }
      return acc;
    },
    []
  );
  
  studentProgress.sort((a, b) => a.x - b.x);
  studentProgress.forEach((commit) => commit.y)

  return [{ "id": "progress", "data": studentProgress }];
}

export function getProgressDistribution(students: IStudent[]) {
  const progressDistribution = { notStarted: 0, started: 0, sixtyPercent: 0, ninetyPercent: 0, finished: 0 }

  students.forEach((student) => {
    if (student.commits.length === 0) {
      progressDistribution.notStarted++
    } else {
      const progress = calculateStudentProgress(student)
      if (progress === 100) {
        progressDistribution.finished++
      } else if(progress >= 90){
        progressDistribution.ninetyPercent++
      } else if(progress >= 60){
        progressDistribution.sixtyPercent++
      } else {
        progressDistribution.started++
      }
    }
  })

  Object.keys(progressDistribution).forEach((key: string) => 
    (progressDistribution[key as keyof typeof progressDistribution] = 
      +(progressDistribution[key as keyof typeof progressDistribution] * 100 / students.length).toFixed(1))
  )

  return [progressDistribution]
}

export function getTestDistribution(students: IStudent[], test: number) {
  const testDistribution = { finished: 0, unfinished: 0 }

  students.forEach((student) => {
    const hasPassedTest = student.milestoneTests[test].passed
    if (hasPassedTest) {
      testDistribution.finished++
    } else {
      testDistribution.unfinished++
    }
  })


  Object.keys(testDistribution).forEach((key: string) => 
    testDistribution[key as keyof typeof testDistribution] = 
    +(testDistribution[key as keyof typeof testDistribution] * 100 / students.length).toFixed(0)
  )

  return [testDistribution]
}

export function getStudentsByCommitCount(students: IStudent[], commitRange: String): IStudent[]{
  if(commitRange === "0"){
    return students.filter(student => student.commits.length === 0)
  }
  if (commitRange.includes("+")){
    const limit = +commitRange.replace("+", "").trim()
    return students.filter(student => student.commits.length > limit)
  }
  const range = commitRange.split('-')
  const lowerLimit = +range[0]
  const upperLimit = +range[1]
  return students.filter(student => student.commits.length >= lowerLimit && student.commits.length <= upperLimit)
}

export function getStudentsByTestProgress(students: IStudent[], progress: String){
  return students.filter(student => {
    if(progress === "notStarted"){
      return student.commits.length === 0
    } else if(progress === "finished"){
      return calculateStudentProgress(student) === 100
    } else {
      return student.commits.length > 0 && calculateStudentProgress(student) < 100
    }
  })
}

export function getStudentsByTestFinished(students: IStudent[], testNumber: number, finished: boolean) {
  return students.filter(student => {
    const test = student.milestoneTests.find((test) => test.id === testNumber)
    return test && test.passed === finished
  })
}

export function getCommitsByDate(student: IStudent){
  return student.commits.reduce(
    (acc: calendarDataPoint[], commit: ICommit) => {
      // gets the date without the time part. example: 2023-10-20T01:26:09.000+00:00 -> 2023-10-20
      let date = commit.date.toLocaleString().split('T')[0] 
      
      const existingEntry = acc.find(entry => entry.day === date);
      if (existingEntry) {
        existingEntry.value++;
      } else {
        acc.push({ day: date, value: 1 });
      }
      return acc.sort((a, b) => {
        return new Date(a.day).getTime() - new Date(b.day).getTime();
      });
    },
    []
  );
}

export function formatCommitData(commits: ICommit[]){
  const commitData : {x: string, y: number}[] = [] 
  commits.forEach(commit => {
    const date = new Date(commit.date)
    commitData.push({x: date + "", y: 1})
  })

  console.log([{ id: "progress", color:  "hsl(198, 87%, 66%)", data: commitData }])

  return [{ id: "progress", color:  "hsl(198, 87%, 66%)", data: commitData }];
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}