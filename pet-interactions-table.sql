-- Pet Interactions Table for Supabase
-- This script creates the pet_interactions table to track all interactions with pets
-- Run this in the Supabase SQL Editor

-- Create the pet_interactions table to track all interactions
CREATE TABLE IF NOT EXISTS public.pet_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  interaction_type TEXT NOT NULL, -- e.g., 'feed', 'play', 'clean', 'sleep'
  points_change INTEGER NOT NULL, -- positive or negative change to happiness/hunger
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb -- for any additional interaction data
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS pet_interactions_pet_id_idx ON public.pet_interactions(pet_id);
CREATE INDEX IF NOT EXISTS pet_interactions_type_idx ON public.pet_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS pet_interactions_created_at_idx ON public.pet_interactions(created_at);

-- Enable Row Level Security
ALTER TABLE public.pet_interactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for pet_interactions

-- Policy: Users can view interactions for their pets only
CREATE POLICY "Users can view interactions for their pets"
  ON public.pet_interactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pets 
      WHERE pets.id = pet_interactions.pet_id 
      AND pets.user_id = auth.uid()
    )
  );

-- Policy: Users can insert interactions for their pets only
CREATE POLICY "Users can insert interactions for their pets"
  ON public.pet_interactions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.pets 
      WHERE pets.id = pet_interactions.pet_id 
      AND pets.user_id = auth.uid()
    )
  );

-- Policy: Users can update interactions for their pets only (if needed)
CREATE POLICY "Users can update interactions for their pets"
  ON public.pet_interactions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.pets 
      WHERE pets.id = pet_interactions.pet_id 
      AND pets.user_id = auth.uid()
    )
  );

-- Policy: Users can delete interactions for their pets only (if needed)
CREATE POLICY "Users can delete interactions for their pets"
  ON public.pet_interactions
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.pets 
      WHERE pets.id = pet_interactions.pet_id 
      AND pets.user_id = auth.uid()
    )
  );

-- Create a function to update the pet's status after interactions
CREATE OR REPLACE FUNCTION update_pet_after_interaction()
RETURNS TRIGGER AS $$
DECLARE
  pet_record RECORD;
BEGIN
  -- Get the current pet data
  SELECT * INTO pet_record FROM public.pets WHERE id = NEW.pet_id;
  
  -- Update pet based on interaction type
  IF NEW.interaction_type = 'feed' THEN
    -- Update hunger (decrease) and happiness (potentially increase)
    UPDATE public.pets
    SET 
      hunger = GREATEST(0, LEAST(100, hunger - abs(NEW.points_change))),
      happiness = LEAST(100, happiness + GREATEST(0, NEW.points_change)),
      last_interaction = NOW()
    WHERE id = NEW.pet_id;
    
  ELSIF NEW.interaction_type = 'play' THEN
    -- Update happiness (increase) but might increase hunger slightly
    UPDATE public.pets
    SET 
      happiness = LEAST(100, happiness + abs(NEW.points_change)),
      hunger = LEAST(100, hunger + 5), -- Playing makes pets slightly hungry
      last_interaction = NOW()
    WHERE id = NEW.pet_id;
    
  ELSIF NEW.interaction_type = 'clean' THEN
    -- Just update happiness moderately
    UPDATE public.pets
    SET 
      happiness = LEAST(100, happiness + (abs(NEW.points_change) / 2)),
      last_interaction = NOW()
    WHERE id = NEW.pet_id;
    
  ELSIF NEW.interaction_type = 'sleep' THEN
    -- Might restore some happiness but not affect hunger
    UPDATE public.pets
    SET 
      happiness = LEAST(100, happiness + (abs(NEW.points_change) / 3)),
      last_interaction = NOW()
    WHERE id = NEW.pet_id;
  ELSE
    -- For any other interaction, just update the last_interaction time
    UPDATE public.pets
    SET last_interaction = NOW()
    WHERE id = NEW.pet_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to run the function after an interaction is inserted
CREATE TRIGGER pet_interaction_trigger
AFTER INSERT ON public.pet_interactions
FOR EACH ROW
EXECUTE FUNCTION update_pet_after_interaction();

-- Create a view to easily get a pet's recent interactions
CREATE OR REPLACE VIEW public.recent_pet_interactions AS
SELECT 
  p.id AS pet_id,
  p.name AS pet_name,
  p.user_id,
  pi.id AS interaction_id,
  pi.interaction_type,
  pi.points_change,
  pi.created_at,
  pi.metadata
FROM 
  public.pets p
JOIN 
  public.pet_interactions pi ON p.id = pi.pet_id
ORDER BY 
  pi.created_at DESC;

-- Grant necessary permissions
ALTER VIEW public.recent_pet_interactions OWNER TO postgres;
GRANT ALL ON public.recent_pet_interactions TO postgres;
GRANT SELECT ON public.recent_pet_interactions TO anon, authenticated;
