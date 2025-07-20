import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';

interface CentroInfo {
  id: string;
  nombre: string;
  codigo_identificacion: string;
}

export const CentroIndicator = () => {
  const { user } = useAuth();
  const [centro, setCentro] = useState<CentroInfo | null>(null);

  useEffect(() => {
    const fetchCentroInfo = async () => {
      if (!user?.centro_id) return;

      try {
        const { data, error } = await supabase
          .from('centros_salud')
          .select('id, nombre, codigo_identificacion')
          .eq('id', user.centro_id)
          .single();

        if (error) throw error;
        setCentro(data);
      } catch (error) {
        console.error('Error al cargar info del centro:', error);
      }
    };

    fetchCentroInfo();
  }, [user?.centro_id]);

  if (!centro) return null;

  return (
    <Badge variant="outline" className="flex items-center gap-2 bg-health-50 text-health-700 border-health-200">
      <Building2 className="h-3 w-3" />
      <span className="text-xs font-medium">{centro.nombre}</span>
      <span className="text-xs opacity-75">({centro.codigo_identificacion})</span>
    </Badge>
  );
};