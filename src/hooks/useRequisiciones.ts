import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Requisicion {
  id: string;
  nombre: string;
  cantidad: number;
  categoria_id: string;
  prioridad: 'alta' | 'media' | 'baja';
  estado: 'pendiente' | 'aprobada' | 'rechazada' | 'completada';
  notas?: string;
  solicitado_por: string;
  created_at: string;
  updated_at: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
}

export const useRequisiciones = () => {
  const [requisiciones, setRequisiciones] = useState<Requisicion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequisiciones = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('requisiciones')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform and validate the data
      const validatedData: Requisicion[] = (data || []).map(item => ({
        ...item,
        prioridad: ['alta', 'media', 'baja'].includes(item.prioridad) ? item.prioridad as 'alta' | 'media' | 'baja' : 'media',
        estado: ['pendiente', 'aprobada', 'rechazada', 'completada'].includes(item.estado) ? item.estado as 'pendiente' | 'aprobada' | 'rechazada' | 'completada' : 'pendiente'
      }));
      
      setRequisiciones(validatedData);
    } catch (err) {
      console.error('Error fetching requisiciones:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar requisiciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequisiciones();
  }, []);

  return { requisiciones, loading, error, refetch: fetchRequisiciones };
};

export const useCategorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('categorias_requisiciones')
          .select('*')
          .order('nombre', { ascending: true });

        if (error) throw error;
        setCategorias(data || []);
      } catch (err) {
        console.error('Error fetching categorias:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar categorías');
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  return { categorias, loading, error };
};