import { Routes, Route } from "react-router-dom";

// pages
import Dashboard from "./pages/Dashboard";
import Video from "./pages/Video";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

// route guard
import ProtectedRoute from "./components/ProtectedRoute";

/**
 * Student routes configuration
 * Handles login + protected student pages
 */

import TeacherRoutes from "../teacher/routes"


export default function StudentRoutes() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Protected dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected video page */}
      <Route
        path="/watch/:subject/:id"
        element={
          <ProtectedRoute>
            <Video />
          </ProtectedRoute>
        }
      />

       {/* Student profile page */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route path="/teacher/*" element={<TeacherRoutes />} />

    </Routes>
  );
}
