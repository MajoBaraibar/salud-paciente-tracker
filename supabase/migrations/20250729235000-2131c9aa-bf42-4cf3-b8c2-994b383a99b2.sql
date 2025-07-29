-- Agregar columna de stock a la tabla requisiciones
ALTER TABLE public.requisiciones 
ADD COLUMN stock INTEGER DEFAULT 0;

-- Actualizar algunos registros existentes con valores de stock de ejemplo
UPDATE public.requisiciones 
SET stock = CASE 
  WHEN nombre ILIKE '%tensiómetro%' THEN 5
  WHEN nombre ILIKE '%glucómetro%' THEN 3
  WHEN nombre ILIKE '%silla%' THEN 2
  WHEN nombre ILIKE '%medicamento%' THEN 25
  WHEN nombre ILIKE '%material%' THEN 50
  ELSE 10
END
WHERE stock = 0;