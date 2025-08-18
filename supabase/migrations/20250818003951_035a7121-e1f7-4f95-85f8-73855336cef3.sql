-- Insertar perfiles de prueba con UUIDs válidos
INSERT INTO public.profiles (id, email, role, nombre, apellido, centro_id) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'medico@healthcenter.com', 'medico', 'Dr. Carlos', 'Martínez', '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440011', 'admin@healthcenter.com', 'admin', 'Ana', 'Rodríguez', '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440012', 'enfermera@healthcenter.com', 'enfermera', 'María', 'López', '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440013', 'familiar@healthcenter.com', 'familiar', 'Ana', 'Rodríguez', '550e8400-e29b-41d4-a716-446655440000');

-- Actualizar el familiar para que tenga acceso al paciente Roberto
UPDATE public.profiles 
SET paciente_id = '550e8400-e29b-41d4-a716-446655440003'
WHERE id = '550e8400-e29b-41d4-a716-446655440013';