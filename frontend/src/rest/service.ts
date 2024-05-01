export async function fetchMilestones(){
  const response = await fetch('http://localhost:8080/milestones')
  return await response.json()
}

export async function getMilestoneSourcePaths(milestoneSourceURL: string) {
  let response;
  try {
    response = await fetch(`http://localhost:8080/milestones/sources/paths?link=${milestoneSourceURL}`, {
      method: 'GET'
    })
  } catch (error) {
    console.log(error)
  }
  if (response?.ok) {
    return response.json()
  } else {
    return []
  }
}

export async function postMilestoneSource(milestoneSourceURL: string) {
  let response;
  try {
    response = await fetch(`http://localhost:8080/milestones/sources/${milestoneSourceURL}`, {
      method: 'POST',
      body: milestoneSourceURL
    })
  } catch (error) {
    console.log(error)
  }
  return response
}

export async function fetchMilestoneSources(){
  const response = await fetch(`http://localhost:8080/milestones/sources`, {
    method: 'GET'
  })
  return response.json()
}

export async function requestRefresh(){
  let response;
  try {
    response = await fetch(`http://localhost:8080/milestones/refresh`, {
    method: 'GET'
  }) 
  } catch (error) {
    console.log(error)
  }
  if (response?.ok) {
    return response.json()
  } else {
    return []
  }
}

export function wait(delay: number){
  return new Promise((resolve) => setTimeout(resolve, delay));
}