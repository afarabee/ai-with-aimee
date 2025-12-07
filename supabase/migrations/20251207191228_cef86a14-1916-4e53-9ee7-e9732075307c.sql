-- Add excerpt column to projects table
ALTER TABLE public.projects ADD COLUMN excerpt TEXT DEFAULT '';