-- Run this SQL in your Supabase SQL Editor to set up the database schema

-- 1. Profiles table (extends Supabase Auth users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  phone_number TEXT,
  department TEXT,
  year_of_study TEXT,
  licence_id TEXT,
  encoded_image TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Rides table
CREATE TABLE rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  phone TEXT,
  leaving TEXT,
  car_number TEXT,
  going TEXT,
  available_seats INTEGER,
  price NUMERIC,
  car_name TEXT,
  date DATE,
  start_time TIME,
  end_time TIME,
  ride_completion_status TEXT DEFAULT 'no',
  location_first_name TEXT,
  going_location_first_name TEXT,
  leaving_from_latitude DOUBLE PRECISION,
  leaving_from_longitude DOUBLE PRECISION,
  going_to_latitude DOUBLE PRECISION,
  going_to_longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE rides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view rides"
  ON rides FOR SELECT
  USING (true);

CREATE POLICY "Drivers can insert rides"
  ON rides FOR INSERT
  WITH CHECK (auth.uid() = driver_id);

CREATE POLICY "Drivers can update own rides"
  ON rides FOR UPDATE
  USING (auth.uid() = driver_id);

-- 3. Ride history table (booking records)
CREATE TABLE ride_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT,
  ride_id UUID REFERENCES rides(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'upcoming',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ride_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ride history"
  ON ride_history FOR SELECT
  USING (auth.email() = user_email);

CREATE POLICY "Users can insert ride history"
  ON ride_history FOR INSERT
  WITH CHECK (auth.email() = user_email);

CREATE POLICY "Users can delete own ride history"
  ON ride_history FOR DELETE
  USING (auth.email() = user_email);

-- 4. Function to handle new user signup (auto-create profile)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'firstName',
    NEW.raw_user_meta_data->>'lastName'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
