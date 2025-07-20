import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Paciente } from '@/types';

export const usePacientes = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPacientes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .order('nombre', { ascending: true });

      if (error) throw error;

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
      setError(err instanceof Error ? err.message : 'Error al cargar pacientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  return { pacientes, loading, error, refetch: fetchPacientes };
};

export const usePacienteById = (id: string) => {
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('pacientes')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

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