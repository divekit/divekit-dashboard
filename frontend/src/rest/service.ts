import { IMilestone, IMilestoneTest, IStudent } from "./types"

export async function fetchMilestones(){
  const response = await fetch('http://localhost:8080/milestones')
  return await response.json()
}

export async function getMilestoneSourcePaths(milestoneSourceURL: string) {
  const response = await fetch(`http://localhost:8080/milestones/sources/paths?link=${milestoneSourceURL}`, {
    method: 'GET'
  }) // missing error handling
  return response.json()
}

export async function postMilestoneSource(milestoneSourceURL: string) {
  const response = await fetch(`http://localhost:8080/milestones/sources/${milestoneSourceURL}`, {
    method: 'POST',
    body: milestoneSourceURL
  }) // missing error handling
  return response
}

export function wait(delay: number){
  return new Promise((resolve) => setTimeout(resolve, delay));
}