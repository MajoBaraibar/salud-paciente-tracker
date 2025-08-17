-- Limpiar datos existentes e insertar datos de muestra consistentes
DELETE FROM citas_medicas;
DELETE FROM entradas_historial;
DELETE FROM notas_enfermeria;
DELETE FROM contactos_emergencia;
DELETE FROM pagos;
DELETE FROM requisiciones;
DELETE FROM medicamentos;
DELETE FROM pacientes;
DELETE FROM profiles;
DELETE FROM especialidades;

-- Insertar centro de salud
INSERT INTO centros_salud (id, nombre, direccion, telefono, email, codigo_identificacion) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Centro Geriátrico Ensuma', 'Carrera 15 #45-67, Bogotá', '+57 1 234 5678', 'info@ensuma.com', 'ENSUMA001')
ON CONFLICT (id) DO UPDATE SET
nombre = EXCLUDED.nombre,
direccion = EXCLUDED.direccion,
telefono = EXCLUDED.telefono,
email = EXCLUDED.email;

-- Insertar especialidades
INSERT INTO especialidades (id, nombre, descripcion) VALUES 
('e50e8400-e29b-41d4-a716-446655440001', 'Geriatría', 'Atención médica especializada en adultos mayores'),
('e50e8400-e29b-41d4-a716-446655440002', 'Medicina Interna', 'Diagnóstico y tratamiento de enfermedades internas'),
('e50e8400-e29b-41d4-a716-446655440003', 'Cardiología', 'Especialidad en enfermedades del corazón'),
('e50e8400-e29b-41d4-a716-446655440004', 'Fisioterapia', 'Rehabilitación y terapia física');

-- Insertar perfiles de usuarios (médicos, enfermeras, admin) con UUIDs válidos
INSERT INTO profiles (id, email, role, nombre, apellido, especialidad, centro_id) VALUES 
('550e8400-e29b-41d4-a716-446655440011', 'admin@ensuma.com', 'admin', 'María', 'Rodríguez', 'Administración', '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440012', 'medico@ensuma.com', 'medico', 'Carlos', 'Mendoza', 'Geriatría', '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440013', 'medico2@ensuma.com', 'medico', 'Ana Patricia', 'González', 'Medicina Interna', '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440014', 'enfermera@ensuma.com', 'enfermera', 'Carmen', 'López', 'Enfermería', '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440015', 'enfermera2@ensuma.com', 'enfermera', 'Patricia', 'Silva', 'Enfermería', '550e8400-e29b-41d4-a716-446655440000');

-- Insertar pacientes
INSERT INTO pacientes (id, nombre, apellido, fecha_nacimiento, genero, numero_identificacion, telefono, direccion, centro_id) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'María Elena', 'García Rodríguez', '1938-03-15', 'femenino', '12345678', '+57 300 123 4567', 'Carrera 15 #45-67, Bogotá', '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440002', 'José Antonio', 'Martínez López', '1942-07-22', 'masculino', '87654321', '+57 310 987 6543', 'Calle 32 #18-45, Medellín', '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440003', 'Ana Lucía', 'López Hernández', '1945-11-08', 'femenino', '11223344', '+57 320 555 7890', 'Avenida 68 #25-34, Cali', '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440004', 'Roberto Carlos', 'Pérez Gómez', '1940-05-18', 'masculino', '34567890', '+57 315 234 5678', 'Transversal 45 #67-89, Barranquilla', '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440005', 'Carmen Rosa', 'Díaz Morales', '1943-09-30', 'femenino', '45678901', '+57 301 345 6789', 'Diagonal 34 #12-56, Bucaramanga', '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440006', 'Luis Fernando', 'González Silva', '1941-12-03', 'masculino', '56789012', '+57 305 456 7890', 'Carrera 7 #89-23, Pereira', '550e8400-e29b-41d4-a716-446655440000');

