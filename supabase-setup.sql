-- Raging Wine: Submission Forms Database Setup
-- Run this in your Supabase SQL Editor (supabase.com > Project > SQL Editor)

-- Table 1: Restaurant suggestions from users
-- Includes optional Wingman Metrics observations
CREATE TABLE IF NOT EXISTS restaurant_suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_name TEXT NOT NULL,
  city TEXT NOT NULL,
  reason TEXT NOT NULL,
  submitter_name TEXT NOT NULL,
  submitter_email TEXT NOT NULL,
  list_variety TEXT,
  markup_fairness TEXT,
  glassware_grade TEXT,
  staff_confidence TEXT,
  specials_deals TEXT,
  storage_temp TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'scheduled', 'reviewed', 'dismissed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table 2: Restaurant self-submissions
CREATE TABLE IF NOT EXISTS restaurant_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_name TEXT NOT NULL,
  city TEXT NOT NULL,
  reason TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'scheduled', 'reviewed', 'dismissed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE restaurant_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous inserts (the website forms)
CREATE POLICY "Allow anonymous inserts" ON restaurant_suggestions
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts" ON restaurant_submissions
  FOR INSERT TO anon WITH CHECK (true);

-- Policy: Only authenticated users can read (for your admin use)
CREATE POLICY "Allow authenticated reads" ON restaurant_suggestions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated reads" ON restaurant_submissions
  FOR SELECT TO authenticated USING (true);

-- Indexes
CREATE INDEX idx_suggestions_status ON restaurant_suggestions(status);
CREATE INDEX idx_submissions_status ON restaurant_submissions(status);
CREATE INDEX idx_suggestions_city ON restaurant_suggestions(city);
CREATE INDEX idx_submissions_city ON restaurant_submissions(city);
