-- Solo actualizar las fotos de los pacientes
UPDATE pacientes SET 
  imagen_url = '/src/assets/patients/maria-gonzalez.jpg',
  nombre = 'María del Carmen',
  apellido = 'González',
  fecha_nacimiento = '1948-03-15',
  genero = 'femenino'
WHERE id = (SELECT id FROM pacientes LIMIT 1 OFFSET 0);

UPDATE pacientes SET 
  imagen_url = '/src/assets/patients/carlos-rodriguez.jpg',
  nombre = 'Carlos Alberto',
  apellido = 'Rodríguez',
  fecha_nacimiento = '1943-07-22',
  genero = 'masculino'
WHERE id = (SELECT id FROM pacientes LIMIT 1 OFFSET 1);

UPDATE pacientes SET 
  imagen_url = '/src/assets/patients/ana-martinez.jpg',
  nombre = 'Ana Isabel',
  apellido = 'Martínez',
  fecha_nacimiento = '1945-11-08',
  genero = 'femenino'
WHERE id = (SELECT id FROM pacientes LIMIT 1 OFFSET 2);

UPDATE pacientes SET 
  imagen_url = '/src/assets/patients/roberto-lopez.jpg',
  nombre = 'Roberto',
  apellido = 'López Silva',
  fecha_nacimiento = '1941-01-30',
  genero = 'masculino'
WHERE id = (SELECT id FROM pacientes LIMIT 1 OFFSET 3);

-- Insertar datos de requisiciones con estados válidos
INSERT INTO requisiciones (
  nombre, cantidad, categoria_id, prioridad, notas, estado, solicitado_por, stock, centro_id
) VALUES 
(
  'Jeringas desechables 10ml',
  50,
  (SELECT id FROM categorias_requisiciones LIMIT 1),
  'alta',
  'Necesarias para aplicación de medicamentos inyectables. Stock crítico.',
  'pendiente',
  gen_random_uuid(),
  8,
  (SELECT id FROM centros_salud LIMIT 1)
),
(
  'Guantes de nitrilo talla M',
  200,
  (SELECT id FROM categorias_requisiciones LIMIT 1),
  'alta',
  'Para exámenes médicos y procedimientos. Casi agotados.',
  'pendiente',
  gen_random_uuid(),
  15,
  (SELECT id FROM centros_salud LIMIT 1)
);