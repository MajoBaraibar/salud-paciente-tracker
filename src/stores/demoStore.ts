// Modo demo para presentaciones de ventas
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  pacientesDemoData, 
  historialesDemoData, 
  notasEnfermeriaDemoData,
  contactosEmergenciaDemoData,
  pagosDemoData,
  requisionesDemoData,
  eventosDemoData 
} from '@/data/demoData';
import type { Paciente, EntradaHistorial, EmergencyContactType, PaymentType, RequisitionItemType } from '@/types';

type Evento = {
  id: string;
  titulo: string;
  fecha: Date;
  horaInicio: string;
  horaFin: string;
  tipo: "consulta" | "visita" | "reunion" | "otro";
  pacienteId?: string;
  pacienteNombre?: string;
  descripcion: string;
  participantes?: string[];
  estado?: "programado" | "cancelado" | "completado";
};

interface DemoStore {
  // Modo demo
  isDemoMode: boolean;
  setDemoMode: (mode: boolean) => void;
  
  // Datos demo
  pacientes: Paciente[];
  historiales: EntradaHistorial[];
  notasEnfermeria: any[];
  contactosEmergencia: EmergencyContactType[];
  pagos: PaymentType[];
  requisiciones: RequisitionItemType[];
  eventos: Evento[];
  
  // Acciones CRUD para demo
  addPaciente: (paciente: Omit<Paciente, 'id'>) => void;
  updatePaciente: (id: string, paciente: Partial<Paciente>) => void;
  deletePaciente: (id: string) => void;
  
  addHistorial: (historial: Omit<EntradaHistorial, 'id'>) => void;
  updateHistorial: (id: string, historial: Partial<EntradaHistorial>) => void;
  
  addNotaEnfermeria: (nota: any) => void;
  
  addContactoEmergencia: (contacto: Omit<EmergencyContactType, 'id'>) => void;
  updateContactoEmergencia: (id: string, contacto: Partial<EmergencyContactType>) => void;
  
  updatePago: (id: string, pago: Partial<PaymentType>) => void;
  
  addEvento: (evento: Evento) => void;
  updateEvento: (id: string, evento: Partial<Evento>) => void;
  deleteEvento: (id: string) => void;
  
  // Reset demo data
  resetDemoData: () => void;
}

export const useDemoStore = create<DemoStore>()(
  persist(
    (set, get) => ({
      isDemoMode: true,
      
      // Datos iniciales
      pacientes: pacientesDemoData,
      historiales: historialesDemoData,
      notasEnfermeria: notasEnfermeriaDemoData,
      contactosEmergencia: contactosEmergenciaDemoData,
      pagos: pagosDemoData,
      requisiciones: requisionesDemoData,
      eventos: eventosDemoData,
      
      setDemoMode: (mode) => set({ isDemoMode: mode }),
      
      // CRUD Pacientes
      addPaciente: (newPaciente) => {
        const id = `pac-${Date.now()}`;
        const paciente = { ...newPaciente, id };
        set((state) => ({
          pacientes: [...state.pacientes, paciente]
        }));
      },
      
      updatePaciente: (id, updates) => {
        set((state) => ({
          pacientes: state.pacientes.map(p => 
            p.id === id ? { ...p, ...updates } : p
          )
        }));
      },
      
      deletePaciente: (id) => {
        set((state) => ({
          pacientes: state.pacientes.filter(p => p.id !== id),
          historiales: state.historiales.filter(h => h.pacienteId !== id),
          contactosEmergencia: state.contactosEmergencia.filter(c => c.pacienteId !== id),
          pagos: state.pagos.filter(p => p.pacienteId !== id)
        }));
      },
      
      // CRUD Historiales
      addHistorial: (newHistorial) => {
        const id = `hist-${Date.now()}`;
        const historial = { ...newHistorial, id };
        set((state) => ({
          historiales: [...state.historiales, historial]
        }));
      },
      
      updateHistorial: (id, updates) => {
        set((state) => ({
          historiales: state.historiales.map(h => 
            h.id === id ? { ...h, ...updates } : h
          )
        }));
      },
      
      // Notas enfermería
      addNotaEnfermeria: (newNota) => {
        const id = `nota-${Date.now()}`;
        const nota = { ...newNota, id };
        set((state) => ({
          notasEnfermeria: [...state.notasEnfermeria, nota]
        }));
      },
      
      // Contactos emergencia
      addContactoEmergencia: (newContacto) => {
        const id = `cont-${Date.now()}`;
        const contacto = { ...newContacto, id };
        set((state) => ({
          contactosEmergencia: [...state.contactosEmergencia, contacto]
        }));
      },
      
      updateContactoEmergencia: (id, updates) => {
        set((state) => ({
          contactosEmergencia: state.contactosEmergencia.map(c => 
            c.id === id ? { ...c, ...updates } : c
          )
        }));
      },
      
      // Pagos
      updatePago: (id, updates) => {
        set((state) => ({
          pagos: state.pagos.map(p => 
            p.id === id ? { ...p, ...updates } : p
          )
        }));
      },
      
      // Eventos
      addEvento: (evento) => {
        set((state) => ({
          eventos: [...state.eventos, evento]
        }));
      },
      
      updateEvento: (id, updates) => {
        set((state) => ({
          eventos: state.eventos.map(e => 
            e.id === id ? { ...e, ...updates } : e
          )
        }));
      },
      
      deleteEvento: (id) => {
        set((state) => ({
          eventos: state.eventos.filter(e => e.id !== id)
        }));
      },
      
      // Reset
      resetDemoData: () => {
        set({
          pacientes: pacientesDemoData,
          historiales: historialesDemoData,
          notasEnfermeria: notasEnfermeriaDemoData,
          contactosEmergencia: contactosEmergenciaDemoData,
          pagos: pagosDemoData,
          requisiciones: requisionesDemoData,
          eventos: eventosDemoData
        });
      }
    }),
    {
      name: 'health-center-demo'
    }
  )
);