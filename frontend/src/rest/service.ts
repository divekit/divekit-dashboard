const BACKEND_SERVER = "http://localhost"
const BACKEND_PORT = "8080"
const BACKEND_URL = BACKEND_SERVER + ":" + BACKEND_PORT

export async function fetchMilestones(){
  const response = await fetch(`${BACKEND_URL}/milestones`,  {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
  return response
}

export async function deleteMilestone(name: string){
  const response = await fetch(`${BACKEND_URL}/milestones/${name}`, {
    method: 'DELETE',
    credentials: 'include'
  })
  return response
}

export async function getMilestoneSourcePaths(milestoneSourceURL: string) {
  let response;
  try {
    response = await fetch(`${BACKEND_URL}/milestones/sources/paths?link=${milestoneSourceURL}`,  {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
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
      credentials: 'include'
    })
  } catch (error) {
    console.log(error)
  }
  return response
}

export async function fetchMilestoneSources(){
  const response = await fetch(`${BACKEND_URL}/milestones/sources`, {
    method: 'GET',
    credentials: 'include'
  })
  return response.json()
}

export async function requestRefresh(){
  let response;
  try {
    response = await fetch(`${BACKEND_URL}/milestones/refresh`, {
    method: 'GET',
    credentials: 'include'
  }) 
  } catch (error) {
    console.log(error)
  }
  return response
}

export function wait(delay: number){
  return new Promise((resolve) => setTimeout(resolve, delay));
}