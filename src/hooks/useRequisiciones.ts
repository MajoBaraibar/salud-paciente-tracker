import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { requisionesDemoData, categoriasDemoData } from '@/data/demoData';

export interface Requisicion {
  id: string;
  nombre: string;
  cantidad: number;
  categoria_id: string;
  prioridad: 'alta' | 'media' | 'baja';
  estado: 'pendiente' | 'aprobada' | 'rechazada' | 'completada';
  notas?: string;
  solicitado_por: string;
  stock: number;
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
      
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('requisiciones')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.log('No database connection, using demo data');
        // Use demo data as fallback
        setRequisiciones(requisionesDemoData);
      } else {
        // Transform and validate the data from database
        const validatedData: Requisicion[] = (data || []).map(item => ({
          ...item,
          prioridad: ['alta', 'media', 'baja'].includes(item.prioridad) ? item.prioridad as 'alta' | 'media' | 'baja' : 'media',
          estado: ['pendiente', 'aprobada', 'rechazada', 'completada'].includes(item.estado) ? item.estado as 'pendiente' | 'aprobada' | 'rechazada' | 'completada' : 'pendiente'
        }));
        
        // If no data from database, use demo data
        if (validatedData.length === 0) {
          setRequisiciones(requisionesDemoData);
        } else {
          setRequisiciones(validatedData);
        }
      }
    } catch (err) {
      console.error('Error fetching requisiciones:', err);
      // Use demo data on any error
      setRequisiciones(requisionesDemoData);
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

        if (error) {
          console.log('No database connection, using demo categories');
          setCategorias(categoriasDemoData);
        } else {
          // If no data from database, use demo data
          if (!data || data.length === 0) {
            setCategorias(categoriasDemoData);
          } else {
            setCategorias(data);
          }
        }
      } catch (err) {
        console.error('Error fetching categorias:', err);
        // Use demo data on any error
        setCategorias(categoriasDemoData);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  return { categorias, loading, error };
};