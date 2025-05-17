
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
import Admin from "./pages/Admin";
import Configuracion from "./pages/Configuracion";
import NotFound from "./pages/NotFound";

// Cambiar el título de la página a "En Suma"
document.title = "En Suma | Sistema Integral de Gestión Médica";

const queryClient = new QueryClient();

// Componente para rutas protegidas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("user");
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Componente para rutas de administrador
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

// Componente para rutas de personal médico (médicos y enfermeras)
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

// Componente para rutas de familiares (acceso restringido)
const FamiliarRoute = ({ children, pacienteId }: { children: React.ReactNode, pacienteId?: string }) => {
  const user = localStorage.getItem("user");
  const isFamiliar = user ? JSON.parse(user).role === "familiar" : false;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (isFamiliar) {
    // Si es un familiar y está accediendo a un paciente que no es suyo
    // (esto es un ejemplo, en producción habría que verificar con la base de datos)
    const familiarPatientId = "1"; // Simulamos que el familiar está asignado al paciente con ID 1
    if (pacienteId && pacienteId !== familiarPatientId) {
      return <Navigate to="/pacientes/1" replace />;
    }
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
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
              <ProtectedRoute>
                <Pagos />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            } 
          />
          
          <Route 
            path="/configuracion" 
            element={
              <ProtectedRoute>
                <Configuracion />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
