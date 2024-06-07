export default function NoSourceSetNotice(){
  return <div className="card" style={{textAlign: "center"}}>
    <h1 className="divekit-header">Divekit Dashboard</h1>
    <p style={{width: "700px", margin: "auto", paddingBottom: "20px"}}>
      Please set a milestone source to view milestones.<br/>
      Milestone sources are found in the repositories under https://git.archi-lab.io/ 
      and can be added with the button on the upper right.</p>
  </div>
}