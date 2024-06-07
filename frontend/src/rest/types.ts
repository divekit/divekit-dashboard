export interface ICommit {
  id: string,
  date: Date,
  message: string
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
  commits: ICommit[]
}

export interface IMilestone {
  name: string,
  students: IStudent[]
}

export interface IUser {
  id?: number,
  email: string,
  password: string,
  name?: string
};
