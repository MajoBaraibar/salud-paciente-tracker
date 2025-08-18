-- Solo actualizar las fotos de los pacientes con adultos mayores
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