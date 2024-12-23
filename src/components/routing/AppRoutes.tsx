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
import Projects from "@/pages/Projects";
import Quotes from "@/pages/Quotes";
import Users from "@/pages/Users";
import Settings from "@/pages/Settings";

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
        path="/projects"
        element={
          <ProtectedRoute>
            <Projects />
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
        path="/quotes"
        element={
          <ProtectedRoute>
            <Quotes />
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
        path="/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
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