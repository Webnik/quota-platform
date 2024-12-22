import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import CreateProject from "@/pages/CreateProject";
import ProjectDetails from "@/pages/ProjectDetails";
import QuoteSubmission from "@/pages/QuoteSubmission";
import Messages from "@/pages/Messages";
import { PasswordReset } from "@/components/auth/PasswordReset";
import { UpdatePassword } from "@/components/auth/UpdatePassword";
import ProfileManagement from "@/components/profile/ProfileManagement";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<PasswordReset />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfileManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/new"
        element={
          <ProtectedRoute>
            <CreateProject />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:id"
        element={
          <ProtectedRoute>
            <ProjectDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId/quotes/:tradeId"
        element={
          <ProtectedRoute>
            <QuoteSubmission />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};