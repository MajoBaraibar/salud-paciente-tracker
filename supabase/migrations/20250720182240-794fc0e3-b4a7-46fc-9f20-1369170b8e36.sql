-- Sistema de gestión médica "En Suma"
-- Crear tablas principales con RLS y relaciones apropiadas

-- 1. Tabla de perfiles de usuario (extiende auth.users)
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'medico', 'enfermera', 'familiar')),
  nombre TEXT,
  apellido TEXT,
  especialidad TEXT, -- Para médicos
  imagen_url TEXT,
  paciente_id UUID, -- Para familiares, referencia al paciente asignado
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- 2. Tabla de pacientes
CREATE TABLE public.pacientes (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  genero TEXT NOT NULL CHECK (genero IN ('masculino', 'femenino', 'otro')),
  numero_identificacion TEXT NOT NULL UNIQUE,
  telefono TEXT NOT NULL,
  direccion TEXT NOT NULL,
  imagen_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- 3. Tabla de historial médico
CREATE TABLE public.entradas_historial (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  paciente_id UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
  fecha TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  doctor_nombre TEXT NOT NULL,
  motivo_consulta TEXT NOT NULL,
  diagnostico TEXT NOT NULL,
  tratamiento TEXT NOT NULL,
  notas TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN ('interno', 'externo')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- 4. Tabla de contactos de emergencia
CREATE TABLE public.contactos_emergencia (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  paciente_id UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  relacion TEXT NOT NULL,
  telefono TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- 5. Tabla de categorías para requisiciones
CREATE TABLE public.categorias_requisiciones (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- 6. Tabla de requisiciones/inventario
CREATE TABLE public.requisiciones (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  prioridad TEXT NOT NULL CHECK (prioridad IN ('baja', 'media', 'alta')),
  notas TEXT,
  categoria_id UUID NOT NULL REFERENCES public.categorias_requisiciones(id),
  solicitado_por UUID NOT NULL REFERENCES auth.users(id),
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobado', 'rechazado', 'completado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- 7. Tabla de pagos
CREATE TABLE public.pagos (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  paciente_id UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
  monto DECIMAL(10,2) NOT NULL CHECK (monto > 0),
  fecha_vencimiento DATE NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pagado', 'pendiente', 'atrasado')),
  fecha_pago DATE,
  metodo_pago TEXT,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- 8. Tabla de familiares (relación entre usuarios y pacientes)
CREATE TABLE public.familiares (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  paciente_id UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  relacion TEXT NOT NULL,
  telefono TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id),
  UNIQUE(user_id, paciente_id)
);

-- Agregar FK de paciente_id en profiles después de crear la tabla pacientes
ALTER TABLE public.profiles 
ADD CONSTRAINT fk_profiles_paciente 
FOREIGN KEY (paciente_id) REFERENCES public.pacientes(id) ON DELETE SET NULL;

-- Insertar categorías básicas de requisiciones
INSERT INTO public.categorias_requisiciones (nombre, descripcion) VALUES
('Medicamentos', 'Medicamentos y fármacos'),
('Equipos Médicos', 'Equipos y dispositivos médicos'),
('Suministros', 'Suministros médicos generales'),
('Limpieza', 'Productos de limpieza y desinfección'),
('Oficina', 'Suministros de oficina y administrativos');

-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entradas_historial ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contactos_emergencia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias_requisiciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requisiciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.familiares ENABLE ROW LEVEL SECURITY;

-- Función para obtener el rol del usuario actual (evita recursión en RLS)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Función para verificar si el usuario puede acceder a un paciente
CREATE OR REPLACE FUNCTION public.can_access_patient(patient_id UUID)
RETURNS BOOLEAN AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- POLÍTICAS RLS

-- Políticas para profiles
CREATE POLICY "Los usuarios pueden ver su propio perfil" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Los admins pueden ver todos los perfiles" ON public.profiles
  FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Los admins pueden crear perfiles" ON public.profiles
  FOR INSERT WITH CHECK (public.get_current_user_role() = 'admin');

-- Políticas para pacientes  
CREATE POLICY "Acceso basado en rol y relación" ON public.pacientes
  FOR SELECT USING (public.can_access_patient(id));

CREATE POLICY "Personal médico y admins pueden crear pacientes" ON public.pacientes
  FOR INSERT WITH CHECK (public.get_current_user_role() IN ('admin', 'medico', 'enfermera'));

CREATE POLICY "Personal médico y admins pueden actualizar pacientes" ON public.pacientes
  FOR UPDATE USING (public.get_current_user_role() IN ('admin', 'medico', 'enfermera'));

-- Políticas para historial médico
CREATE POLICY "Acceso a historial basado en paciente" ON public.entradas_historial
  FOR SELECT USING (public.can_access_patient(paciente_id));

CREATE POLICY "Personal médico puede crear entradas" ON public.entradas_historial
  FOR INSERT WITH CHECK (public.get_current_user_role() IN ('admin', 'medico', 'enfermera'));

CREATE POLICY "Personal médico puede actualizar entradas" ON public.entradas_historial
  FOR UPDATE USING (public.get_current_user_role() IN ('admin', 'medico', 'enfermera'));

-- Políticas para contactos de emergencia
CREATE POLICY "Acceso a contactos basado en paciente" ON public.contactos_emergencia
  FOR SELECT USING (public.can_access_patient(paciente_id));

CREATE POLICY "Personal médico puede gestionar contactos" ON public.contactos_emergencia
  FOR ALL USING (public.get_current_user_role() IN ('admin', 'medico', 'enfermera'));

-- Políticas para categorías (acceso general para usuarios autenticados)
CREATE POLICY "Usuarios autenticados pueden ver categorías" ON public.categorias_requisiciones
  FOR SELECT TO authenticated USING (true);

-- Políticas para requisiciones
CREATE POLICY "Usuarios pueden ver sus requisiciones" ON public.requisiciones
  FOR SELECT USING (solicitado_por = auth.uid() OR public.get_current_user_role() IN ('admin', 'enfermera'));

CREATE POLICY "Usuarios autenticados pueden crear requisiciones" ON public.requisiciones
  FOR INSERT WITH CHECK (solicitado_por = auth.uid());

CREATE POLICY "Solo enfermeras y admins pueden actualizar requisiciones" ON public.requisiciones
  FOR UPDATE USING (public.get_current_user_role() IN ('admin', 'enfermera'));

-- Políticas para pagos
CREATE POLICY "Acceso a pagos basado en paciente" ON public.pagos
  FOR SELECT USING (public.can_access_patient(paciente_id));

CREATE POLICY "Admins pueden gestionar pagos" ON public.pagos
  FOR ALL USING (public.get_current_user_role() = 'admin');

-- Políticas para familiares
CREATE POLICY "Usuarios pueden ver su relación familiar" ON public.familiares
  FOR SELECT USING (user_id = auth.uid() OR public.get_current_user_role() IN ('admin', 'medico', 'enfermera'));

CREATE POLICY "Admins pueden gestionar relaciones familiares" ON public.familiares
  FOR ALL USING (public.get_current_user_role() = 'admin');

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas con updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pacientes_updated_at BEFORE UPDATE ON public.pacientes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_entradas_historial_updated_at BEFORE UPDATE ON public.entradas_historial
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contactos_emergencia_updated_at BEFORE UPDATE ON public.contactos_emergencia
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_requisiciones_updated_at BEFORE UPDATE ON public.requisiciones
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pagos_updated_at BEFORE UPDATE ON public.pagos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_familiares_updated_at BEFORE UPDATE ON public.familiares
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para crear perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();