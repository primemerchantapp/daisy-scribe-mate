
-- Create table for storing scribe notes if it doesn't exist
CREATE TABLE IF NOT EXISTS public.scribe_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name TEXT NOT NULL,
  transcript TEXT,
  ai_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row level security
ALTER TABLE public.scribe_notes ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (for demo purposes)
CREATE POLICY "Allow public access to scribe_notes" 
  ON public.scribe_notes 
  USING (true);
