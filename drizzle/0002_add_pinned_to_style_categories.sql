-- Add pinned column to style_categories table
ALTER TABLE style_categories ADD COLUMN IF NOT EXISTS pinned INTEGER DEFAULT 0;