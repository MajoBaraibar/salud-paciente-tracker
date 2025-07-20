-- Crear tabla para notas de enfermería
CREATE TABLE public.notas_enfermeria (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id UUID NOT NULL,
  enfermera_id UUID NOT NULL,
  nota TEXT NOT NULL,
  fecha TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.notas_enfermeria ENABLE ROW LEVEL SECURITY;

-- Políticas para notas de enfermería
CREATE POLICY "Personal médico puede ver notas de enfermería" 
ON public.notas_enfermeria 
FOR SELECT 
USING (get_current_user_role() = ANY (ARRAY['admin'::text, 'medico'::text, 'enfermera'::text]));

CREATE POLICY "Enfermeras pueden crear notas" 
ON public.notas_enfermeria 
FOR INSERT 
WITH CHECK (get_current_user_role() = ANY (ARRAY['enfermera'::text, 'admin'::text]) AND enfermera_id = auth.uid());

CREATE POLICY "Enfermeras pueden actualizar sus notas" 
ON public.notas_enfermeria 
FOR UPDATE 
USING (get_current_user_role() = ANY (ARRAY['enfermera'::text, 'admin'::text]) AND enfermera_id = auth.uid());

-- Actualizar políticas de entradas_historial para que solo médicos puedan modificar
DROP POLICY IF EXISTS "Personal médico puede actualizar entradas" ON public.entradas_historial;
DROP POLICY IF EXISTS "Personal médico puede crear entradas" ON public.entradas_historial;

CREATE POLICY "Solo médicos pueden crear entradas de historial" 
ON public.entradas_historial 
FOR INSERT 
WITH CHECK (get_current_user_role() = ANY (ARRAY['admin'::text, 'medico'::text]));

CREATE POLICY "Solo médicos pueden actualizar entradas de historial" 
ON public.entradas_historial 
FOR UPDATE 
USING (get_current_user_role() = ANY (ARRAY['admin'::text, 'medico'::text]));

-- Trigger para actualizar timestamps
CREATE TRIGGER update_notas_enfermeria_updated_at
BEFORE UPDATE ON public.notas_enfermeria
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();