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

export interface IFraudMessage {
  id: number,
  text: string,
  campusId: string,
  expectedName: string,
  actualName: string,
  placeholder: string,
  filePathFromSrc: string,
  detectionDate: Date
}

export type IFraudMatches = Map<string, Map<string, number>>

export interface IRepositoryData {
  downloadedRepositories?: number,
  sizeInByte?: number
}

export interface JPlagConfig {
  minToken: string, threshold: string, useBaseCode: boolean;
}