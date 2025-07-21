-- Crear tabla para resultados de exámenes
CREATE TABLE public.resultados_examenes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id UUID NOT NULL,
  medico_id UUID NOT NULL,
  nombre_examen TEXT NOT NULL,
  descripcion TEXT,
  archivo_url TEXT,
  archivo_nombre TEXT,
  fecha_examen DATE NOT NULL,
  fecha_subida TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  tipo_examen TEXT NOT NULL DEFAULT 'laboratorio', -- laboratorio, imagen, especializado
  estado TEXT NOT NULL DEFAULT 'normal', -- normal, anormal, critico
  observaciones TEXT,
  centro_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.resultados_examenes ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso
CREATE POLICY "Acceso a resultados basado en paciente" 
ON public.resultados_examenes 
FOR SELECT 
USING (can_access_patient(paciente_id));

CREATE POLICY "Solo médicos pueden crear resultados" 
ON public.resultados_examenes 
FOR INSERT 
WITH CHECK (
  get_current_user_role() = ANY (ARRAY['admin'::text, 'medico'::text]) 
  AND medico_id = auth.uid()
);

CREATE POLICY "Solo médicos pueden actualizar resultados" 
ON public.resultados_examenes 
FOR UPDATE 
USING (
  get_current_user_role() = ANY (ARRAY['admin'::text, 'medico'::text]) 
  AND medico_id = auth.uid()
);

-- Trigger para updated_at
CREATE TRIGGER update_resultados_examenes_updated_at
BEFORE UPDATE ON public.resultados_examenes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Crear bucket para almacenar archivos de exámenes
INSERT INTO storage.buckets (id, name, public) VALUES ('examenes', 'examenes', false);

-- Políticas de storage para exámenes
CREATE POLICY "Médicos pueden subir archivos de exámenes" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'examenes' 
  AND get_current_user_role() = ANY (ARRAY['admin'::text, 'medico'::text])
);

CREATE POLICY "Acceso a archivos de exámenes basado en paciente" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'examenes' 
  AND (
    get_current_user_role() = ANY (ARRAY['admin'::text, 'medico'::text, 'enfermera'::text])
    OR EXISTS (
      SELECT 1 FROM public.resultados_examenes 
      WHERE archivo_url = storage.objects.name 
      AND can_access_patient(paciente_id)
    )
  )
);