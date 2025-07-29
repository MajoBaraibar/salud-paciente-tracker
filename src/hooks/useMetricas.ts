import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useDemoStore } from '@/stores/demoStore';

export interface MetricaCentro {
  id: string;
  centro_id: string;
  fecha: string;
  total_pacientes: number;
  nuevos_pacientes: number;
  consultas_realizadas: number;
  emergencias_atendidas: number;
  ocupacion_porcentaje: number;
  satisfaccion_promedio: number | null;
  ingresos_diarios: number;
  gastos_diarios: number;
  created_at: string;
  updated_at: string;
}

export interface AlertaSistema {
  id: string;
  centro_id: string | null;
  paciente_id: string | null;
  tipo: 'critica' | 'importante' | 'informativa' | 'medicamento';
  titulo: string;
  descripcion: string;
  estado: 'activa' | 'resuelta' | 'archivada';
  prioridad: 1 | 2 | 3 | 4;
  asignado_a: string | null;
  resuelto_por: string | null;
  fecha_resolucion: string | null;
  created_at: string;
  updated_at: string;
}

export const useMetricas = () => {
  const [metricasCentro, setMetricasCentro] = useState<MetricaCentro[]>([]);
  const [alertas, setAlertas] = useState<AlertaSistema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { isDemoMode } = useDemoStore();

  const generateDemoMetricas = (dias: number = 30): MetricaCentro[] => {
    const metricas: MetricaCentro[] = [];
    const today = new Date();
    
    for (let i = dias - 1; i >= 0; i--) {
      const fecha = new Date(today);
      fecha.setDate(fecha.getDate() - i);
      
      metricas.push({
        id: `demo-${i}`,
        centro_id: 'demo-centro',
        fecha: fecha.toISOString().split('T')[0],
        total_pacientes: 15 + Math.floor(Math.random() * 10),
        nuevos_pacientes: Math.floor(Math.random() * 3),
        consultas_realizadas: 5 + Math.floor(Math.random() * 15),
        emergencias_atendidas: Math.floor(Math.random() * 3),
        ocupacion_porcentaje: Number((60 + Math.random() * 30).toFixed(2)),
        satisfaccion_promedio: Number((4.2 + Math.random() * 0.6).toFixed(2)),
        ingresos_diarios: Number((1500 + Math.random() * 1000).toFixed(2)),
        gastos_diarios: Number((800 + Math.random() * 400).toFixed(2)),
        created_at: fecha.toISOString(),
        updated_at: fecha.toISOString()
      });
    }
    
    return metricas;
  };

  const generateDemoAlertas = (): AlertaSistema[] => {
    const tipos: Array<'critica' | 'importante' | 'informativa' | 'medicamento'> = ['critica', 'importante', 'informativa', 'medicamento'];
    const alertas: AlertaSistema[] = [];
    
    const alertasData = [
      { titulo: 'Paciente en estado crítico', descripcion: 'Signos vitales alarmantes en habitación 101', prioridad: 4, tipo: 'critica' },
      { titulo: 'Medicamento próximo a vencer', descripcion: 'Stock de insulina expira en 3 días', prioridad: 3, tipo: 'medicamento' },
      { titulo: 'Hora de medicación', descripcion: 'Paciente María González - Metformina 8:00 AM', prioridad: 2, tipo: 'medicamento' },
      { titulo: 'Revisión médica programada', descripcion: 'Control rutinario paciente en habitación 205', prioridad: 1, tipo: 'informativa' },
      { titulo: 'Falta de personal', descripcion: 'Turno de noche requiere enfermera adicional', prioridad: 3, tipo: 'importante' }
    ];

    alertasData.forEach((alertaData, index) => {
      const fecha = new Date();
      fecha.setHours(fecha.getHours() - Math.floor(Math.random() * 6));
      
      alertas.push({
        id: `demo-alerta-${index}`,
        centro_id: 'demo-centro',
        paciente_id: null,
        tipo: alertaData.tipo as any,
        titulo: alertaData.titulo,
        descripcion: alertaData.descripcion,
        estado: 'activa',
        prioridad: alertaData.prioridad as any,
        asignado_a: null,
        resuelto_por: null,
        fecha_resolucion: null,
        created_at: fecha.toISOString(),
        updated_at: fecha.toISOString()
      });
    });
    
    return alertas;
  };

  const fetchMetricasCentro = async (dias: number = 30) => {
    try {
      if (isDemoMode) {
        setMetricasCentro(generateDemoMetricas(dias));
        return;
      }

      const fechaInicio = new Date();
      fechaInicio.setDate(fechaInicio.getDate() - dias);
      
      const { data, error } = await supabase
        .from('metricas_centro')
        .select('*')
        .gte('fecha', fechaInicio.toISOString().split('T')[0])
        .order('fecha', { ascending: true });

      if (error) throw error;
      setMetricasCentro(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar métricas');
    }
  };

  const fetchAlertas = async () => {
    try {
      if (isDemoMode) {
        setAlertas(generateDemoAlertas());
        return;
      }

      const { data, error } = await supabase
        .from('alertas_sistema')
        .select('*')
        .eq('estado', 'activa')
        .order('prioridad', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setAlertas(data as AlertaSistema[] || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar alertas');
    }
  };

  const resolverAlerta = async (alertaId: string) => {
    try {
      if (isDemoMode) {
        // En modo demo, solo actualizar estado local
        setAlertas(prev => prev.filter(alerta => alerta.id !== alertaId));
        return;
      }

      const { error } = await supabase
        .from('alertas_sistema')
        .update({
          estado: 'resuelta',
          resuelto_por: user?.id,
          fecha_resolucion: new Date().toISOString()
        })
        .eq('id', alertaId);

      if (error) throw error;
      
      // Actualizar estado local
      setAlertas(prev => prev.filter(alerta => alerta.id !== alertaId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al resolver alerta');
    }
  };

  const crearAlerta = async (nuevaAlerta: Omit<AlertaSistema, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (isDemoMode) {
        const alerta: AlertaSistema = {
          ...nuevaAlerta,
          id: `demo-alerta-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setAlertas(prev => [alerta, ...prev]);
        return alerta;
      }

      const { data, error } = await supabase
        .from('alertas_sistema')
        .insert([nuevaAlerta])
        .select()
        .single();

      if (error) throw error;
      
      setAlertas(prev => [data as AlertaSistema, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear alerta');
      return null;
    }
  };

  const getEstadisticasResumen = () => {
    const ultimaMetrica = metricasCentro[metricasCentro.length - 1];
    if (!ultimaMetrica) return null;

    const metricasUltimos7Dias = metricasCentro.slice(-7);
    const promedioOcupacion = metricasUltimos7Dias.reduce((acc, m) => acc + m.ocupacion_porcentaje, 0) / metricasUltimos7Dias.length;
    const totalConsultas = metricasUltimos7Dias.reduce((acc, m) => acc + m.consultas_realizadas, 0);
    
    return {
      totalPacientes: ultimaMetrica.total_pacientes,
      nuevoPacientesHoy: ultimaMetrica.nuevos_pacientes,
      ocupacionPromedio: Math.round(promedioOcupacion),
      consultasSemanales: totalConsultas,
      alertasCriticas: alertas.filter(a => a.prioridad === 4).length,
      satisfaccionPromedio: ultimaMetrica.satisfaccion_promedio || 0
    };
  };

  useEffect(() => {
    if (user || isDemoMode) {
      setLoading(true);
      Promise.all([
        fetchMetricasCentro(),
        fetchAlertas()
      ]).finally(() => setLoading(false));
    }
  }, [user, isDemoMode]);

  // Configurar realtime para alertas (solo en modo real)
  useEffect(() => {
    if (!user || isDemoMode) return;

    const channel = supabase
      .channel('alertas_sistema_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'alertas_sistema'
        },
        (payload) => {
          setAlertas(prev => [payload.new as AlertaSistema, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'alertas_sistema'
        },
        (payload) => {
          setAlertas(prev => prev.map(alerta => 
            alerta.id === payload.new.id ? payload.new as AlertaSistema : alerta
          ));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    metricasCentro,
    alertas,
    loading,
    error,
    fetchMetricasCentro,
    fetchAlertas,
    resolverAlerta,
    crearAlerta,
    getEstadisticasResumen
  };
};