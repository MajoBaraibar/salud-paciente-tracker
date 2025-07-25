-- Agregar campo de visibilidad para familiares en notas de enfermería
ALTER TABLE public.notas_enfermeria 
ADD COLUMN visible_para_familiar boolean NOT NULL DEFAULT false;