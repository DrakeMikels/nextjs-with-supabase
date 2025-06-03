const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Excel file path
const excelFilePath = path.join(__dirname, '..', 'Regional Safety Coaches - Bi-Weekly Touch Base.xlsx');

function parseCoachInfo(headerRow) {
  const coaches = [];
  const coachPattern = /^(James|Sam|Mike|Hugh|Joe|Zack|Will)/;
  
  headerRow.forEach((cell, index) => {
    if (typeof cell === 'string' && coachPattern.test(cell)) {
      const match = cell.match(/^(\w+).*DOH\s+(\d{1,2}\/\d{1,2}\/?\d{0,4}|\d{1,2}\/\d{1,2}|\?\?\?\?).*\[(\d+)\s+out\s+of\s+(\d+)\]/);
      if (match) {
        const [, name, dateStr, remaining, total] = match;
        
        // Parse hire date
        let hireDate = null;
        if (dateStr !== '????') {
          const dateParts = dateStr.split('/');
          if (dateParts.length >= 2) {
            const month = parseInt(dateParts[0]);
            const day = parseInt(dateParts[1]);
            let year = dateParts[2] ? parseInt(dateParts[2]) : 2021; // Default year
            
            if (year < 100) year += 2000;
            if (year < 2000) year += 2000;
            
            hireDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          }
        }
        
        coaches.push({
          name,
          columnIndex: index,
          date_of_hire: hireDate,
          vacation_days_remaining: parseInt(remaining),
          vacation_days_total: parseInt(total)
        });
      }
    }
  });
  
  return coaches;
}

function parseDateRange(dateRangeStr) {
  // Parse "Work Weeks Date Range: 4/28/2025 - 5/5/2025"
  const match = dateRangeStr.match(/(\d{1,2}\/\d{1,2}\/\d{4})\s*-\s*(\d{1,2}\/\d{1,2}\/\d{4})/);
  if (match) {
    const [, startStr, endStr] = match;
    
    const parseDate = (dateStr) => {
      const [month, day, year] = dateStr.split('/').map(Number);
      return new Date(year, month - 1, day);
    };
    
    return {
      start_date: parseDate(startStr).toISOString().split('T')[0],
      end_date: parseDate(endStr).toISOString().split('T')[0]
    };
  }
  
  return null;
}

function parseMetricValue(value) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    // Try to extract numbers from complex strings like "1(Code Red) + 2(Code Green) + 4(Install) = 7"
    const match = value.match(/=\s*(\d+)$/);
    if (match) return parseInt(match[1]);
    
    // Try to extract simple numbers
    const simpleMatch = value.match(/^\d+/);
    if (simpleMatch) return parseInt(simpleMatch[0]);
  }
  return 0;
}

function parseDate(value) {
  if (!value) return null;
  
  // Handle Excel date numbers
  if (typeof value === 'number') {
    // Excel date serial number to JavaScript date
    const excelEpoch = new Date(1900, 0, 1);
    const jsDate = new Date(excelEpoch.getTime() + (value - 2) * 24 * 60 * 60 * 1000);
    return jsDate.toISOString().split('T')[0];
  }
  
  if (typeof value === 'string') {
    // Handle various date formats
    const datePatterns = [
      /(\d{1,2})\/(\d{1,2})\/(\d{4})/,  // MM/DD/YYYY
      /(\d{1,2})\/(\d{1,2})/,           // MM/DD
      /(\w+)\s+(\d{1,2})\w*/            // "May 1st", "April 18th"
    ];
    
    for (const pattern of datePatterns) {
      const match = value.match(pattern);
      if (match) {
        if (pattern === datePatterns[2]) {
          // Month name format
          const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                             'July', 'August', 'September', 'October', 'November', 'December'];
          const monthIndex = monthNames.findIndex(m => m.toLowerCase().startsWith(match[1].toLowerCase()));
          if (monthIndex >= 0) {
            const year = new Date().getFullYear();
            return `${year}-${(monthIndex + 1).toString().padStart(2, '0')}-${match[2].padStart(2, '0')}`;
          }
        } else {
          const month = parseInt(match[1]);
          const day = parseInt(match[2]);
          const year = match[3] ? parseInt(match[3]) : new Date().getFullYear();
          return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        }
      }
    }
  }
  
  return null;
}

