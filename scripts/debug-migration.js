const XLSX = require('xlsx');
const path = require('path');

// Excel file path
const excelFilePath = path.join(__dirname, '..', 'Regional Safety Coaches - Bi-Weekly Touch Base.xlsx');

console.log('🔍 Debug Migration Script');
console.log('📁 Excel file path:', excelFilePath);

// Check if file exists
const fs = require('fs');
if (!fs.existsSync(excelFilePath)) {
  console.error('❌ Excel file not found!');
  process.exit(1);
}

console.log('✅ Excel file found');

try {
  console.log('📊 Reading Excel file...');
  const workbook = XLSX.readFile(excelFilePath);
  
  console.log('📋 Available sheets:', workbook.SheetNames.length);
  
  // Filter period sheets
  const periodSheetNames = workbook.SheetNames.filter(name => {
    return /^\d{1,2}-\d{1,2}-\d{2,4}$/.test(name);
  });
  
  console.log('📅 Period sheets found:', periodSheetNames.length);
  console.log('📅 Period sheets:', periodSheetNames.slice(0, 5));
  
  // Parse first sheet to extract coaches
  if (periodSheetNames.length > 0) {
    const firstSheet = periodSheetNames[0];
    console.log(`\n📊 Analyzing sheet: ${firstSheet}`);
    
    const worksheet = workbook.Sheets[firstSheet];
    const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log('📋 First row (header):', sheetData[0]);
    
    // Extract coach info
    const coachPattern = /^(James|Sam|Mike|Hugh|Joe|Zack|Will)/;
    const coaches = [];
    
    if (sheetData[0]) {
      sheetData[0].forEach((cell, index) => {
        if (typeof cell === 'string' && coachPattern.test(cell)) {
          console.log(`👤 Found coach cell at index ${index}:`, cell);
          
          const match = cell.match(/^(\w+).*DOH\s+(\d{1,2}\/\d{1,2}\/?\d{0,4}|\d{1,2}\/\d{1,2}|\?\?\?\?).*\[(\d+)\s+out\s+of\s+(\d+)\]/);
          if (match) {
            const [, name, dateStr, remaining, total] = match;
            console.log(`   Name: ${name}, Date: ${dateStr}, Vacation: ${remaining}/${total}`);
            
            coaches.push({
              name,
              columnIndex: index,
              date_of_hire: dateStr !== '????' ? dateStr : null,
              vacation_days_remaining: parseInt(remaining),
              vacation_days_total: parseInt(total)
            });
          }
        }
      });
    }
    
    console.log(`\n👥 Extracted ${coaches.length} coaches:`, coaches.map(c => c.name));
    
    // Show sample data for first coach
    if (coaches.length > 0 && sheetData.length > 1) {
      const firstCoach = coaches[0];
      console.log(`\n📊 Sample data for ${firstCoach.name} (column ${firstCoach.columnIndex}):`);
      
      for (let i = 1; i < Math.min(sheetData.length, 11); i++) {
        const row = sheetData[i];
        if (row && row[firstCoach.columnIndex] !== undefined) {
          console.log(`   Row ${i}: ${row[firstCoach.columnIndex]}`);
        }
      }
    }
  }
  
  console.log('\n✅ Excel parsing successful!');
  console.log('\n💡 To complete the migration:');
  console.log('1. Ensure Supabase environment variables are set correctly');
  console.log('2. Run the migration script with proper credentials');
  console.log('3. Check the web application to see the imported data');
  
} catch (error) {
  console.error('❌ Error:', error);
} 