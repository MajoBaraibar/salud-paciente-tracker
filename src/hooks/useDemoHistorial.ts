import { useDemoStore } from '@/stores/demoStore';

export const useHistorial = (pacienteId: string) => {
  const { isDemoMode, historiales } = useDemoStore();
  
  if (isDemoMode) {
    return {
      historiales: historiales.filter(h => h.pacienteId === pacienteId),
      loading: false,
      error: null,
      addHistorial: useDemoStore.getState().addHistorial,
      updateHistorial: useDemoStore.getState().updateHistorial
    };
  }
  
  // Aquí iría la lógica real de Supabase cuando no esté en modo demo
  return {
    historiales: [],
    loading: false,
    error: null,
    addHistorial: () => {},
    updateHistorial: () => {}
  };
};