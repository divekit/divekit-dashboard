import { useState } from "react"
import { IMilestone, IStudent } from "../../rest/types"
import { DashboardContext, useStudentFilterContext } from "../DashboardContext"
import StudentDetail from "./StudentDetail"
import { StudentTable } from "../charts/students/StudentTable"

export default function StudentOverview(){
  const [selectedStudent, setSelectedStudent] = useState<IStudent>()
  let students = useStudentFilterContext().filteredStudents

  return selectedStudent ? 
        <StudentDetail student={selectedStudent}/> : (students ? 
        <StudentTable students={students} setSelectedStudent={setSelectedStudent}/> : <></>)
}