// Set environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://vkusyxrhpahqdgfdrpat.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrdXN5eHJocGFocWRnZmRycGF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NzE5NzQsImV4cCI6MjA1MTI0Nzk3NH0.UB9QxHZRrPwVAnSoK7ox3zJw';

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testMigration() {
  try {
    console.log('🔍 Testing migration results...');
    
    // Check coaches
    const { data: coaches, error: coachError } = await supabase
      .from('coaches')
      .select('*');
    
    if (coachError) {
      console.error('❌ Error fetching coaches:', coachError);
      return;
    }
    
    console.log(`👥 Found ${coaches.length} coaches:`);
    coaches.forEach(coach => {
      console.log(`   ${coach.name} - Hired: ${coach.date_of_hire || 'Unknown'} - Vacation: ${coach.vacation_days_remaining}/${coach.vacation_days_total}`);
    });
    
    // Check periods
    const { data: periods, error: periodError } = await supabase
      .from('bi_weekly_periods')
      .select('*')
      .order('start_date', { ascending: false });
    
    if (periodError) {
      console.error('❌ Error fetching periods:', periodError);
      return;
    }
    
    console.log(`\n📅 Found ${periods.length} periods:`);
    periods.slice(0, 5).forEach(period => {
      console.log(`   ${period.period_name}: ${period.start_date} to ${period.end_date}`);
    });
    
    // Check metrics
    const { data: metrics, error: metricsError } = await supabase
      .from('safety_metrics')
      .select('*');
    
    if (metricsError) {
      console.error('❌ Error fetching metrics:', metricsError);
      return;
    }
    
    console.log(`\n📊 Found ${metrics.length} safety metrics records`);
    
    // Show sample metrics
    if (metrics.length > 0) {
      console.log('\n📈 Sample metrics:');
      metrics.slice(0, 3).forEach(metric => {
        console.log(`   Coach: ${metric.coach_id}, Period: ${metric.period_id}`);
        console.log(`   Site Evaluations: ${metric.site_safety_evaluations}, Audits: ${metric.forensic_survey_audits}`);
        console.log(`   Travel: ${metric.travel_plans || 'None'}`);
      });
    }
    
    console.log('\n✅ Migration test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testMigration(); 