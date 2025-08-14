-- Crear tabla de especialidades médicas
CREATE TABLE public.especialidades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  activa BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de horarios médicos
CREATE TABLE public.horarios_medicos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  medico_id UUID NOT NULL,
  dia_semana INTEGER NOT NULL CHECK (dia_semana >= 0 AND dia_semana <= 6), -- 0=Domingo, 6=Sábado
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT true,
  centro_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_horario CHECK (hora_inicio < hora_fin)
);

-- Crear tabla de citas médicas
CREATE TABLE public.citas_medicas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id UUID NOT NULL,
  medico_id UUID NOT NULL,
  especialidad_id UUID,
  fecha_hora TIMESTAMP WITH TIME ZONE NOT NULL,
  duracion_minutos INTEGER NOT NULL DEFAULT 30,
  estado TEXT NOT NULL DEFAULT 'programada' CHECK (estado IN ('programada', 'confirmada', 'en_curso', 'completada', 'cancelada', 'no_asistio')),
  tipo_cita TEXT NOT NULL DEFAULT 'consulta' CHECK (tipo_cita IN ('consulta', 'control', 'procedimiento', 'emergencia')),
  motivo_consulta TEXT,
  notas_medico TEXT,
  notas_paciente TEXT,
  precio NUMERIC(10,2),
  centro_id UUID,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de medicamentos
CREATE TABLE public.medicamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  principio_activo TEXT,
  presentacion TEXT, -- tableta, jarabe, inyección, etc.
  concentracion TEXT,
  laboratorio TEXT,
  codigo_atc TEXT, -- Código Anatómico Terapéutico Químico
  requiere_receta BOOLEAN NOT NULL DEFAULT true,
  contraindicaciones TEXT,
  efectos_secundarios TEXT,
  stock_minimo INTEGER DEFAULT 10,
  stock_actual INTEGER DEFAULT 0,
  precio_unitario NUMERIC(10,2),
  activo BOOLEAN NOT NULL DEFAULT true,
  centro_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de prescripciones
CREATE TABLE public.prescripciones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id UUID NOT NULL,
  medico_id UUID NOT NULL,
  cita_id UUID,
  fecha_prescripcion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  diagnostico TEXT,
  observaciones TEXT,
  activa BOOLEAN NOT NULL DEFAULT true,
  centro_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de detalles de prescripción (medicamentos prescritos)
CREATE TABLE public.detalles_prescripcion (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prescripcion_id UUID NOT NULL,
  medicamento_id UUID NOT NULL,
  dosis TEXT NOT NULL, -- ej: "500mg"
  frecuencia TEXT NOT NULL, -- ej: "cada 8 horas"
  duracion_dias INTEGER NOT NULL,
  via_administracion TEXT, -- oral, intravenosa, etc.
  instrucciones_especiales TEXT,
  cantidad_total INTEGER NOT NULL, -- cantidad total prescrita
  cantidad_dispensada INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de facturas
CREATE TABLE public.facturas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_factura TEXT NOT NULL UNIQUE,
  paciente_id UUID NOT NULL,
  fecha_factura DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_vencimiento DATE NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  impuestos NUMERIC(10,2) NOT NULL DEFAULT 0,
  descuentos NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagada', 'vencida', 'anulada')),
  metodo_pago TEXT,
  fecha_pago DATE,
  observaciones TEXT,
  centro_id UUID,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de items de factura
CREATE TABLE public.items_factura (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  factura_id UUID NOT NULL,
  cita_id UUID,
  medicamento_id UUID,
  descripcion TEXT NOT NULL,
  cantidad INTEGER NOT NULL DEFAULT 1,
  precio_unitario NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.especialidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horarios_medicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citas_medicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescripciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detalles_prescripcion ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items_factura ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para especialidades
CREATE POLICY "Usuarios pueden ver especialidades" ON public.especialidades
  FOR SELECT USING (true);

CREATE POLICY "Admins pueden gestionar especialidades" ON public.especialidades
  FOR ALL USING (get_current_user_role() = 'admin');

-- Políticas RLS para horarios médicos
CREATE POLICY "Personal médico puede ver horarios" ON public.horarios_medicos
  FOR SELECT USING (get_current_user_role() = ANY (ARRAY['admin', 'medico', 'enfermera']));

CREATE POLICY "Médicos pueden gestionar sus horarios" ON public.horarios_medicos
  FOR ALL USING (
    get_current_user_role() = ANY (ARRAY['admin', 'medico']) AND 
    (medico_id = auth.uid() OR get_current_user_role() = 'admin')
  );

-- Políticas RLS para citas médicas
CREATE POLICY "Acceso a citas basado en paciente" ON public.citas_medicas
  FOR SELECT USING (can_access_patient(paciente_id) OR medico_id = auth.uid());

CREATE POLICY "Personal médico puede crear citas" ON public.citas_medicas
  FOR INSERT WITH CHECK (
    get_current_user_role() = ANY (ARRAY['admin', 'medico', 'enfermera'])
  );

CREATE POLICY "Personal médico puede actualizar citas" ON public.citas_medicas
  FOR UPDATE USING (
    get_current_user_role() = ANY (ARRAY['admin', 'medico', 'enfermera']) AND
    (medico_id = auth.uid() OR get_current_user_role() = 'admin')
  );

-- Políticas RLS para medicamentos
CREATE POLICY "Personal médico puede ver medicamentos" ON public.medicamentos
  FOR SELECT USING (get_current_user_role() = ANY (ARRAY['admin', 'medico', 'enfermera']));

CREATE POLICY "Admins pueden gestionar medicamentos" ON public.medicamentos
  FOR ALL USING (get_current_user_role() = 'admin');

-- Políticas RLS para prescripciones
CREATE POLICY "Acceso a prescripciones basado en paciente" ON public.prescripciones
  FOR SELECT USING (can_access_patient(paciente_id) OR medico_id = auth.uid());

CREATE POLICY "Médicos pueden crear prescripciones" ON public.prescripciones
  FOR INSERT WITH CHECK (
    get_current_user_role() = ANY (ARRAY['admin', 'medico']) AND medico_id = auth.uid()
  );

CREATE POLICY "Médicos pueden actualizar sus prescripciones" ON public.prescripciones
  FOR UPDATE USING (
    get_current_user_role() = ANY (ARRAY['admin', 'medico']) AND medico_id = auth.uid()
  );

-- Políticas RLS para detalles de prescripción
CREATE POLICY "Acceso a detalles via prescripción" ON public.detalles_prescripcion
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.prescripciones p 
      WHERE p.id = prescripcion_id AND 
      (can_access_patient(p.paciente_id) OR p.medico_id = auth.uid())
    )
  );

