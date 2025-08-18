-- Corregir la migración anterior - el campo medico_id no puede ser NULL
-- Primero actualizar la restricción de tipos de cita

ALTER TABLE citas_medicas DROP CONSTRAINT IF EXISTS check_tipo_cita;

-- Expandir los tipos de cita permitidos
ALTER TABLE citas_medicas ADD CONSTRAINT check_tipo_cita 
CHECK (tipo_cita IN (
  'consulta', 'control', 'procedimiento', 'emergencia',
  'interconsulta', 'junta_medica', 'seguimiento', 
  'reunion_staff', 'capacitacion', 'supervision', 'procedimiento_enfermeria',
  'reunion_familia', 'auditoria', 'capacitacion_staff', 'evaluacion'
));

-- Insertar citas de ejemplo con los nuevos tipos (todas con medico_id válido)
INSERT INTO citas_medicas (
  paciente_id, medico_id, fecha_hora, duracion_minutos, estado, tipo_cita, 
  motivo_consulta, centro_id, created_by
) VALUES 
-- Citas para médicos
(
  (SELECT id FROM pacientes LIMIT 1 OFFSET 0),
  (SELECT id FROM profiles WHERE role = 'medico' LIMIT 1),
  '2025-01-20 10:00:00+00', 60, 'programada', 'interconsulta',
  'Interconsulta cardiológica para paciente hipertenso',
  (SELECT id FROM centros_salud LIMIT 1),
  (SELECT id FROM profiles WHERE role = 'medico' LIMIT 1)
),
(
  (SELECT id FROM pacientes LIMIT 1 OFFSET 1),
  (SELECT id FROM profiles WHERE role = 'medico' LIMIT 1),
  '2025-01-20 14:00:00+00', 90, 'programada', 'junta_medica',
  'Junta médica para discusión de caso complejo',
  (SELECT id FROM centros_salud LIMIT 1),
  (SELECT id FROM profiles WHERE role = 'medico' LIMIT 1)
),
-- Citas para enfermeras (usar medico_id de la enfermera)
(
  (SELECT id FROM pacientes LIMIT 1 OFFSET 2),
  (SELECT id FROM profiles WHERE role = 'enfermera' LIMIT 1),
  '2025-01-20 08:00:00+00', 60, 'programada', 'reunion_staff',
  'Reunión semanal del equipo de enfermería',
  (SELECT id FROM centros_salud LIMIT 1),
  (SELECT id FROM profiles WHERE role = 'enfermera' LIMIT 1)
),
(
  (SELECT id FROM pacientes LIMIT 1 OFFSET 3),
  (SELECT id FROM profiles WHERE role = 'enfermera' LIMIT 1),
  '2025-01-21 15:00:00+00', 120, 'programada', 'capacitacion',
  'Capacitación en nuevos protocolos de medicación',
  (SELECT id FROM centros_salud LIMIT 1),
  (SELECT id FROM profiles WHERE role = 'enfermera' LIMIT 1)
),
-- Citas administrativas (usar admin como "responsable")
(
  (SELECT id FROM pacientes LIMIT 1 OFFSET 4),
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
  '2025-01-20 16:00:00+00', 45, 'programada', 'reunion_familia',
  'Reunión con familia para discutir plan de cuidados',
  (SELECT id FROM centros_salud LIMIT 1),
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
);