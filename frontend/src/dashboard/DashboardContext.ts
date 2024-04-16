import { createContext, useContext } from 'react';
import { IMilestone } from '../rest/types';

export const DashboardContext = createContext<IMilestone | undefined>(undefined)

export function useDashboardContext() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error("Context is undefined. Check it is being used within its provider.")
  }

  return context
}