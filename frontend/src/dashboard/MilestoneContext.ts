import { createContext, useContext } from 'react';
import { IMilestone } from '../rest/types';

export const MilestoneContext = createContext<IMilestone | undefined>(undefined)

export function useMilestoneContext() {
  const context = useContext(MilestoneContext)
  if (context === undefined) {
    throw new Error("Context is undefined. Check it is being used within its provider.")
  }

  return context
}