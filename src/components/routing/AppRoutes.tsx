import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import CreateProject from "@/pages/CreateProject";
import ProjectDetails from "@/pages/ProjectDetails";
import QuoteSubmission from "@/pages/QuoteSubmission";
import Messages from "@/pages/Messages";
import NotFound from "@/pages/NotFound";
import Populate from "@/pages/Populate";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
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
        path="/quotes/:id"
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
      <Route
        path="/populate"
        element={
          <ProtectedRoute>
            <Populate />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};