import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';
import { IMilestone, IStudent, IUser } from '../rest/types';

interface IIndexable<T = any> { [key: string]: T }

export interface IDashboardContext {
  milestone: IMilestoneContext | undefined,
  milestones: IMilestonesContext | undefined,
  studentFilter: IStudentFilterContext | undefined
}

interface IMilestoneContext {
  get: IMilestone | undefined,
  set: Dispatch<SetStateAction<IMilestone | undefined>>
}

interface IMilestonesContext {
  get: IMilestone[] | undefined,
  set: Dispatch<SetStateAction<IMilestone[]>>
}

interface IUserContext {
  get: IUser[] | undefined,
  set: Dispatch<SetStateAction<IUser[]>>
}


interface IStudentFilterContext {
  filteredStudents: IStudent[] | undefined,
  setFilteredStudents: Dispatch<SetStateAction<IStudent[] | undefined>>
}

export const DashboardContext = createContext<IDashboardContext | undefined>(undefined)

export function useInitialDashboardContext(): IDashboardContext{
  const [milestones, setMilestones] = useState<IMilestone[]>([])
  const [selectedMilestone, setSelectedMilestone] = useState<IMilestone>()
  const [filteredStudents, setFilteredStudents] = useState<IStudent[]>()

  return {
    milestone: {get: selectedMilestone, set: setSelectedMilestone},
    milestones: {get: milestones, set: setMilestones},
    studentFilter: {filteredStudents, setFilteredStudents}
  }
}

export function useDashboardContext(){
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error(`Dashboard Context is undefined. Check it is being used within its provider.`)
  }

  return context
}

function useSpecifiedContext(contextName: string){
  const context = useContext(DashboardContext)
  const specifiedContext = (context as IIndexable)[contextName]
  if (context === undefined || specifiedContext === undefined) {
    throw new Error(`${contextName} is undefined. Check it is being used within its provider.`)
  }

  return specifiedContext
}

export function useMilestoneContext(): IMilestoneContext {
  return useSpecifiedContext("milestone")
}

export function useMilestonesContext(): IMilestonesContext {
   return useSpecifiedContext("milestones")
}

export function useStudentFilterContext(): IStudentFilterContext {
  return useSpecifiedContext("studentFilter")
}