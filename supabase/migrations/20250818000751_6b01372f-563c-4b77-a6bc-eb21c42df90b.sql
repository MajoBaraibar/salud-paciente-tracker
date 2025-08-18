-- Solo actualizar la restricción de tipos de cita
ALTER TABLE citas_medicas DROP CONSTRAINT IF EXISTS check_tipo_cita;

-- Expandir los tipos de cita permitidos
ALTER TABLE citas_medicas ADD CONSTRAINT check_tipo_cita 
CHECK (tipo_cita IN (
  'consulta', 'control', 'procedimiento', 'emergencia',
  'interconsulta', 'junta_medica', 'seguimiento', 
  'reunion_staff', 'capacitacion', 'supervision', 'procedimiento_enfermeria',
  'reunion_familia', 'auditoria', 'capacitacion_staff', 'evaluacion'
));