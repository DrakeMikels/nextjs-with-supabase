# Regional Safety Coaches Dashboard

<!-- Build cache refresh: 2024-12-19 -->

A comprehensive safety metrics tracking system for regional safety coaches built with Next.js and Supabase.

## Features

### 🏠 Dashboard Overview
- Real-time statistics and KPI tracking
- Quick access to current period information
- Overview of active coaches and total periods

### 📊 Bi-Weekly Period Management
- Create and manage bi-weekly tracking periods
- Visual period selection with current period highlighting
- Automatic date range calculation (14-day periods)

### 📈 Safety Metrics Tracking
- **Site Safety Evaluations** (Goal: 12-15 per month)
- **Forensic/Survey Audits** (Goal: 12-15 per month)
- **Warehouse Safety Audits** (Goal: 2 per month)
- **Open Investigations** tracking (Injuries, Auto, Property Damage, Near Miss)
- **Meeting Dates** (DO/HR Partnership, BM/PM/WHS Partnership)
- **Report Dates** (LMS Reports, TBT Attendance Reports)
- Travel plans and training branch locations
- Notes and additional comments

### 👥 Coach Management
- Add, edit, and manage safety coach profiles
- Track hire dates and tenure
- Vacation day management and visualization
- Individual coach performance tracking

### 📊 Analytics Dashboard
- Goal progress tracking with visual progress bars
- Individual coach performance summaries
- Recent trends analysis (last 3 periods)
- Overall statistics and averages
- Performance metrics across all periods

## Technology Stack

- **Frontend**: Next.js 15 with React 19
- **Backend**: Supabase (PostgreSQL database)
- **UI Components**: shadcn/ui with Tailwind CSS
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Deployment**: Vercel

## Database Schema

### Tables

1. **coaches**
   - Coach information (name, hire date, vacation days)
   - Tracks individual coach details and tenure

2. **bi_weekly_periods**
   - Period definitions with start/end dates
   - Unique period names for easy identification

3. **safety_metrics**
   - Core metrics data linked to periods and coaches
   - All safety KPIs and tracking data
   - Meeting dates and report submissions

## Getting Started

### Prerequisites

- Node.js 18+ 
- Supabase account and project
- Environment variables configured

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Copy the example env file
   cp .env.example .env.local
   
   # Add your Supabase credentials
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run database migrations:
   ```bash
   # If using Supabase CLI
   supabase db push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Creating a New Bi-Weekly Period

1. Navigate to the dashboard
2. Click "New Period" button
3. The system automatically creates a 14-day period starting from today
4. Period name is auto-generated (e.g., "1-15-25" for January 15, 2025)

### Entering Safety Metrics

1. Go to the "Safety Metrics" tab
2. Select a bi-weekly period
3. Choose a coach from the coach selection grid
4. Fill in the safety metrics form:
   - Travel plans and training locations
   - Safety evaluation counts
   - Audit numbers
   - Investigation counts by type
   - Meeting and report dates
   - Additional notes

5. Click "Save Metrics" to store the data

### Managing Coaches

1. Navigate to the "Coach Management" tab
2. Add new coaches with the "Add Coach" button
3. Edit existing coach information by clicking the edit icon
4. Track vacation days and tenure information
5. Delete coaches if needed (with confirmation)

### Viewing Analytics

1. Go to the "Analytics" tab to see:
   - Overall performance statistics
   - Goal progress tracking
   - Individual coach performance summaries
   - Recent trends across periods

## Data Migration from Excel

The application was designed to replace the existing Excel-based tracking system. Key features from the original Excel workbook have been preserved:

- All coach information (James, Sam, Mike, Hugh, Joe, Zack, Will)
- Safety metrics categories and goals
- Bi-weekly period structure
- Vacation day tracking
- Investigation categorization

## Deployment

The application is designed for deployment on Vercel with Supabase as the backend:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues or questions about the Regional Safety Coaches Bi-Weekly Tracker, please create an issue in the repository or contact the development team.

## License

This project is proprietary software for internal use by the Regional Safety Coaches team.
