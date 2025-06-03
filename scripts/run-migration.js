// Set environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://vkusyxrhpahqdgfdrpat.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrdXN5eHJocGFocWRnZmRycGF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NzE5NzQsImV4cCI6MjA1MTI0Nzk3NH0.UB9QxHZRrPwVAnSoK7ox3zJw';

// Run the migration
require('./migrate-excel-data.js'); 