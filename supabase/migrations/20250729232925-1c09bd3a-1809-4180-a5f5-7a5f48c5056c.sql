-- Crear tabla para métricas y estadísticas del centro
CREATE TABLE public.metricas_centro (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  centro_id UUID NOT NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  total_pacientes INTEGER NOT NULL DEFAULT 0,
  nuevos_pacientes INTEGER NOT NULL DEFAULT 0,
  consultas_realizadas INTEGER NOT NULL DEFAULT 0,
  emergencias_atendidas INTEGER NOT NULL DEFAULT 0,
  ocupacion_porcentaje DECIMAL(5,2) NOT NULL DEFAULT 0,
  satisfaccion_promedio DECIMAL(3,2) DEFAULT NULL,
  ingresos_diarios DECIMAL(10,2) DEFAULT 0,
  gastos_diarios DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(centro_id, fecha)
);

-- Crear tabla para métricas por paciente
CREATE TABLE public.metricas_paciente (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id UUID NOT NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  signos_vitales JSONB DEFAULT '{}',
  medicamentos_tomados INTEGER DEFAULT 0,
  medicamentos_programados INTEGER DEFAULT 0,
  estado_general TEXT DEFAULT 'estable',
  notas_medicas INTEGER DEFAULT 0,
  visitas_familiares INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(paciente_id, fecha)
);

-- Crear tabla para alertas y notificaciones
CREATE TABLE public.alertas_sistema (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  centro_id UUID,
  paciente_id UUID,
  tipo TEXT NOT NULL, -- 'critica', 'importante', 'informativa', 'medicamento'
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'activa', -- 'activa', 'resuelta', 'archivada'
  prioridad INTEGER NOT NULL DEFAULT 1, -- 1 = baja, 2 = media, 3 = alta, 4 = crítica
  asignado_a UUID, -- user_id del responsable
  resuelto_por UUID,
  fecha_resolucion TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.metricas_centro ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metricas_paciente ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alertas_sistema ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para métricas_centro
CREATE POLICY "Usuarios pueden ver métricas de su centro" 
ON public.metricas_centro FOR SELECT 
USING (centro_id = get_current_user_centro_id());

CREATE POLICY "Admins pueden gestionar métricas del centro" 
ON public.metricas_centro FOR ALL 
USING (get_current_user_role() = 'admin' AND centro_id = get_current_user_centro_id());

-- Políticas RLS para métricas_paciente
CREATE POLICY "Acceso a métricas basado en paciente" 
ON public.metricas_paciente FOR SELECT 
USING (can_access_patient(paciente_id));

CREATE POLICY "Personal médico puede gestionar métricas de pacientes" 
ON public.metricas_paciente FOR ALL 
USING (get_current_user_role() = ANY (ARRAY['admin', 'medico', 'enfermera']));

-- Políticas RLS para alertas_sistema
CREATE POLICY "Usuarios pueden ver alertas de su centro" 
ON public.alertas_sistema FOR SELECT 
USING (centro_id = get_current_user_centro_id() OR can_access_patient(paciente_id));

CREATE POLICY "Personal médico puede gestionar alertas" 
ON public.alertas_sistema FOR ALL 
USING (get_current_user_role() = ANY (ARRAY['admin', 'medico', 'enfermera']));

-- Triggers para updated_at
CREATE TRIGGER update_metricas_centro_updated_at
  BEFORE UPDATE ON public.metricas_centro
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_metricas_paciente_updated_at
  BEFORE UPDATE ON public.metricas_paciente
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alertas_sistema_updated_at
  BEFORE UPDATE ON public.alertas_sistema
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Función para generar métricas diarias automáticamente
CREATE OR REPLACE FUNCTION public.generar_metricas_diarias()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insertar o actualizar métricas del centro para hoy
  INSERT INTO public.metricas_centro (
    centro_id,
    fecha,
    total_pacientes,
    nuevos_pacientes,
    consultas_realizadas,
    emergencias_atendidas,
    ocupacion_porcentaje
  )
  SELECT 
    centro_id,
    CURRENT_DATE,
    COUNT(*) as total_pacientes,
    COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) as nuevos_pacientes,
    0 as consultas_realizadas,
    0 as emergencias_atendidas,
    LEAST(100, (COUNT(*) * 100.0 / 50)) as ocupacion_porcentaje
  FROM public.pacientes 
  WHERE centro_id IS NOT NULL
  GROUP BY centro_id
  ON CONFLICT (centro_id, fecha) 
  DO UPDATE SET 
    total_pacientes = EXCLUDED.total_pacientes,
    nuevos_pacientes = EXCLUDED.nuevos_pacientes,
    ocupacion_porcentaje = EXCLUDED.ocupacion_porcentaje,
    updated_at = now();

  -- Insertar métricas básicas para pacientes que no tienen registro hoy
  INSERT INTO public.metricas_paciente (paciente_id, fecha, estado_general)
  SELECT p.id, CURRENT_DATE, 'estable'
  FROM public.pacientes p
  WHERE NOT EXISTS (
    SELECT 1 FROM public.metricas_paciente mp 
    WHERE mp.paciente_id = p.id AND mp.fecha = CURRENT_DATE
  )
  ON CONFLICT (paciente_id, fecha) DO NOTHING;
END;
$$;