CREATE POLICY "Médicos pueden gestionar detalles de sus prescripciones" ON public.detalles_prescripcion
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.prescripciones p 
      WHERE p.id = prescripcion_id AND 
      get_current_user_role() = ANY (ARRAY['admin', 'medico']) AND
      (p.medico_id = auth.uid() OR get_current_user_role() = 'admin')
    )
  );

-- Políticas RLS para facturas
CREATE POLICY "Acceso a facturas basado en paciente" ON public.facturas
  FOR SELECT USING (can_access_patient(paciente_id));

CREATE POLICY "Personal autorizado puede gestionar facturas" ON public.facturas
  FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin', 'medico']));

-- Políticas RLS para items de factura
CREATE POLICY "Acceso a items via factura" ON public.items_factura
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.facturas f 
      WHERE f.id = factura_id AND can_access_patient(f.paciente_id)
    )
  );

CREATE POLICY "Personal autorizado puede gestionar items" ON public.items_factura
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.facturas f 
      WHERE f.id = factura_id AND 
      get_current_user_role() = ANY (ARRAY['admin', 'medico'])
    )
  );

-- Crear triggers para updated_at
CREATE TRIGGER update_especialidades_updated_at
  BEFORE UPDATE ON public.especialidades
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_horarios_medicos_updated_at
  BEFORE UPDATE ON public.horarios_medicos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_citas_medicas_updated_at
  BEFORE UPDATE ON public.citas_medicas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medicamentos_updated_at
  BEFORE UPDATE ON public.medicamentos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prescripciones_updated_at
  BEFORE UPDATE ON public.prescripciones
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_facturas_updated_at
  BEFORE UPDATE ON public.facturas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insertar especialidades básicas
INSERT INTO public.especialidades (nombre, descripcion) VALUES
('Medicina General', 'Atención médica general y preventiva'),
('Cardiología', 'Especialidad en enfermedades del corazón'),
('Neurología', 'Especialidad en enfermedades del sistema nervioso'),
('Pediatría', 'Atención médica especializada en niños'),
('Ginecología', 'Especialidad en salud femenina'),
('Traumatología', 'Especialidad en lesiones y enfermedades del sistema musculoesquelético'),
('Dermatología', 'Especialidad en enfermedades de la piel'),
('Oftalmología', 'Especialidad en enfermedades de los ojos');

-- Insertar medicamentos básicos
INSERT INTO public.medicamentos (nombre, principio_activo, presentacion, concentracion, requiere_receta, stock_actual, precio_unitario) VALUES
('Acetaminofén', 'Acetaminofén', 'Tableta', '500mg', false, 100, 500),
('Ibuprofeno', 'Ibuprofeno', 'Tableta', '400mg', false, 80, 800),
('Amoxicilina', 'Amoxicilina', 'Cápsula', '500mg', true, 50, 1200),
('Omeprazol', 'Omeprazol', 'Cápsula', '20mg', true, 60, 1500),
('Losartán', 'Losartán', 'Tableta', '50mg', true, 40, 2000),
('Metformina', 'Metformina', 'Tableta', '850mg', true, 70, 1800),
('Atorvastatina', 'Atorvastatina', 'Tableta', '20mg', true, 30, 2500),
('Salbutamol', 'Salbutamol', 'Inhalador', '100mcg', true, 25, 15000);

-- Función para generar número de factura
CREATE OR REPLACE FUNCTION public.generar_numero_factura()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  nuevo_numero TEXT;
  contador INTEGER;
BEGIN
  -- Obtener el contador actual del año
  SELECT COALESCE(MAX(CAST(SUBSTRING(numero_factura FROM 'F(\d+)-') AS INTEGER)), 0) + 1
  INTO contador
  FROM public.facturas
  WHERE numero_factura LIKE 'F%-' || EXTRACT(YEAR FROM CURRENT_DATE);
  
  -- Generar el número de factura
  nuevo_numero := 'F' || LPAD(contador::TEXT, 6, '0') || '-' || EXTRACT(YEAR FROM CURRENT_DATE);
  
  RETURN nuevo_numero;
END;
$$;