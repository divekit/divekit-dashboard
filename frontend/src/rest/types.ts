export interface Commit {
  id: string,
  date: Date
}

export interface IMilestoneTest {
  id: number,
  name: string,
  groupName: string,
  passed: boolean
}

export interface IStudent {
  id: number,
  name: string,
  codeRepoUrl: string,
  testRepoUrl: string,
  testOverviewUrl: string,
  milestoneTests: IMilestoneTest[],
  commits: String[]
}

export interface IMilestone {
  name: string,
  students: IStudent[]
}
