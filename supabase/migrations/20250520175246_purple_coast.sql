/*
  # Create feedbacks table

  1. New Tables
    - `feedbacks`
      - `id` (uuid, primary key)
      - `section` (text, not null)
      - `feedback` (integer, not null)
      - `created_at` (timestamp with time zone)
  2. Security
    - Enable RLS on `feedbacks` table
    - Add policy for anonymous users to insert data
    - Add policy for authenticated users to read all data
*/

CREATE TABLE IF NOT EXISTS feedbacks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  feedback integer NOT NULL CHECK (feedback >= 1 AND feedback <= 6),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert feedback
CREATE POLICY "Allow anonymous inserts to feedbacks"
  ON feedbacks
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read all feedbacks
CREATE POLICY "Allow authenticated users to read all feedbacks"
  ON feedbacks
  FOR SELECT
  TO authenticated
  USING (true);