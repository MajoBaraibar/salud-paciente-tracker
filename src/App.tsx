
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DemoNuevoPaciente from "./pages/DemoNuevoPaciente";
import DemoPresentation from "./pages/DemoPresentation";
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
import Reportes from "./pages/Reportes";
import Archivos from "./pages/Archivos";
import NotFound from "./pages/NotFound";

import { getActiveConfig } from "@/config/centerConfig";

// Configuración dinámica del centro
const centerConfig = getActiveConfig();
document.title = centerConfig.title;

const queryClient = new QueryClient();

// Componente para verificar autenticación en ruta raíz
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("user");
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
           <Route path="/login" element={<Login />} />
           <Route path="/register" element={<Register />} />
          
           {/* Ruta raíz - Presentación Demo */}
           <Route 
             path="/" 
             element={<DemoPresentation />} 
           />
           
           {/* Ruta original de index si es necesaria */}
           <Route 
             path="/index" 
             element={
               <PublicRoute>
                 <Index />
               </PublicRoute>
             } 
           />
          
          {/* Rutas protegidas con control de roles */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requiredRole="familiar">
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
           <Route 
             path="/pacientes" 
             element={
               <ProtectedRoute requiredRole={["medico", "enfermera", "admin"]}>
                 <Pacientes />
               </ProtectedRoute>
             } 
           />
          
          <Route 
            path="/pacientes/:id" 
            element={
              <ProtectedRoute requiredRole="familiar">
                <DetallesPaciente />
              </ProtectedRoute>
            } 
          />
          
           <Route 
             path="/pacientes/nuevo" 
             element={
               <ProtectedRoute requiredRole="admin">
                 <NuevoPaciente />
               </ProtectedRoute>
             } 
           />
           
           <Route 
             path="/demo/pacientes/nuevo" 
             element={<DemoNuevoPaciente />} 
           />
          
          <Route 
            path="/mensajes" 
            element={
              <ProtectedRoute requiredRole="familiar">
                <Mensajes />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/anuncios" 
            element={
              <ProtectedRoute requiredRole="enfermera">
                <Anuncios />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/calendario" 
            element={
              <ProtectedRoute requiredRole="familiar">
                <Calendario />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/requisiciones" 
            element={
              <ProtectedRoute requiredRole="enfermera">
                <Requisiciones />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/pagos" 
            element={
              <ProtectedRoute requiredRole="familiar">
                <Pagos />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <Admin />
              </ProtectedRoute>
            } 
          />
          
           <Route 
             path="/reportes" 
             element={
               <ProtectedRoute requiredRole={["medico", "admin"]}>
                 <Reportes />
               </ProtectedRoute>
             } 
           />
           
           <Route 
             path="/archivos" 
             element={
               <ProtectedRoute requiredRole={["medico", "admin"]}>
                 <Archivos />
               </ProtectedRoute>
             } 
           />
           
           <Route 
             path="/configuracion" 
             element={
               <ProtectedRoute requiredRole="familiar">
                 <Configuracion />
               </ProtectedRoute>
             } 
           />
           
           <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
