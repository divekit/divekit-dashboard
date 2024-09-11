import { useEffect, useState } from "react"
import { IFraudMatches, IFraudMessage } from "../../rest/types"
import { fetchFraudMatches, fetchFraudsByStudents } from "../../rest/service"
import { toast } from "react-toastify"
import { BtnCollapsible } from "../components/BtnCollapsible"
import { Color } from "../../theme/colors"

export function FraudMessageChart() {
  const [studentFrauds, setStudentFrauds] = useState<IFraudMessage[][]>()
  const [fraudMatches, setFraudMatches] = useState<IFraudMatches>(new Map())

  useEffect(() => {
    fetchFraudsByStudents().then((response) => {
      if (!response || !response.ok) {
        toast.error("Something went wrong when fetching fraud messages by students.")
        return
      }

      response.json().then((studentFrauds) => {
        setStudentFrauds(studentFrauds)
        console.log("these are the student frauds:", studentFrauds)
      })
    })
    
    fetchFraudMatches().then((response) => {
      if (!response || !response.ok) {
        toast.error("Something went wrong when fetching fraud matches.")
        return
      }

      response.json().then((fetchedMatches: IFraudMatches) => {
        setFraudMatches(new Map(Object.entries(fetchedMatches)))
        console.log("these are fraud matches:", new Map(Object.entries(fetchedMatches)))
      })
    })
  }, [])

  function getFraudsByIds(ids: string[]): IFraudMessage[][] {
    return studentFrauds ? studentFrauds.filter((fraudsByStudent) => ids.includes(fraudsByStudent[0].campusId)) : []
  }

  if (!studentFrauds || studentFrauds.length === 0) {
    return <div style={{textAlign: 'center', paddingTop: '5vh', paddingBottom: '5vh'}}>
      <b style={{fontSize: 20}}>There are currently no fraud warnings</b>
    </div>
  }

  return <div className="fraud-chart">
    { studentFrauds?.map((frauds, index) => {
      const fittingMatches = fraudMatches.get(frauds[0].campusId)
      return <FraudStudentCollapsible 
        studentFrauds={frauds} 
        studentMatches={fittingMatches} key={index}
        matchingFrauds={getFraudsByIds(fittingMatches ? Object.keys(fittingMatches) : [])}>
      </FraudStudentCollapsible>
    })}
  </div>;
}

export function FraudStudentCollapsible(
  {studentFrauds, studentMatches, matchingFrauds} : 
  {studentFrauds: IFraudMessage[], studentMatches: Map<string, number> | undefined, matchingFrauds: IFraudMessage[][]}
) {
  const [comparedId, setComparedId] = useState("")

  if(!studentMatches || studentMatches.size === 0){
    return <></>
  }

  const matches = new Map(Object.entries(studentMatches))
  const matchStrings: string[] = []

  matches.forEach((count: number, id: string) => {
    matchStrings.push(`${id} (${count} matches)`)
  })

  return <BtnCollapsible text={`${studentFrauds[0].campusId} (${studentFrauds.length} hits)`}>
    <FraudStudentTable studentFrauds={studentFrauds}></FraudStudentTable>
    {comparedId !== "" && <div>
      <h3 style={{marginLeft: '8vw'}}>Frauds by {comparedId}:</h3>
      <FraudStudentTable 
        studentFrauds={matchingFrauds.find(frauds => frauds[0].campusId === comparedId) ?? []}
        refFraudTuples={studentFrauds.map((fraud) => fraud.expectedName + fraud.actualName)}
      />
    </div>}
    <div style={{width: "85%", margin: "0 auto"}}>
      <BtnCollapsible 
        className="fraud-match-collapsible" 
        btnClassName="fraud-match-button" 
        text={`Students with similar matches (${matches.size})`}
      >
        {matchStrings.map((matchString) => 
          <p className="fraud-match-id" onClick={() => {
            const campusId = matchString.split(' ')[0]
            if (campusId === comparedId) {
              setComparedId("")
            } else {
              setComparedId(campusId)
            }
          }}>{matchString}</p>
        )}
      </BtnCollapsible>
    </div>
  </BtnCollapsible>
}

export function FraudStudentTable({studentFrauds, refFraudTuples} : {studentFrauds: IFraudMessage[], refFraudTuples?: string[]}) {
  return <table style={{ textAlign: "center", borderCollapse: "collapse", margin: "0 auto", width: "80%" }} className="table sortable">
    <tr className="table-header">
      <th className="table-header" style={{padding: "1vh"}}>Expected</th>
      <th className="table-header" style={{padding: "1vh"}}>Actual</th>
      <th className="table-header" style={{padding: "1vh"}}>Detection Date</th>
      <th className="table-header" style={{padding: "1vh"}}>Placeholder</th>
      <th className="table-header" style={{padding: "1vh"}}>File</th>
    </tr>

    { studentFrauds.map((fraudMessage, index) => {
      const style = refFraudTuples?.includes(fraudMessage.expectedName + fraudMessage.actualName) 
        ? {padding: "0.5vh", backgroundColor: Color.fraudMatch}
        : {padding: "0.5vh"}
      return <>
        <tr className="student-row" key={index}>
          <td style={style}>{fraudMessage.expectedName}</td>
          <td style={style}>{fraudMessage.actualName}</td>
          <td style={style}>{new Date(fraudMessage.detectionDate).toLocaleString()}</td>
          <td style={style}>{fraudMessage.placeholder}</td>
          <td style={style}>{fraudMessage.filePathFromSrc}</td>
        </tr>
      </>
    })}
  </table>
}