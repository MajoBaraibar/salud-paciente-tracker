import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EntradaHistorial } from '@/types';
import { historialMock } from '@/data/mockData';

export const useHistorialPaciente = (pacienteId: string) => {
  const [entradas, setEntradas] = useState<EntradaHistorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistorial = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Verificar si hay usuario temporal
      const userString = localStorage.getItem("user");
      const isTemporaryUser = userString && JSON.parse(userString).supabaseId?.includes('temp');
      
      // Si es usuario temporal o no hay Supabase configurado, usar datos mock
      if (!supabase || isTemporaryUser) {
        const mockHistorial = historialMock.filter(h => h.pacienteId === pacienteId);
        setEntradas(mockHistorial);
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('entradas_historial')
        .select('*')
        .eq('paciente_id', pacienteId)
        .order('fecha', { ascending: false });

      if (error) {
        console.log('Error de Supabase, usando datos mock:', error);
        const mockHistorial = historialMock.filter(h => h.pacienteId === pacienteId);
        setEntradas(mockHistorial);
        setError('Usando datos de demostración');
        return;
      }

      // Transform database data to match our EntradaHistorial type
      const transformedData: EntradaHistorial[] = data.map(item => ({
        id: item.id,
        pacienteId: item.paciente_id,
        fecha: item.fecha,
        doctorNombre: item.doctor_nombre,
        motivoConsulta: item.motivo_consulta,
        diagnostico: item.diagnostico,
        tratamiento: item.tratamiento,
        notas: item.notas || '',
        tipo: item.tipo as 'interno' | 'externo'
      }));

      setEntradas(transformedData);
    } catch (err) {
      console.error('Error fetching historial:', err);
      // En caso de error, usar datos mock como fallback
      const mockHistorial = historialMock.filter(h => h.pacienteId === pacienteId);
      setEntradas(mockHistorial);
      setError(err instanceof Error ? err.message : 'Error al cargar historial');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pacienteId) {
      fetchHistorial();
    }
  }, [pacienteId]);

  return { entradas, loading, error, refetch: fetchHistorial };
};