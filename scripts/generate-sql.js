const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// Excel file path
const excelFilePath = path.join(__dirname, '..', 'Regional Safety Coaches - Bi-Weekly Touch Base.xlsx');

console.log('🚀 Generating SQL for Supabase Dashboard');
console.log('📁 Parsing Excel file...');

try {
  const workbook = XLSX.readFile(excelFilePath);
  
  // Filter period sheets
  const periodSheetNames = workbook.SheetNames.filter(name => {
    return /^\d{1,2}-\d{1,2}-\d{2,4}$/.test(name);
  });
  
  console.log(`📅 Found ${periodSheetNames.length} period sheets`);
  
  // Parse first sheet to extract coaches
  const firstSheet = periodSheetNames[0];
  const worksheet = workbook.Sheets[firstSheet];
  const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  // Extract coach info
  const coachPattern = /^(James|Sam|Mike|Hugh|Joe|Zack|Will)/;
  const coaches = [];
  
  if (sheetData[0]) {
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
  }
  
  console.log(`👥 Extracted ${coaches.length} coaches:`, coaches.map(c => c.name));
  
  // Generate clean SQL
  let sql = '';
  
  sql += '-- Regional Safety Coaches - Excel Data Migration\n';
  sql += '-- Generated from: Regional Safety Coaches - Bi-Weekly Touch Base.xlsx\n';
  sql += '-- Run this in Supabase Dashboard > SQL Editor\n\n';
  
  sql += '-- Step 1: Clear existing data\n';
  sql += 'DELETE FROM safety_metrics WHERE id IS NOT NULL;\n';
  sql += 'DELETE FROM bi_weekly_periods WHERE id IS NOT NULL;\n';
  sql += 'DELETE FROM coaches WHERE id IS NOT NULL;\n\n';
  
  sql += '-- Step 2: Insert coaches from Excel\n';
  coaches.forEach(coach => {
    const hireDateStr = coach.date_of_hire ? `'${coach.date_of_hire}'` : 'NULL';
    sql += `INSERT INTO coaches (name, date_of_hire, vacation_days_remaining, vacation_days_total) \n`;
    sql += `VALUES ('${coach.name}', ${hireDateStr}, ${coach.vacation_days_remaining}, ${coach.vacation_days_total});\n`;
  });
  
  sql += '\n-- Step 3: Insert bi-weekly periods from Excel\n';
  periodSheetNames.forEach(periodName => {
    const parts = periodName.split('-');
    if (parts.length === 3) {
      let month = parseInt(parts[0]);
      let day = parseInt(parts[1]);
      let year = parseInt(parts[2]);
      
      if (year < 100) year += 2000;
      
      const startDate = new Date(year, month - 1, day);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 13);
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      sql += `INSERT INTO bi_weekly_periods (start_date, end_date, period_name) \n`;
      sql += `VALUES ('${startDateStr}', '${endDateStr}', '${periodName}');\n`;
    }
  });
  
  sql += '\n-- Step 4: Add sample safety metrics for the most recent period\n';
  sql += '-- This creates some sample data to demonstrate the application\n';
  if (coaches.length > 0 && periodSheetNames.length > 0) {
    const recentPeriod = periodSheetNames[0]; // Most recent period
    
    // Add sample metrics for first few coaches
    coaches.slice(0, 3).forEach((coach, index) => {
      sql += `INSERT INTO safety_metrics (\n`;
      sql += `  period_id, coach_id, travel_plans, training_branch_location,\n`;
      sql += `  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,\n`;
      sql += `  open_investigations_injuries, open_investigations_auto, \n`;
      sql += `  open_investigations_property_damage, open_investigations_near_miss,\n`;
      sql += `  notes\n`;
      sql += `) \n`;
      sql += `SELECT \n`;
      sql += `  p.id as period_id,\n`;
      sql += `  c.id as coach_id,\n`;
      sql += `  '${coach.name === 'James' ? 'Orlando' : coach.name === 'Sam' ? 'Chicago' : 'Various locations'}' as travel_plans,\n`;
      sql += `  '${coach.name === 'James' ? 'Orlando TBT' : coach.name === 'Sam' ? 'Chicago TBT' : 'Local TBT'}' as training_branch_location,\n`;
      sql += `  ${2 + index} as site_safety_evaluations,\n`;
      sql += `  ${1 + index} as forensic_survey_audits,\n`;
      sql += `  ${index + 1} as warehouse_safety_audits,\n`;
      sql += `  ${index} as open_investigations_injuries,\n`;
      sql += `  ${index + 1} as open_investigations_auto,\n`;
      sql += `  ${index} as open_investigations_property_damage,\n`;
      sql += `  0 as open_investigations_near_miss,\n`;
      sql += `  'Sample data from Excel migration' as notes\n`;
      sql += `FROM bi_weekly_periods p, coaches c \n`;
      sql += `WHERE p.period_name = '${recentPeriod}' AND c.name = '${coach.name}';\n\n`;
    });
  }
  
  sql += '-- Migration completed!\n';
  sql += '-- You should now see real data from your Excel file in the application.\n';
  
  // Save to file
  const sqlFilePath = path.join(__dirname, 'migration.sql');
  fs.writeFileSync(sqlFilePath, sql);
  
  console.log('\n📝 Generated SQL file:', sqlFilePath);
  console.log('\n📋 SQL Content:');
  console.log('=' * 80);
  console.log(sql);
  console.log('=' * 80);
  
  console.log('\n✅ SQL generation completed!');
  console.log('\n🚀 Next Steps:');
  console.log('1. Copy the SQL content above');
  console.log('2. Go to https://supabase.com/dashboard');
  console.log('3. Select your project: vkusyxrhpahqdgfdrpat');
  console.log('4. Navigate to SQL Editor (left sidebar)');
  console.log('5. Paste the SQL and click "Run"');
  console.log('6. Refresh your app at http://localhost:3000 or http://localhost:3003');
  
} catch (error) {
  console.error('❌ Error:', error);
} 