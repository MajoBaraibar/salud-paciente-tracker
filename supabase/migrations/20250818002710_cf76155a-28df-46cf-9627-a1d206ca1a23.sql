-- Actualizar el quinto paciente con foto de adulto mayor
UPDATE pacientes SET 
  imagen_url = '/src/assets/patients/lucia-torres.jpg',
  nombre = 'Lucía',
  apellido = 'Torres Vargas',
  fecha_nacimiento = '1944-09-12',
  genero = 'femenino'
WHERE id = (SELECT id FROM pacientes LIMIT 1 OFFSET 4);

-- Corregir la cantidad de tensiómetros digitales (1 por cada 10 pacientes aprox)
UPDATE requisiciones SET 
  stock = 1,
  cantidad = 1,
  notas = 'Reemplazo de tensiómetro defectuoso en consultorio principal.'
WHERE nombre = 'Tensiómetros digitales';