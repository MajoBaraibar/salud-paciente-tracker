-- Corregir función para establecer search_path
CREATE OR REPLACE FUNCTION public.generar_numero_factura()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  nuevo_numero TEXT;
  contador INTEGER;
BEGIN
  -- Obtener el contador actual del año
  SELECT COALESCE(MAX(CAST(SUBSTRING(numero_factura FROM 'F(\d+)-') AS INTEGER)), 0) + 1
  INTO contador
  FROM public.facturas
  WHERE numero_factura LIKE 'F%-' || EXTRACT(YEAR FROM CURRENT_DATE);
  
  -- Generar el número de factura
  nuevo_numero := 'F' || LPAD(contador::TEXT, 6, '0') || '-' || EXTRACT(YEAR FROM CURRENT_DATE);
  
  RETURN nuevo_numero;
END;
$$;