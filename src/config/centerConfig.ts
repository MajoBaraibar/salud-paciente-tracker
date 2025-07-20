// Configuración específica para cada centro de salud
// Cambia estos valores para cada instancia

export const centerConfig = {
  // Información del centro
  name: "Health Center 1",
  shortName: "HC1",
  code: "HC001",
  
  // Información de contacto
  address: "Av. Principal 123",
  phone: "+1234567890",
  email: "admin@healthcenter1.com",
  
  // Branding
  logo: "/logo-hc1.png",
  primaryColor: "hsl(142, 51%, 56%)", // Verde salud por defecto
  
  // Configuración específica
  features: {
    payments: true,
    requisitions: true,
    messaging: true,
    emergencyContacts: true
  },
  
  // URLs y dominios
  domain: "healthcenter1.com",
  subdomain: "hc1",
  
  // Configuración de la app
  title: "Health Center 1 | Sistema de Gestión Médica",
  description: "Centro de atención y cuidado para adultos mayores - Health Center 1"
};

// Configuraciones predefinidas para diferentes centros
export const centerConfigs = {
  hc1: {
    ...centerConfig,
    name: "Health Center 1",
    shortName: "HC1",
    code: "HC001",
    email: "admin@healthcenter1.com",
    primaryColor: "hsl(142, 51%, 56%)", // Verde
  },
  
  hc2: {
    ...centerConfig,
    name: "Health Center 2", 
    shortName: "HC2",
    code: "HC002",
    address: "Calle Secundaria 456",
    phone: "+0987654321",
    email: "admin@healthcenter2.com",
    primaryColor: "hsl(217, 91%, 60%)", // Azul
    title: "Health Center 2 | Sistema de Gestión Médica",
  },
  
  hc3: {
    ...centerConfig,
    name: "Health Center 3",
    shortName: "HC3", 
    code: "HC003",
    address: "Carrera 78 #15-42",
    phone: "+1122334455",
    email: "admin@healthcenter3.com",
    primaryColor: "hsl(262, 83%, 58%)", // Púrpura
    title: "Health Center 3 | Sistema de Gestión Médica",
  }
};

// Función para obtener configuración activa
export const getActiveConfig = () => {
  // En producción, esto se determinaría por el dominio o variable de entorno
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  
  if (hostname.includes('hc2') || hostname.includes('healthcenter2')) {
    return centerConfigs.hc2;
  } else if (hostname.includes('hc3') || hostname.includes('healthcenter3')) {
    return centerConfigs.hc3;
  }
  
  // Por defecto HC1
  return centerConfigs.hc1;
};