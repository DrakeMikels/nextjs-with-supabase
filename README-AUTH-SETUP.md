# Authentication Setup Guide

## Overview
The application now includes an authorized users system that controls who can sign up. Only users whose email addresses are in the authorized users list can create accounts.

## Setup Steps

### 1. Configure Environment Variables
Create a `.env.local` file in your project root with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your Supabase project dashboard:
- Go to Settings → API
- Copy the Project URL and anon/public key

### 2. Run Database Migrations
Apply the new authorized users migration:

```bash
# If using Supabase CLI
supabase db push

# Or manually run the SQL from supabase/migrations/002_authorized_users.sql
```

### 3. Configure Initial Authorized Users
The migration includes some example authorized users. Update them in the migration file or use the "Authorized Users" tab in the dashboard to:

- Add authorized email addresses
- Remove unauthorized users
- Activate/deactivate users

### 4. How It Works

#### For Users:
1. **Landing Page**: When auth is enabled, the main page redirects to `/auth/login`
2. **Sign Up**: Only authorized email addresses can create accounts
3. **Login**: After successful login, users are redirected to the main dashboard
4. **Access**: All authenticated users have full access to the application

#### For Administrators:
1. **Manage Users**: Use the "🔐 Auth Users" tab in the dashboard
2. **Add Users**: Add email addresses to allow new signups
3. **Control Access**: Activate/deactivate users as needed

### 5. Database Structure

The `authorized_users` table includes:
- `email`: The authorized email address
- `name`: Optional display name
- `is_active`: Whether the user can sign up
- `added_by`: Who added this user (for audit trail)

### 6. Security Features

- **Database Triggers**: Automatically prevent unauthorized signups
- **Row Level Security**: Protects all data with authentication
- **User-Friendly Errors**: Clear messages for unauthorized signup attempts

## Usage

1. **Enable Auth**: Set the environment variables
2. **Add Users**: Use the dashboard to add authorized email addresses
3. **Share Login**: Give users the login URL: `your-domain.com/auth/login`
4. **Manage Access**: Use the dashboard to control who can access the system

## Default Authorized Users

The migration includes these example users (update with real email addresses):
- mike@freedomforever.com
- james@freedomforever.com
- sam@freedomforever.com
- hugh@freedomforever.com
- joe@freedomforever.com
- zack@freedomforever.com
- will@freedomforever.com
- admin@freedomforever.com 