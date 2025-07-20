-- Crear tabla de centros de salud
CREATE TABLE public.centros_salud (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  direccion TEXT NOT NULL,
  telefono TEXT,
  email TEXT,
  codigo_identificacion TEXT UNIQUE NOT NULL,
  configuracion JSONB DEFAULT '{}',
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Agregar centro_id a todas las tablas existentes
ALTER TABLE public.profiles ADD COLUMN centro_id UUID REFERENCES public.centros_salud(id);
ALTER TABLE public.pacientes ADD COLUMN centro_id UUID REFERENCES public.centros_salud(id);
ALTER TABLE public.entradas_historial ADD COLUMN centro_id UUID REFERENCES public.centros_salud(id);
ALTER TABLE public.notas_enfermeria ADD COLUMN centro_id UUID REFERENCES public.centros_salud(id);
ALTER TABLE public.contactos_emergencia ADD COLUMN centro_id UUID REFERENCES public.centros_salud(id);
ALTER TABLE public.pagos ADD COLUMN centro_id UUID REFERENCES public.centros_salud(id);
ALTER TABLE public.requisiciones ADD COLUMN centro_id UUID REFERENCES public.centros_salud(id);

-- Habilitar RLS en centros_salud
ALTER TABLE public.centros_salud ENABLE ROW LEVEL SECURITY;

-- Función para obtener el centro del usuario actual
CREATE OR REPLACE FUNCTION public.get_current_user_centro_id()
 RETURNS UUID
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  SELECT centro_id FROM public.profiles WHERE id = auth.uid();
$function$;

-- Políticas para centros_salud
CREATE POLICY "Usuarios pueden ver su centro" 
ON public.centros_salud 
FOR SELECT 
USING (id = get_current_user_centro_id());

-- Actualizar políticas existentes para incluir centro_id
DROP POLICY IF EXISTS "Acceso basado en rol y relación" ON public.pacientes;
CREATE POLICY "Acceso a pacientes por centro" 
ON public.pacientes 
FOR SELECT 
USING (centro_id = get_current_user_centro_id() AND can_access_patient(id));

DROP POLICY IF EXISTS "Personal médico y admins pueden crear pacientes" ON public.pacientes;
CREATE POLICY "Personal médico puede crear pacientes en su centro" 
ON public.pacientes 
FOR INSERT 
WITH CHECK (
  get_current_user_role() = ANY (ARRAY['admin'::text, 'medico'::text, 'enfermera'::text]) 
  AND centro_id = get_current_user_centro_id()
);

DROP POLICY IF EXISTS "Personal médico y admins pueden actualizar pacientes" ON public.pacientes;
CREATE POLICY "Personal médico puede actualizar pacientes en su centro" 
ON public.pacientes 
FOR UPDATE 
USING (
  get_current_user_role() = ANY (ARRAY['admin'::text, 'medico'::text, 'enfermera'::text]) 
  AND centro_id = get_current_user_centro_id()
);

-- Trigger para actualizar timestamps en centros_salud
CREATE TRIGGER update_centros_salud_updated_at
BEFORE UPDATE ON public.centros_salud
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insertar centros de ejemplo
INSERT INTO public.centros_salud (nombre, direccion, telefono, email, codigo_identificacion) VALUES 
('Health Center 1', 'Av. Principal 123', '+1234567890', 'admin@healthcenter1.com', 'HC001'),
('Health Center 2', 'Calle Secundaria 456', '+0987654321', 'admin@healthcenter2.com', 'HC002'),
('Health Center 3', 'Carrera 78 #15-42', '+1122334455', 'admin@healthcenter3.com', 'HC003');