-- Insertar perfiles de prueba para que el sistema funcione
INSERT INTO public.profiles (id, email, role, nombre, apellido, centro_id) VALUES
('medico-temp', 'medico@healthcenter.com', 'medico', 'Dr. Carlos', 'Martínez', '550e8400-e29b-41d4-a716-446655440000'),
('admin-temp', 'admin@healthcenter.com', 'admin', 'Ana', 'Rodríguez', '550e8400-e29b-41d4-a716-446655440000'),
('enfermera-temp', 'enfermera@healthcenter.com', 'enfermera', 'María', 'López', '550e8400-e29b-41d4-a716-446655440000'),
('familiar-temp', 'familiar@healthcenter.com', 'familiar', 'Ana', 'Rodríguez', '550e8400-e29b-41d4-a716-446655440000');

-- Actualizar el familiar para que tenga acceso al paciente Roberto
UPDATE public.profiles 
SET paciente_id = '550e8400-e29b-41d4-a716-446655440003'
WHERE id = 'familiar-temp';