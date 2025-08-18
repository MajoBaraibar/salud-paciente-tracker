-- Actualizar las URLs de imágenes de todos los pacientes con fotos de adultos mayores
UPDATE public.pacientes 
SET imagen_url = '/assets/patients/maria-gonzalez-elderly.jpg'
WHERE nombre = 'María' AND apellido = 'González Ruiz';

UPDATE public.pacientes 
SET imagen_url = '/assets/patients/carlos-rodriguez-elderly.jpg'
WHERE nombre = 'Carlos' AND apellido = 'Rodríguez López';

UPDATE public.pacientes 
SET imagen_url = '/assets/patients/ana-martinez-elderly.jpg'
WHERE nombre = 'Ana' AND apellido = 'Martínez Sánchez';

UPDATE public.pacientes 
SET imagen_url = '/assets/patients/roberto-lopez-elderly.jpg'
WHERE nombre = 'Roberto' AND apellido = 'López Torres';

UPDATE public.pacientes 
SET imagen_url = '/assets/patients/lucia-torres-final.jpg'
WHERE nombre = 'Lucía' AND apellido = 'Torres Vargas';