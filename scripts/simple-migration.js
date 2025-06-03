const XLSX = require('xlsx');
const path = require('path');

// Excel file path
const excelFilePath = path.join(__dirname, '..', 'Regional Safety Coaches - Bi-Weekly Touch Base.xlsx');

console.log('🚀 Simple Migration Script');
console.log('📁 Parsing Excel file to generate SQL...');

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
  
  // Generate SQL for coaches
  console.log('\n📝 Generated SQL for coaches:');
  console.log('-- Clear existing data');
  console.log("DELETE FROM safety_metrics WHERE id IS NOT NULL;");
  console.log("DELETE FROM bi_weekly_periods WHERE id IS NOT NULL;");
  console.log("DELETE FROM coaches WHERE id IS NOT NULL;");
  console.log('');
  console.log('-- Insert coaches');
  
  coaches.forEach(coach => {
    const hireDateStr = coach.date_of_hire ? `'${coach.date_of_hire}'` : 'NULL';
    console.log(`INSERT INTO coaches (name, date_of_hire, vacation_days_remaining, vacation_days_total) VALUES ('${coach.name}', ${hireDateStr}, ${coach.vacation_days_remaining}, ${coach.vacation_days_total});`);
  });
  
  // Generate SQL for periods
  console.log('\n-- Insert periods');
  periodSheetNames.slice(0, 10).forEach(periodName => {
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
      
      console.log(`INSERT INTO bi_weekly_periods (start_date, end_date, period_name) VALUES ('${startDateStr}', '${endDateStr}', '${periodName}');`);
    }
  });
  
  console.log('\n✅ SQL generation completed!');
  console.log('\n💡 To apply this data:');
  console.log('1. Copy the SQL statements above');
  console.log('2. Go to your Supabase dashboard > SQL Editor');
  console.log('3. Paste and run the SQL statements');
  console.log('4. Refresh your web application to see the data');
  
} catch (error) {
  console.error('❌ Error:', error);
} 