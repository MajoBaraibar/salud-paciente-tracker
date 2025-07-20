import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Paciente } from '@/types';
import { pacientesMock } from '@/data/mockData';
import { useDemoStore } from '@/stores/demoStore';

export const usePacientes = () => {
  const { isDemoMode, pacientes: demoPacientes } = useDemoStore();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPacientes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Si está en modo demo, usar datos del store
      if (isDemoMode) {
        console.log('Usando datos demo del store');
        setPacientes(demoPacientes);
        setLoading(false);
        return;
      }
      
      // Verificar si hay usuario temporal (no autenticado con Supabase)
      const userString = localStorage.getItem("user");
      const isTemporaryUser = userString && JSON.parse(userString).supabaseId?.includes('temp');
      
      // Si es usuario temporal o no hay Supabase configurado, usar datos mock
      if (!supabase || isTemporaryUser) {
        console.log('Usando datos mock para usuario temporal');
        setPacientes(pacientesMock);
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .order('nombre', { ascending: true });

      if (error) {
        console.log('Error de Supabase, usando datos mock:', error);
        setPacientes(pacientesMock);
        setError('Usando datos de demostración');
        return;
      }

      // Transform database data to match our Paciente type
      const transformedData: Paciente[] = data.map(item => ({
        id: item.id,
        nombre: item.nombre,
        apellido: item.apellido,
        fechaNacimiento: item.fecha_nacimiento,
        genero: item.genero,
        numeroIdentificacion: item.numero_identificacion,
        telefono: item.telefono,
        direccion: item.direccion,
        imagenUrl: item.imagen_url
      }));

      setPacientes(transformedData);
    } catch (err) {
      console.error('Error fetching pacientes:', err);
      // En caso de error, usar datos mock como fallback
      setPacientes(pacientesMock);
      setError(err instanceof Error ? err.message : 'Error al cargar pacientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, [isDemoMode, demoPacientes]);

  return { pacientes, loading, error, refetch: fetchPacientes };
};

export const usePacienteById = (id: string) => {
  const { isDemoMode, pacientes: demoPacientes } = useDemoStore();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Si está en modo demo, usar datos del store
        if (isDemoMode) {
          const demoPaciente = demoPacientes.find(p => p.id === id);
          setPaciente(demoPaciente || null);
          setLoading(false);
          return;
        }
        
        // Verificar si hay usuario temporal
        const userString = localStorage.getItem("user");
        const isTemporaryUser = userString && JSON.parse(userString).supabaseId?.includes('temp');
        
        // Si es usuario temporal o no hay Supabase configurado, usar datos mock
        if (!supabase || isTemporaryUser) {
          const mockPaciente = pacientesMock.find(p => p.id === id);
          setPaciente(mockPaciente || null);
          setLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('pacientes')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          // En caso de error, usar datos mock como fallback
          const mockPaciente = pacientesMock.find(p => p.id === id);
          setPaciente(mockPaciente || null);
          setError('Usando datos de demostración');
          return;
        }

        if (data) {
          const transformedData: Paciente = {
            id: data.id,
            nombre: data.nombre,
            apellido: data.apellido,
            fechaNacimiento: data.fecha_nacimiento,
            genero: data.genero,
            numeroIdentificacion: data.numero_identificacion,
            telefono: data.telefono,
            direccion: data.direccion,
            imagenUrl: data.imagen_url
          };
          setPaciente(transformedData);
        }
      } catch (err) {
        console.error('Error fetching paciente:', err);
        // En caso de error, usar datos mock como fallback
        const mockPaciente = pacientesMock.find(p => p.id === id);
        setPaciente(mockPaciente || null);
        setError(err instanceof Error ? err.message : 'Error al cargar paciente');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPaciente();
    }
  }, [id]);

  return { paciente, loading, error };
};