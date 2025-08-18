-- Primero, eliminar el paciente duplicado
DELETE FROM public.pacientes 
WHERE id = '550e8400-e29b-41d4-a716-446655440001';

-- Luego actualizar las URLs de imágenes correctamente con los IDs exactos
UPDATE public.pacientes 
SET imagen_url = '/assets/patients/maria-gonzalez-elderly.jpg'
WHERE id = '550e8400-e29b-41d4-a716-446655440002';

UPDATE public.pacientes 
SET imagen_url = '/assets/patients/carlos-rodriguez-elderly.jpg'
WHERE id = '550e8400-e29b-41d4-a716-446655440004';

UPDATE public.pacientes 
SET imagen_url = '/assets/patients/ana-martinez-elderly.jpg'
WHERE id = '550e8400-e29b-41d4-a716-446655440006';

UPDATE public.pacientes 
SET imagen_url = '/assets/patients/roberto-lopez-elderly.jpg'
WHERE id = '550e8400-e29b-41d4-a716-446655440003';

UPDATE public.pacientes 
SET imagen_url = '/assets/patients/lucia-torres-final.jpg'
WHERE id = '550e8400-e29b-41d4-a716-446655440005';

-- También corregir los nombres para que coincidan con demoData.ts
UPDATE public.pacientes 
SET nombre = 'María', apellido = 'González Ruiz'
WHERE id = '550e8400-e29b-41d4-a716-446655440002';

UPDATE public.pacientes 
SET nombre = 'Carlos', apellido = 'Rodríguez López'
WHERE id = '550e8400-e29b-41d4-a716-446655440004';

UPDATE public.pacientes 
SET nombre = 'Ana', apellido = 'Martínez Sánchez'
WHERE id = '550e8400-e29b-41d4-a716-446655440006';

UPDATE public.pacientes 
SET nombre = 'Roberto', apellido = 'López Torres'
WHERE id = '550e8400-e29b-41d4-a716-446655440003';

UPDATE public.pacientes 
SET nombre = 'Lucía', apellido = 'Torres Vargas'
WHERE id = '550e8400-e29b-41d4-a716-446655440005';