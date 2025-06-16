/* This script helps you set up the necessary tables in Supabase
 You can use this as a guide to manually create the tables in the Supabase dashboard

  Run this script in the Supabase SQL Editor to create the necessary tables
  The auth.users table is automatically created by Supabase
*/

-- Create the pets table
CREATE TABLE IF NOT EXISTS public.pets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  pet_type TEXT NOT NULL,
  age INTEGER DEFAULT 0,
  happiness INTEGER DEFAULT 100,
  hunger INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_interaction TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS pets_user_id_idx ON public.pets(user_id);

-- Set up RLS (Row Level Security) policies
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own pets
CREATE POLICY "Users can view their own pets"
  ON public.pets
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own pets
CREATE POLICY "Users can insert their own pets"
  ON public.pets
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own pets
CREATE POLICY "Users can update their own pets"
  ON public.pets
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own pets
CREATE POLICY "Users can delete their own pets"
  ON public.pets
  FOR DELETE
  USING (auth.uid() = user_id);

-- Example triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_interaction = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pet_timestamp
BEFORE UPDATE ON public.pets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
