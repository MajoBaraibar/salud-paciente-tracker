
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Pacientes from "./pages/Pacientes";
import DetallesPaciente from "./pages/DetallesPaciente";
import NuevoPaciente from "./pages/NuevoPaciente";
import Mensajes from "./pages/Mensajes";
import Anuncios from "./pages/Anuncios";
import Calendario from "./pages/Calendario";
import Requisiciones from "./pages/Requisiciones";
import Pagos from "./pages/Pagos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Componente para rutas protegidas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("user");
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem("user");
  const isAdmin = user ? JSON.parse(user).role === "admin" : false;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const MedicoEnfermeraRoute = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem("user");
  const role = user ? JSON.parse(user).role : "";
  const isMedicoOrEnfermera = role === "medico" || role === "enfermera";
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isMedicoOrEnfermera && role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Ruta raíz redirige a dashboard o login según autenticación */}
          <Route 
            path="/" 
            element={
              localStorage.getItem("user") ? 
                <Navigate to="/dashboard" replace /> : 
                <Index />
            } 
          />
          
          {/* Rutas protegidas */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/pacientes" 
            element={
              <MedicoEnfermeraRoute>
                <Pacientes />
              </MedicoEnfermeraRoute>
            } 
          />
          
          <Route 
            path="/pacientes/:id" 
            element={
              <ProtectedRoute>
                <DetallesPaciente />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/pacientes/nuevo" 
            element={
              <AdminRoute>
                <NuevoPaciente />
              </AdminRoute>
            } 
          />
          
          <Route 
            path="/mensajes" 
            element={
              <ProtectedRoute>
                <Mensajes />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/anuncios" 
            element={
              <ProtectedRoute>
                <Anuncios />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/calendario" 
            element={
              <ProtectedRoute>
                <Calendario />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/requisiciones" 
            element={
              <ProtectedRoute>
                <Requisiciones />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/pagos" 
            element={
              <AdminRoute>
                <Pagos />
              </AdminRoute>
            } 
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
