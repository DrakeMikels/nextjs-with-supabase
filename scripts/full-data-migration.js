const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// Excel file path
const excelFilePath = path.join(__dirname, '..', 'Regional Safety Coaches - Bi-Weekly Touch Base.xlsx');

console.log('🚀 Full Data Migration - Extracting ALL Excel Data');
console.log('📁 Parsing Excel file for complete data migration...');

function parseMetricValue(value) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    // Handle complex strings like "1(Code Red) + 2(Code Green) + 4(Install) = 7"
    const equalMatch = value.match(/=\s*(\d+)$/);
    if (equalMatch) return parseInt(equalMatch[1]);
    
    // Handle simple numbers at start
    const simpleMatch = value.match(/^\d+/);
    if (simpleMatch) return parseInt(simpleMatch[0]);
    
    // Handle "Zero" or text
    if (value.toLowerCase().includes('zero')) return 0;
  }
  return 0;
}

function parseInvestigations(value) {
  const result = {
    injuries: 0,
    auto: 0,
    property_damage: 0,
    near_miss: 0
  };
  
  if (!value) return result;
  
  if (typeof value === 'number') {
    result.injuries = value;
    return result;
  }
  
  if (typeof value === 'string') {
    // Parse patterns like "3 Inj + 3 Auto + 2 PD = 8" or "1(Injury) + 3(Auto) + 11(PD) + 1(NM) = 16"
    const injMatch = value.match(/(\d+)\s*\(?[Ii]nj/);
    const autoMatch = value.match(/(\d+)\s*\(?[Aa]uto/);
    const pdMatch = value.match(/(\d+)\s*\(?[Pp][Dd]/);
    const nmMatch = value.match(/(\d+)\s*\(?[Nn][Mm]/);
    
    if (injMatch) result.injuries = parseInt(injMatch[1]);
    if (autoMatch) result.auto = parseInt(autoMatch[1]);
    if (pdMatch) result.property_damage = parseInt(pdMatch[1]);
    if (nmMatch) result.near_miss = parseInt(nmMatch[1]);
    
    // Handle formats like "5, 8, 6, 4 [23]" (injuries, auto, pd, nm)
    const arrayMatch = value.match(/(\d+),\s*(\d+),\s*(\d+),\s*(\d+)/);
    if (arrayMatch) {
      result.injuries = parseInt(arrayMatch[1]);
      result.auto = parseInt(arrayMatch[2]);
      result.property_damage = parseInt(arrayMatch[3]);
      result.near_miss = parseInt(arrayMatch[4]);
    }
  }
  
  return result;
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

try {
  const workbook = XLSX.readFile(excelFilePath);
  
  // Filter period sheets
  const periodSheetNames = workbook.SheetNames.filter(name => {
    return /^\d{1,2}-\d{1,2}-\d{2,4}$/.test(name);
  });
  
  console.log(`📅 Found ${periodSheetNames.length} period sheets`);
  
  const coaches = [];
  const periods = [];
  const allMetrics = [];
  let coachesExtracted = false;
  
  // Process each period sheet
  for (const sheetName of periodSheetNames) {
    console.log(`📊 Processing sheet: ${sheetName}`);
    
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) continue;
    
    const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    if (sheetData.length === 0) continue;
    
    // Extract coaches from first sheet only
    if (!coachesExtracted && sheetData[0]) {
      const coachPattern = /^(James|Sam|Mike|Hugh|Joe|Zack|Will)/;
      
      sheetData[0].forEach((cell, index) => {
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
                let year = dateParts[2] ? parseInt(dateParts[2]) : 2021;
                
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
      coachesExtracted = true;
      console.log(`👥 Extracted ${coaches.length} coaches:`, coaches.map(c => c.name));
    }
    
    // Extract period info
    const dateRangeCell = sheetData[0] && sheetData[0].find(cell => 
      typeof cell === 'string' && cell.includes('Date Range:')
    );
    
    let periodInfo = null;
    if (dateRangeCell) {
      const match = dateRangeCell.match(/(\d{1,2}\/\d{1,2}\/\d{4})\s*-\s*(\d{1,2}\/\d{1,2}\/\d{4})/);
      if (match) {
        const [, startStr, endStr] = match;
        
        const parseDate = (dateStr) => {
          const [month, day, year] = dateStr.split('/').map(Number);
          return new Date(year, month - 1, day);
        };
        
        periodInfo = {
          start_date: parseDate(startStr).toISOString().split('T')[0],
          end_date: parseDate(endStr).toISOString().split('T')[0]
        };
      }
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
      
      // Extract actual metrics for each coach
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
        
        // Extract data from specific rows based on Excel structure
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
          const investigations = parseInvestigations(sheetData[6][coach.columnIndex]);
          metrics.open_investigations_injuries = investigations.injuries;
          metrics.open_investigations_auto = investigations.auto;
          metrics.open_investigations_property_damage = investigations.property_damage;
          metrics.open_investigations_near_miss = investigations.near_miss;
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
        
        // Add notes from the Notes column if available
        const notesColumnIndex = sheetData[0] ? sheetData[0].findIndex(cell => 
          typeof cell === 'string' && cell.toLowerCase().includes('notes')
        ) : -1;
        
        if (notesColumnIndex > -1 && sheetData[1] && sheetData[1][notesColumnIndex]) {
          metrics.notes = String(sheetData[1][notesColumnIndex] || '');
        }
        
        // Only add metrics if there's actual data (not empty)
        if (metrics.travel_plans || 
            metrics.site_safety_evaluations > 0 || 
            metrics.forensic_survey_audits > 0 || 
            metrics.warehouse_safety_audits > 0 ||
            metrics.open_investigations_injuries > 0 ||
            metrics.open_investigations_auto > 0 ||
            metrics.open_investigations_property_damage > 0 ||
            metrics.open_investigations_near_miss > 0) {
          allMetrics.push(metrics);
        }
      });
    }
  }
  
  // Remove duplicate coaches
  const uniqueCoaches = coaches.filter((coach, index, self) => 
    index === self.findIndex(c => c.name === coach.name)
  ).map(coach => ({
    name: coach.name,
    date_of_hire: coach.date_of_hire,
    vacation_days_remaining: coach.vacation_days_remaining,
    vacation_days_total: coach.vacation_days_total
  }));
  
  console.log(`\n📊 Extraction Summary:`);
  console.log(`   👥 Coaches: ${uniqueCoaches.length}`);
  console.log(`   📅 Periods: ${periods.length}`);
  console.log(`   📈 Metrics Records: ${allMetrics.length}`);
  
  // Generate comprehensive SQL
  let sql = '';
  
  sql += '-- Regional Safety Coaches - COMPLETE Excel Data Migration\n';
  sql += '-- Generated from: Regional Safety Coaches - Bi-Weekly Touch Base.xlsx\n';
  sql += '-- This includes ALL actual data from the Excel file\n';
  sql += '-- Run this in Supabase Dashboard > SQL Editor\n\n';
  
  sql += '-- Step 1: Clear existing data\n';
  sql += 'DELETE FROM safety_metrics WHERE id IS NOT NULL;\n';
  sql += 'DELETE FROM bi_weekly_periods WHERE id IS NOT NULL;\n';
  sql += 'DELETE FROM coaches WHERE id IS NOT NULL;\n\n';
  
  sql += '-- Step 2: Insert coaches from Excel\n';
  uniqueCoaches.forEach(coach => {
    const hireDateStr = coach.date_of_hire ? `'${coach.date_of_hire}'` : 'NULL';
    sql += `INSERT INTO coaches (name, date_of_hire, vacation_days_remaining, vacation_days_total) \n`;
    sql += `VALUES ('${coach.name}', ${hireDateStr}, ${coach.vacation_days_remaining}, ${coach.vacation_days_total});\n`;
  });
  
  sql += '\n-- Step 3: Insert bi-weekly periods from Excel\n';
  periods.forEach(period => {
    sql += `INSERT INTO bi_weekly_periods (start_date, end_date, period_name) \n`;
    sql += `VALUES ('${period.start_date}', '${period.end_date}', '${period.period_name}');\n`;
  });
  
  sql += '\n-- Step 4: Insert ALL actual safety metrics from Excel\n';
  sql += '-- This includes real data from each coach for each period\n';
  
  allMetrics.forEach(metric => {
    const travelPlans = metric.travel_plans.replace(/'/g, "''"); // Escape quotes
    const trainingBranch = metric.training_branch_location.replace(/'/g, "''");
    const notes = metric.notes.replace(/'/g, "''");
    const doHrDate = metric.do_hr_partnership_meeting ? `'${metric.do_hr_partnership_meeting}'` : 'NULL';
    const bmPmDate = metric.bm_pm_whs_partnership_meeting ? `'${metric.bm_pm_whs_partnership_meeting}'` : 'NULL';
    const lmsDate = metric.lms_reports_date ? `'${metric.lms_reports_date}'` : 'NULL';
    const tbtDate = metric.tbt_attendance_reports_date ? `'${metric.tbt_attendance_reports_date}'` : 'NULL';
    
    sql += `INSERT INTO safety_metrics (\n`;
    sql += `  period_id, coach_id, travel_plans, training_branch_location,\n`;
    sql += `  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,\n`;
    sql += `  open_investigations_injuries, open_investigations_auto, \n`;
    sql += `  open_investigations_property_damage, open_investigations_near_miss,\n`;
    sql += `  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,\n`;
    sql += `  lms_reports_date, tbt_attendance_reports_date, notes\n`;
    sql += `) \n`;
    sql += `SELECT \n`;
    sql += `  p.id as period_id,\n`;
    sql += `  c.id as coach_id,\n`;
    sql += `  '${travelPlans}' as travel_plans,\n`;
    sql += `  '${trainingBranch}' as training_branch_location,\n`;
    sql += `  ${metric.site_safety_evaluations} as site_safety_evaluations,\n`;
    sql += `  ${metric.forensic_survey_audits} as forensic_survey_audits,\n`;
    sql += `  ${metric.warehouse_safety_audits} as warehouse_safety_audits,\n`;
    sql += `  ${metric.open_investigations_injuries} as open_investigations_injuries,\n`;
    sql += `  ${metric.open_investigations_auto} as open_investigations_auto,\n`;
    sql += `  ${metric.open_investigations_property_damage} as open_investigations_property_damage,\n`;
    sql += `  ${metric.open_investigations_near_miss} as open_investigations_near_miss,\n`;
    sql += `  ${doHrDate} as do_hr_partnership_meeting,\n`;
    sql += `  ${bmPmDate} as bm_pm_whs_partnership_meeting,\n`;
    sql += `  ${lmsDate} as lms_reports_date,\n`;
    sql += `  ${tbtDate} as tbt_attendance_reports_date,\n`;
    sql += `  '${notes}' as notes\n`;
    sql += `FROM bi_weekly_periods p, coaches c \n`;
    sql += `WHERE p.period_name = '${metric.period_name}' AND c.name = '${metric.coach_name}';\n\n`;
  });
  
  sql += '-- Migration completed!\n';
  sql += '-- You now have ALL actual data from your Excel file in the database.\n';
  sql += `-- Total records: ${uniqueCoaches.length} coaches, ${periods.length} periods, ${allMetrics.length} metrics\n`;
  
  // Save to file
  const sqlFilePath = path.join(__dirname, 'full-migration.sql');
  fs.writeFileSync(sqlFilePath, sql);
  
  console.log(`\n📝 Generated complete SQL file: ${sqlFilePath}`);
  console.log(`\n📊 Migration includes:`);
  console.log(`   👥 ${uniqueCoaches.length} coaches with real hire dates and vacation data`);
  console.log(`   📅 ${periods.length} bi-weekly periods`);
  console.log(`   📈 ${allMetrics.length} actual safety metrics records`);
  
  console.log('\n🚀 To apply this complete migration:');
  console.log('1. Go to https://supabase.com/dashboard');
  console.log('2. Select your project: vkusyxrhpahqdgfdrpat');
  console.log('3. Navigate to SQL Editor');
  console.log('4. Copy and paste the SQL from the file above');
  console.log('5. Click "Run" to execute');
  console.log('6. Refresh your application to see ALL the real data!');
  
  // Show sample of what was extracted
  console.log('\n📋 Sample of extracted data:');
  allMetrics.slice(0, 3).forEach(metric => {
    console.log(`   ${metric.coach_name} (${metric.period_name}): ${metric.site_safety_evaluations} evaluations, ${metric.forensic_survey_audits} audits, Travel: "${metric.travel_plans}"`);
  });
  
} catch (error) {
  console.error('❌ Error:', error);
} 