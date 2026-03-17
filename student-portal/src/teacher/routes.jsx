import { Routes, Route, Navigate } from "react-router-dom"
import TeacherDashboard from "./pages/Dashboard"

import Upload from "./pages/Upload"
import MyUploads from "./pages/MyUploads"
import TeacherProfile from "./pages/Profile"
import AddLecture from "./pages/AddLecture"



export default function TeacherRoutes() {
  const token = localStorage.getItem("token")
  const isStaff = localStorage.getItem("is_staff")

  // block access if not teacher
  if (!token || isStaff !== "true") {
    return <Navigate to="/login" />
  }

  return (
    <Routes>
      <Route path="/dashboard" element={<TeacherDashboard />} />

      <Route path="/upload" element={<Upload />} />
      <Route path="/uploads" element={<MyUploads />} />
      <Route path="/Profile" element={<TeacherProfile />} />
      <Route path="/add-lecture" element={<AddLecture />} />


    </Routes>
  )
}