async function parseExcelFile() {
  try {
    console.log('📊 Reading Excel file...');
    const workbook = XLSX.readFile(excelFilePath);
    
    console.log('📋 Available sheets:', workbook.SheetNames.length);
    
    const coaches = [];
    const periods = [];
    const metricsData = [];
    
    // Filter sheets that look like date periods
    const periodSheetNames = workbook.SheetNames.filter(name => {
      return /^\d{1,2}-\d{1,2}-\d{2,4}$/.test(name) || /^\d{1,2}\/\d{1,2}\/\d{4}/.test(name);
    });
    
    console.log('📅 Found period sheets:', periodSheetNames);
    
    let coachesExtracted = false;
    
    // Parse each period sheet
    for (const sheetName of periodSheetNames) {
      console.log(`📊 Processing sheet: ${sheetName}`);
      
      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet) continue;
      
      const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      if (sheetData.length === 0) continue;
      
      // Extract coaches from first row (only once)
      if (!coachesExtracted && sheetData[0]) {
        const extractedCoaches = parseCoachInfo(sheetData[0]);
        coaches.push(...extractedCoaches);
        coachesExtracted = true;
        console.log(`👥 Extracted ${extractedCoaches.length} coaches:`, extractedCoaches.map(c => c.name));
      }
      
      // Extract period info from first row
      const dateRangeCell = sheetData[0] && sheetData[0].find(cell => 
        typeof cell === 'string' && cell.includes('Date Range:')
      );
      
      let periodInfo = null;
      if (dateRangeCell) {
        periodInfo = parseDateRange(dateRangeCell);
      }
      
      if (!periodInfo) {
        // Fallback: parse from sheet name
        const parts = sheetName.split('-');
        if (parts.length === 3) {
          let month = parseInt(parts[0]);
          let day = parseInt(parts[1]);
          let year = parseInt(parts[2]);
          
          if (year < 100) year += 2000;
          
          const startDate = new Date(year, month - 1, day);
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 13);
          
          periodInfo = {
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0]
          };
        }
      }
      
      if (periodInfo) {
        periods.push({
          ...periodInfo,
          period_name: sheetName
        });
        
        // Extract metrics for each coach
        const metricRows = {
          'Travel Plans- Branch Location': 1,
          'Training Branch- TBT location attendance': 2,
          'Site Safety Evaluations- Field Total': 3,
          'Forensic/Survey Audits- Site Survey & Install': 4,
          'Warehouse Safety Audits': 5,
          'Open Investigations - Injuries; Auto; Prop DMG; Near Miss; Total Count': 6,
          'DO/HR Partnership Meeting- Monthly Date': 7,
          'BM/PM/WHS Partnership Meetings- Monthly Date': 8,
          'LMS Reports- Date reported to BM/PM': 9,
          'TBT Attendance Reports- Date reported to BM/PM': 10
        };
        
        coaches.forEach(coach => {
          const metrics = {
            coach_name: coach.name,
            period_name: sheetName,
            travel_plans: '',
            training_branch_location: '',
            site_safety_evaluations: 0,
            forensic_survey_audits: 0,
            warehouse_safety_audits: 0,
            open_investigations_injuries: 0,
            open_investigations_auto: 0,
            open_investigations_property_damage: 0,
            open_investigations_near_miss: 0,
            do_hr_partnership_meeting: null,
            bm_pm_whs_partnership_meeting: null,
            lms_reports_date: null,
            tbt_attendance_reports_date: null,
            notes: ''
          };
          
          // Extract data from specific rows
          if (sheetData[1] && sheetData[1][coach.columnIndex]) {
            metrics.travel_plans = String(sheetData[1][coach.columnIndex] || '');
          }
          
          if (sheetData[2] && sheetData[2][coach.columnIndex]) {
            metrics.training_branch_location = String(sheetData[2][coach.columnIndex] || '');
          }
          
          if (sheetData[3] && sheetData[3][coach.columnIndex]) {
            metrics.site_safety_evaluations = parseMetricValue(sheetData[3][coach.columnIndex]);
          }
          
          if (sheetData[4] && sheetData[4][coach.columnIndex]) {
            metrics.forensic_survey_audits = parseMetricValue(sheetData[4][coach.columnIndex]);
          }
          
          if (sheetData[5] && sheetData[5][coach.columnIndex]) {
            metrics.warehouse_safety_audits = parseMetricValue(sheetData[5][coach.columnIndex]);
          }
          
          // Parse investigations (complex field)
          if (sheetData[6] && sheetData[6][coach.columnIndex]) {
            const invValue = sheetData[6][coach.columnIndex];
            if (typeof invValue === 'string') {
              const injMatch = invValue.match(/(\d+)\s*\(?[Ii]nj/);
              const autoMatch = invValue.match(/(\d+)\s*\(?[Aa]uto/);
              const pdMatch = invValue.match(/(\d+)\s*\(?[Pp][Dd]/);
              const nmMatch = invValue.match(/(\d+)\s*\(?[Nn][Mm]/);
              
              if (injMatch) metrics.open_investigations_injuries = parseInt(injMatch[1]);
              if (autoMatch) metrics.open_investigations_auto = parseInt(autoMatch[1]);
              if (pdMatch) metrics.open_investigations_property_damage = parseInt(pdMatch[1]);
              if (nmMatch) metrics.open_investigations_near_miss = parseInt(nmMatch[1]);
            } else if (typeof invValue === 'number') {
              metrics.open_investigations_injuries = invValue;
            }
          }
          
          // Parse meeting dates
          if (sheetData[7] && sheetData[7][coach.columnIndex]) {
            metrics.do_hr_partnership_meeting = parseDate(sheetData[7][coach.columnIndex]);
          }
          
          if (sheetData[8] && sheetData[8][coach.columnIndex]) {
            metrics.bm_pm_whs_partnership_meeting = parseDate(sheetData[8][coach.columnIndex]);
          }
          
          if (sheetData[9] && sheetData[9][coach.columnIndex]) {
            metrics.lms_reports_date = parseDate(sheetData[9][coach.columnIndex]);
          }
          
          if (sheetData[10] && sheetData[10][coach.columnIndex]) {
            metrics.tbt_attendance_reports_date = parseDate(sheetData[10][coach.columnIndex]);
          }
          
          // Only add metrics if there's some data
          if (metrics.travel_plans || metrics.site_safety_evaluations > 0 || 
              metrics.forensic_survey_audits > 0 || metrics.warehouse_safety_audits > 0) {
            metricsData.push(metrics);
          }
        });
      }
    }
    
    // Remove duplicates from coaches (keep unique by name)
    const uniqueCoaches = coaches.filter((coach, index, self) => 
      index === self.findIndex(c => c.name === coach.name)
    ).map(coach => ({
      name: coach.name,
      date_of_hire: coach.date_of_hire,
      vacation_days_remaining: coach.vacation_days_remaining,
      vacation_days_total: coach.vacation_days_total
    }));
    
    return { coaches: uniqueCoaches, periods, metricsData };
    
  } catch (error) {
    console.error('❌ Error parsing Excel file:', error);
    throw error;
  }
}

async function migrateToSupabase(data) {
  const { coaches, periods, metricsData } = data;
  
  try {
    console.log('🚀 Starting migration to Supabase...');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await supabase.from('safety_metrics').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('bi_weekly_periods').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('coaches').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Insert coaches
    console.log('👥 Inserting coaches...');
    const { data: insertedCoaches, error: coachError } = await supabase
      .from('coaches')
      .insert(coaches)
      .select();
    
    if (coachError) {
      console.error('❌ Error inserting coaches:', coachError);
      throw coachError;
    }
    
    console.log(`✅ Inserted ${insertedCoaches.length} coaches`);
    
    // Insert periods
    console.log('📅 Inserting periods...');
    const { data: insertedPeriods, error: periodError } = await supabase
      .from('bi_weekly_periods')
      .insert(periods)
      .select();
    
    if (periodError) {
      console.error('❌ Error inserting periods:', periodError);
      throw periodError;
    }
    
    console.log(`✅ Inserted ${insertedPeriods.length} periods`);
    
    // Create lookup maps
    const coachMap = new Map();
    insertedCoaches.forEach(coach => {
      coachMap.set(coach.name, coach.id);
    });
    
    const periodMap = new Map();
    insertedPeriods.forEach(period => {
      periodMap.set(period.period_name, period.id);
    });
    
    // Insert metrics data
    console.log('📊 Inserting safety metrics...');
    const metricsToInsert = metricsData
      .filter(metric => coachMap.has(metric.coach_name) && periodMap.has(metric.period_name))
      .map(metric => ({
        coach_id: coachMap.get(metric.coach_name),
        period_id: periodMap.get(metric.period_name),
        travel_plans: metric.travel_plans,
        training_branch_location: metric.training_branch_location,
        site_safety_evaluations: metric.site_safety_evaluations,
        forensic_survey_audits: metric.forensic_survey_audits,
        warehouse_safety_audits: metric.warehouse_safety_audits,
        open_investigations_injuries: metric.open_investigations_injuries,
        open_investigations_auto: metric.open_investigations_auto,
        open_investigations_property_damage: metric.open_investigations_property_damage,
        open_investigations_near_miss: metric.open_investigations_near_miss,
        do_hr_partnership_meeting: metric.do_hr_partnership_meeting,
        bm_pm_whs_partnership_meeting: metric.bm_pm_whs_partnership_meeting,
        lms_reports_date: metric.lms_reports_date,
        tbt_attendance_reports_date: metric.tbt_attendance_reports_date,
        notes: metric.notes
      }));
    
    if (metricsToInsert.length > 0) {
      const { data: insertedMetrics, error: metricsError } = await supabase
        .from('safety_metrics')
        .insert(metricsToInsert)
        .select();
      
      if (metricsError) {
        console.error('❌ Error inserting metrics:', metricsError);
        throw metricsError;
      }
      
      console.log(`✅ Inserted ${insertedMetrics.length} safety metrics records`);
    } else {
      console.log('⚠️ No metrics data found to insert');
    }
    
    console.log('🎉 Migration completed successfully!');
    
    // Print summary
    console.log('\n📋 Migration Summary:');
    console.log(`   👥 Coaches: ${insertedCoaches.length}`);
    console.log(`   📅 Periods: ${insertedPeriods.length}`);
    console.log(`   📊 Metrics: ${metricsToInsert.length}`);
    
    // Show sample data
    console.log('\n📊 Sample Coaches:');
    insertedCoaches.forEach(coach => {
      console.log(`   ${coach.name} - Hired: ${coach.date_of_hire || 'Unknown'} - Vacation: ${coach.vacation_days_remaining}/${coach.vacation_days_total}`);
    });
    
    console.log('\n📅 Sample Periods:');
    insertedPeriods.slice(0, 5).forEach(period => {
      console.log(`   ${period.period_name}: ${period.start_date} to ${period.end_date}`);
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

async function main() {
  try {
    // Check if Excel file exists
    if (!fs.existsSync(excelFilePath)) {
      console.error(`❌ Excel file not found: ${excelFilePath}`);
      console.log('Please ensure the Excel file is in the project root directory');
      process.exit(1);
    }
    
    console.log('🚀 Starting Excel to Supabase migration...');
    console.log(`📁 Excel file: ${excelFilePath}`);
    
    // Parse Excel data
    const data = await parseExcelFile();
    
    console.log('\n📊 Parsed Data Summary:');
    console.log(`   👥 Coaches: ${data.coaches.length}`);
    console.log(`   📅 Periods: ${data.periods.length}`);
    console.log(`   📊 Metrics: ${data.metricsData.length}`);
    
    // Migrate to Supabase
    await migrateToSupabase(data);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
if (require.main === module) {
  main();
}

module.exports = { parseExcelFile, migrateToSupabase }; 