-- Insertar requisiciones de ejemplo para mostrar en el perfil médico
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
  (SELECT id FROM profiles WHERE role = 'medico' LIMIT 1),
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
  (SELECT id FROM profiles WHERE role = 'medico' LIMIT 1),
  15,
  (SELECT id FROM centros_salud LIMIT 1)
),
(
  'Tensiómetros digitales',
  3,
  (SELECT id FROM categorias_requisiciones LIMIT 1),
  'media',
  'Reemplazo de equipos defectuosos en consultorios.',
  'aprobada',
  (SELECT id FROM profiles WHERE role = 'medico' LIMIT 1),
  2,
  (SELECT id FROM centros_salud LIMIT 1)
),
(
  'Vendas elásticas 10cm',
  30,
  (SELECT id FROM categorias_requisiciones LIMIT 1),
  'media',
  'Para tratamientos de fisioterapia y ortopedia.',
  'pendiente',
  (SELECT id FROM profiles WHERE role = 'enfermera' LIMIT 1),
  12,
  (SELECT id FROM centros_salud LIMIT 1)
),
(
  'Alcohol isopropílico 70%',
  10,
  (SELECT id FROM categorias_requisiciones LIMIT 1),
  'alta',
  'Desinfección de equipos médicos. Consumo diario alto.',
  'aprobada',
  (SELECT id FROM profiles WHERE role = 'enfermera' LIMIT 1),
  6,
  (SELECT id FROM centros_salud LIMIT 1)
);