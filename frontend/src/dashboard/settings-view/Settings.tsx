import { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { fetchMilestones } from '../../rest/service';
import { toast } from 'react-toastify';
import { IMilestone } from '../../rest/types';
import { useDashboardContext } from '../DashboardContext';
import { MilestoneSettings } from './MilestoneSettings';

export function Settings(){
  const [updatedMilestones, setUpdatedMilestones] = useState<boolean>(false)

  const dashboardContext = useDashboardContext()

  useEffect(() => {
    if(updatedMilestones){
      fetchMilestones().then((response) => {
        if (!response || !response.ok) {
          toast.error("Could not fetch milestones.")
          return
        }
  
        response.json().then((milestones: IMilestone[]) => {
          if(milestones){
            dashboardContext.milestones?.set(milestones)
            if(dashboardContext.milestone?.get && !milestones.includes(dashboardContext.milestone?.get)){ // selected milestone got deleted
              if(milestones.length > 0){
                dashboardContext.milestone.set(milestones[0])
              } else {
                dashboardContext.milestone.set(undefined)
              }
            }
          }
        })
      })
      setUpdatedMilestones(false)
    }
  }, [updatedMilestones])

  return <Tabs>
    <TabList>
      <Tab>Milestones</Tab>
    </TabList>

    <TabPanel>
      <MilestoneSettings milestones={dashboardContext.milestones?.get} setUpdated={setUpdatedMilestones}/>
    </TabPanel>
  </Tabs>
}

