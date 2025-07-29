-- Arreglar el search_path en las funciones existentes
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.can_access_patient(patient_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
  user_patient_id UUID;
BEGIN
  SELECT role, paciente_id INTO user_role, user_patient_id 
  FROM public.profiles WHERE id = auth.uid();
  
  -- Admins y personal médico pueden acceder a todos los pacientes
  IF user_role IN ('admin', 'medico', 'enfermera') THEN
    RETURN TRUE;
  END IF;
  
  -- Familiares solo pueden acceder a su paciente asignado
  IF user_role = 'familiar' AND user_patient_id = patient_id THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_centro_id()
RETURNS uuid
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT centro_id FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, nombre, apellido)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'familiar'),
    NEW.raw_user_meta_data->>'nombre',
    NEW.raw_user_meta_data->>'apellido'
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.generar_metricas_diarias()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Insertar datos de ejemplo para métricas (últimos 30 días)
DO $$
DECLARE
  centro_uuid UUID;
BEGIN
  -- Obtener el ID del primer centro activo
  SELECT id INTO centro_uuid FROM public.centros_salud WHERE activo = true LIMIT 1;
  
  IF centro_uuid IS NOT NULL THEN
    -- Insertar métricas para los últimos 30 días
    INSERT INTO public.metricas_centro (centro_id, fecha, total_pacientes, nuevos_pacientes, consultas_realizadas, emergencias_atendidas, ocupacion_porcentaje, satisfaccion_promedio, ingresos_diarios, gastos_diarios)
    SELECT 
      centro_uuid,
      date_val,
      15 + (random() * 10)::int,
      (random() * 3)::int,
      5 + (random() * 15)::int,
      (random() * 3)::int,
      60 + (random() * 30),
      4.2 + (random() * 0.6),
      1500 + (random() * 1000),
      800 + (random() * 400)
    FROM generate_series(CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE, INTERVAL '1 day') AS date_val
    ON CONFLICT (centro_id, fecha) DO NOTHING;

    -- Insertar algunas alertas de ejemplo
    INSERT INTO public.alertas_sistema (centro_id, tipo, titulo, descripcion, prioridad)
    VALUES 
      (centro_uuid, 'critica', 'Paciente en estado crítico', 'Signos vitales alarmantes en habitación 101', 4),
      (centro_uuid, 'importante', 'Medicamento próximo a vencer', 'Stock de insulina expira en 3 días', 3),
      (centro_uuid, 'medicamento', 'Hora de medicación', 'Paciente María González - Metformina 8:00 AM', 2),
      (centro_uuid, 'informativa', 'Revisión médica programada', 'Control rutinario paciente en habitación 205', 1),
      (centro_uuid, 'importante', 'Falta de personal', 'Turno de noche requiere enfermera adicional', 3);
  END IF;
END
$$;