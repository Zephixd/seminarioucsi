# Supabase Setup Instructions

## Creating the Registrations Table

To set up your Supabase database for the registration form, follow these steps:

### Option 1: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Go to the "SQL Editor" tab on the left sidebar
4. Click "New Query"
5. Copy and paste the following SQL:

```sql
-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  apellido VARCHAR(255) NOT NULL,
  cedula VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);

-- Create index on cedula for faster lookups
CREATE INDEX IF NOT EXISTS idx_registrations_cedula ON registrations(cedula);

-- Enable Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert
CREATE POLICY "Allow insert for everyone" ON registrations
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow anyone to select
CREATE POLICY "Allow select for everyone" ON registrations
  FOR SELECT
  USING (true);
```

6. Click "Run" to execute the query
7. You should see a success message

### Option 2: Using psql (Command Line)

```bash
psql "your_connection_string" < supabase/migrations/create_registrations_table.sql
```

## Verifying the Setup

After creating the table:

1. Go to the "Table Editor" in Supabase Dashboard
2. You should see the `registrations` table in the left sidebar
3. Check that all columns are present: `id`, `nombre`, `apellido`, `cedula`, `email`, `telefono`, `created_at`, `updated_at`

## Environment Variables

The application uses the following environment variables from your Supabase project:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous API key

These are used to create the Supabase client that connects to your database.

## Table Schema

The `registrations` table stores user registration data:

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Unique identifier (auto-generated) |
| nombre | VARCHAR(255) | First name (required) |
| apellido | VARCHAR(255) | Last name (required) |
| cedula | VARCHAR(20) | ID number (unique, required) |
| email | VARCHAR(255) | Email address (required) |
| telefono | VARCHAR(20) | Phone number (required) |
| created_at | TIMESTAMP | Creation timestamp (auto-set) |
| updated_at | TIMESTAMP | Last update timestamp (auto-set) |

## Row Level Security (RLS)

The table has RLS enabled with the following policies:

- **Insert Policy**: Anyone can insert new registrations
- **Select Policy**: Anyone can view registrations

This allows the frontend to insert and read registration data without authentication.
