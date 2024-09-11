import { JPlagConfig } from "./types"

// for deployment the backend runs a static version of the frontend and thus automatically uses the backend URL (should be set to empty)
// if both applications run on different URLs (for example during development), this variable should point to the backend server URL (ex.: http://localhost:8080)
const BACKEND_URL = ""

export async function fetchMilestones(){
  const response = await fetch(`${BACKEND_URL}/milestones`,  {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    })
  return response
}

export async function deleteMilestone(name: string){
  const response = await fetch(`${BACKEND_URL}/milestones/${name}`, {
    method: 'DELETE',
  })
  return response
}

export async function getMilestoneSourcePaths(milestoneSourceURL: string) {
  let response;
  try {
    response = await fetch(`${BACKEND_URL}/milestones/sources/paths?link=${milestoneSourceURL}`,  {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    })
  } catch (error) {
    console.log(error)
  }
  return response
}

export async function postMilestoneSource(milestoneSourceURL: string) {
  let response;
  try {
    response = await fetch(`${BACKEND_URL}/milestones/sources/${milestoneSourceURL}`, {
      method: 'POST',
      body: milestoneSourceURL,
    })
  } catch (error) {
    console.log(error)
  }
  return response
}

export async function fetchMilestoneSources(){
  const response = await fetch(`${BACKEND_URL}/milestones/sources`, {
    method: 'GET',
  })
  return response.json()
}

export async function requestRefresh(){
  let response;
  try {
    response = await fetch(`${BACKEND_URL}/milestones/refresh`, {
    method: 'GET',
  }) 
  } catch (error) {
    console.log(error)
  }
  return response
}

export async function fetchFraudMessages() {
  let response;
  try {
    response = await fetch(`${BACKEND_URL}/fraud-messages`, {
    method: 'GET',
  }) 
  } catch (error) {
    console.log(error)
  }
  return response
}

export async function fetchFraudsByStudents() {
  let response;
  try {
    response = await fetch(`${BACKEND_URL}/fraud-messages/students`, {
    method: 'GET',
  }) 
  } catch (error) {
    console.log(error)
  }
  return response
}

export async function fetchFraudMatches() {
  let response;
  try {
    response = await fetch(`${BACKEND_URL}/fraud-messages/matches`, {
    method: 'GET',
  }) 
  } catch (error) {
    console.log(error)
  }
  return response
}

export async function downloadRepositoryArchives(milestoneId: string){
  const response = await fetch(`${BACKEND_URL}/milestones/${milestoneId}/repositories`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    })
  return response
}

export async function fetchRepositoryData(milestoneId: string){
  const response = await fetch(`${BACKEND_URL}/milestones/${milestoneId}/repositories/data`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    })
  return response
}

export async function deleteRepositoriesFolder(milestoneId: string){
  const response = await fetch(`${BACKEND_URL}/milestones/${milestoneId}/repositories`, {
      method: 'DELETE',
    })
  return response
}

export async function downloadJPlagReport(milestoneId: string, config: JPlagConfig){
  const response = await fetch(`${BACKEND_URL}/milestones/${milestoneId}/report?minToken=${config.minToken}&threshold=${config.threshold}&useBaseCode=${config.useBaseCode}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/zip'},
    })
  return response
}

export function wait(delay: number){
  return new Promise((resolve) => setTimeout(resolve, delay));
}