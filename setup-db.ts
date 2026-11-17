import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('Setting up database...');

    // Create registrations table
    const { error: tableError } = await supabase.rpc('_create_table_sql', {
      sql: `
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

        CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
        CREATE INDEX IF NOT EXISTS idx_registrations_cedula ON registrations(cedula);

        ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

        CREATE POLICY IF NOT EXISTS "Allow insert for everyone" ON registrations
          FOR INSERT
          WITH CHECK (true);

        CREATE POLICY IF NOT EXISTS "Allow select for everyone" ON registrations
          FOR SELECT
          USING (true);
      `,
    });

    if (tableError) {
      throw tableError;
    }

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
