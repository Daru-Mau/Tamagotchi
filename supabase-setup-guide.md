# Supabase Setup Guide for Tamagotchi App

This guide walks you through setting up your Supabase project and connecting it to your React Native Expo Tamagotchi app.

## 1. Create a Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Sign up or log in with your account
3. Click "New Project"
4. Select an organization (or create a new one)
5. Fill in the project details:
   - **Name**: Tamagotchi
   - **Database Password**: Create a strong password
   - **Region**: Choose the region closest to your users
   - **Pricing Plan**: Free tier is sufficient for development
6. Click "Create new project" and wait for it to be set up (this may take a few minutes)

## 2. Set Up Database Tables

After your project is created, you need to set up the database tables:

1. In the Supabase dashboard, go to the "SQL Editor" section
2. Click "New Query"
3. First, create the main pets table by copying and pasting the following SQL (from supabase-setup.sql):

```sql
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

-- Create Row Level Security (RLS) policies for the pets table
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own pets
CREATE POLICY "Users can view their own pets"
  ON public.pets
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own pets
CREATE POLICY "Users can create their own pets"
  ON public.pets
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own pets
CREATE POLICY "Users can update their own pets"
  ON public.pets
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own pets
CREATE POLICY "Users can delete their own pets"
  ON public.pets
  FOR DELETE
  USING (auth.uid() = user_id);
```

4. Click "Run" to execute the SQL and create the basic pets table

5. Next, create the pet_interactions table to track all the interactions with pets. This table is important for the full functionality of your Tamagotchi app. Create a new query and paste the SQL from the pet-interactions-table.sql file, or the summarized version below:

```sql
-- Create the pet_interactions table to track all interactions
CREATE TABLE IF NOT EXISTS public.pet_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  interaction_type TEXT NOT NULL, -- e.g., 'feed', 'play', 'clean', 'sleep'
  points_change INTEGER NOT NULL, -- positive or negative change to happiness/hunger
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb -- for any additional interaction data
);

-- Enable Row Level Security
ALTER TABLE public.pet_interactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for pet_interactions
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

-- Create a trigger to update pet status after interactions
CREATE OR REPLACE FUNCTION update_pet_after_interaction()
RETURNS TRIGGER AS $$
BEGIN
  -- Update pet based on interaction type
  IF NEW.interaction_type = 'feed' THEN
    UPDATE public.pets
    SET
      hunger = GREATEST(0, LEAST(100, hunger - abs(NEW.points_change))),
      happiness = LEAST(100, happiness + GREATEST(0, NEW.points_change)),
      last_interaction = NOW()
    WHERE id = NEW.pet_id;
  -- ... (other interaction types)
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pet_interaction_trigger
AFTER INSERT ON public.pet_interactions
FOR EACH ROW
EXECUTE FUNCTION update_pet_after_interaction();
```

6. Click "Run" to execute the SQL and create the pet_interactions table with its triggers

## 3. Configure Authentication

1. Go to "Authentication" > "Providers" in the Supabase dashboard
2. Enable the authentication providers you want to use:
   - Email (enabled by default)
   - Social providers (optional)

## 4. Get Your Supabase Credentials

1. Go to "Project Settings" > "API" in the dashboard
2. You'll find:
   - **Project URL**: Starts with `https://` and ends with `.supabase.co`
   - **anon/public** key: A long string for unauthenticated requests

## 5. Update Your App's Environment Configuration

Update your app's environment configuration with your Supabase credentials:

1. Option 1: Run the setup script:

   ```
   node setup-supabase-credentials.js
   ```

2. Option 2: Manually edit `frontend/src/config/env.ts`:
   ```typescript
   export const SUPABASE_URL = "https://your-project-id.supabase.co";
   export const SUPABASE_ANON_KEY = "your-anon-key";
   ```

## 6. Test Your Supabase Connection

Run the test script to verify your connection:

```bash
cd frontend
node test-supabase.js
```

If successful, you should see a "Supabase connection successful!" message.

## 7. Common Supabase Operations

Here are some common operations you can perform with Supabase:

### Fetching Data

```typescript
const { data, error } = await supabase
  .from("pets")
  .select("*")
  .eq("user_id", userId);
```

### Inserting Data

```typescript
const { data, error } = await supabase
  .from("pets")
  .insert([{ name: "Fluffy", pet_type: "cat", user_id: userId }]);
```

### Updating Data

```typescript
const { data, error } = await supabase
  .from("pets")
  .update({ happiness: 100 })
  .eq("id", petId);
```

### Deleting Data

```typescript
const { data, error } = await supabase.from("pets").delete().eq("id", petId);
```

### Authentication

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: "user@example.com",
  password: "password123",
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "password123",
});

// Sign out
const { error } = await supabase.auth.signOut();
```

## 8. Troubleshooting

- **CORS Issues**: Ensure your app's domain is added to the allowed list in Project Settings > API > CORS Configuration
- **Authentication Errors**: Double-check your credentials and confirm that the auth providers are correctly set up
- **Database Errors**: Check the RLS policies to ensure users have the right permissions to access data
- **Missing Tables**: Re-run the SQL setup script if tables are missing

## 9. Next Steps

1. Implement user authentication in your app
2. Test CRUD operations on the pets table
3. Deploy your app for production use

For more information, refer to the [Supabase documentation](https://supabase.com/docs).