-- Insertar citas médicas para HOY (3 citas)
INSERT INTO citas_medicas (id, paciente_id, medico_id, especialidad_id, fecha_hora, duracion_minutos, estado, tipo_cita, motivo_consulta, centro_id, created_by) VALUES 
('c1-550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440012', 'e50e8400-e29b-41d4-a716-446655440001', CURRENT_DATE + INTERVAL '10 hours', 30, 'programada', 'consulta', 'Control mensual de diabetes', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440011'),
('c2-550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440012', 'e50e8400-e29b-41d4-a716-446655440002', CURRENT_DATE + INTERVAL '11 hours', 30, 'programada', 'consulta', 'Revisión de presión arterial', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440011'),
('c3-550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440013', 'e50e8400-e29b-41d4-a716-446655440002', CURRENT_DATE + INTERVAL '14 hours', 30, 'programada', 'consulta', 'Control post-operatorio', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440011');

-- Insertar más citas para los próximos días
INSERT INTO citas_medicas (id, paciente_id, medico_id, especialidad_id, fecha_hora, duracion_minutos, estado, tipo_cita, motivo_consulta, centro_id, created_by) VALUES 
('c4-550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440012', 'e50e8400-e29b-41d4-a716-446655440001', CURRENT_DATE + INTERVAL '1 day 9 hours', 30, 'programada', 'consulta', 'Examen de rutina', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440011'),
('c5-550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440013', 'e50e8400-e29b-41d4-a716-446655440003', CURRENT_DATE + INTERVAL '2 days 15 hours', 45, 'programada', 'consulta', 'Evaluación cardiológica', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440011'),
('c6-550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440012', 'e50e8400-e29b-41d4-a716-446655440004', CURRENT_DATE + INTERVAL '3 days 16 hours', 60, 'programada', 'terapia', 'Sesión de fisioterapia', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440011');

-- Insertar algunas citas completadas para estadísticas
INSERT INTO citas_medicas (id, paciente_id, medico_id, especialidad_id, fecha_hora, duracion_minutos, estado, tipo_cita, motivo_consulta, centro_id, created_by) VALUES 
('c7-550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440012', 'e50e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '1 day', 30, 'completada', 'consulta', 'Control de diabetes', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440011'),
('c8-550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440013', 'e50e8400-e29b-41d4-a716-446655440002', CURRENT_DATE - INTERVAL '2 days', 30, 'completada', 'consulta', 'Revisión general', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440011');

-- Insertar contactos de emergencia
INSERT INTO contactos_emergencia (id, paciente_id, nombre, relacion, telefono, email, centro_id) VALUES 
('950e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Carmen García', 'Hija', '+57 300 111 2222', 'carmen.garcia@email.com', '550e8400-e29b-41d4-a716-446655440000'),
('950e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Sandra Martínez', 'Esposa', '+57 320 555 6666', 'sandra.martinez@email.com', '550e8400-e29b-41d4-a716-446655440000'),
('950e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Pedro López', 'Hijo', '+57 315 777 8888', 'pedro.lopez@email.com', '550e8400-e29b-41d4-a716-446655440000');

-- Insertar historial médico
INSERT INTO entradas_historial (id, paciente_id, fecha, doctor_nombre, motivo_consulta, diagnostico, tratamiento, notas, tipo, centro_id, created_by) VALUES 
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '2024-01-15 09:30:00+00', 'Dr. Carlos Mendoza', 'Control rutinario mensual', 'Hipertensión arterial controlada', 'Continuar con Enalapril 10mg cada 12 horas. Dieta baja en sodio.', 'Paciente estable, presión arterial dentro de rangos normales.', 'interno', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440012'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '2024-01-20 11:00:00+00', 'Dr. Luis Ramírez', 'Revisión de diabetes', 'Diabetes tipo 2 bien controlada', 'Metformina 850mg dos veces al día. Control de glucosa diario.', 'Niveles de glucosa estables.', 'interno', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440012'),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '2024-01-25 10:30:00+00', 'Dra. Ana Patricia González', 'Examen médico general', 'Estado de salud general bueno', 'Mantener rutina de ejercicios. Suplemento de calcio y vitamina D.', 'Excelente estado físico para su edad.', 'interno', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440013');

-- Insertar notas de enfermería
INSERT INTO notas_enfermeria (id, paciente_id, enfermera_id, fecha, nota, centro_id) VALUES 
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440014', CURRENT_DATE + INTERVAL '8 hours', 'Paciente presenta buen apetito en el desayuno. Tomó todos sus medicamentos sin dificultad.', '550e8400-e29b-41d4-a716-446655440000'),
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440015', CURRENT_DATE + INTERVAL '7 hours', 'Control de glucosa en ayunas: 95 mg/dl. Excelente control diabético.', '550e8400-e29b-41d4-a716-446655440000'),
('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440014', CURRENT_DATE + INTERVAL '14 hours 30 minutes', 'Signos vitales normales. Presión arterial 120/80.', '550e8400-e29b-41d4-a716-446655440000');

-- Insertar medicamentos
INSERT INTO medicamentos (id, nombre, principio_activo, presentacion, concentracion, laboratorio, precio_unitario, stock_actual, stock_minimo, centro_id) VALUES 
('m1-550e8400-e29b-41d4-a716-446655440001', 'Enalapril', 'Enalapril', 'Tabletas', '10mg', 'Laboratorios ABC', 1200.00, 45, 10, '550e8400-e29b-41d4-a716-446655440000'),
('m2-550e8400-e29b-41d4-a716-446655440002', 'Metformina', 'Metformina', 'Tabletas', '850mg', 'Pharma Plus', 800.00, 60, 15, '550e8400-e29b-41d4-a716-446655440000'),
('m3-550e8400-e29b-41d4-a716-446655440003', 'Ibuprofeno', 'Ibuprofeno', 'Tabletas', '400mg', 'Medicol SA', 500.00, 80, 20, '550e8400-e29b-41d4-a716-446655440000');

-- Insertar pagos
INSERT INTO pagos (id, paciente_id, monto, fecha_vencimiento, fecha_pago, estado, metodo_pago, notas, centro_id) VALUES 
('a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 850000, '2024-02-01', '2024-01-28', 'pagado', 'Transferencia bancaria', 'Pago mensual de servicios de cuidado integral', '550e8400-e29b-41d4-a716-446655440000'),
('a50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 950000, '2024-02-05', NULL, 'pendiente', NULL, 'Mensualidad febrero - incluye terapias especializadas', '550e8400-e29b-41d4-a716-446655440000'),
('a50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 750000, '2024-01-15', NULL, 'atrasado', NULL, 'Pago pendiente desde enero', '550e8400-e29b-41d4-a716-446655440000');

-- Insertar métricas del centro para hoy
INSERT INTO metricas_centro (id, centro_id, fecha, total_pacientes, nuevos_pacientes, consultas_realizadas, emergencias_atendidas, ocupacion_porcentaje, satisfaccion_promedio, ingresos_diarios, gastos_diarios) VALUES 
('mc-550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', CURRENT_DATE, 6, 0, 3, 0, 85.5, 4.7, 850000, 320000);

-- Insertar alertas del sistema
INSERT INTO alertas_sistema (id, centro_id, paciente_id, tipo, titulo, descripcion, prioridad, estado, asignado_a) VALUES 
('al-550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003', 'medicacion', 'Medicación pendiente', 'Ana Lucía López requiere administración de medicamento de las 14:00', 2, 'activa', '550e8400-e29b-41d4-a716-446655440014'),
('al-550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', NULL, 'sistema', 'Stock bajo de medicamentos', 'El stock de Enalapril está por debajo del mínimo requerido', 1, 'activa', '550e8400-e29b-41d4-a716-446655440011');