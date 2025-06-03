const XLSX = require('xlsx');
const path = require('path');

// Excel file path
const excelFilePath = path.join(__dirname, '..', 'Regional Safety Coaches - Bi-Weekly Touch Base.xlsx');

function examineExcelFile() {
  try {
    console.log('📊 Reading Excel file...');
    const workbook = XLSX.readFile(excelFilePath);
    
    console.log('\n📋 Available sheets:');
    workbook.SheetNames.forEach((name, index) => {
      console.log(`  ${index + 1}. ${name}`);
    });
    
    // Examine first few sheets in detail
    console.log('\n🔍 Examining sheet contents:');
    
    workbook.SheetNames.slice(0, 5).forEach(sheetName => {
      console.log(`\n--- Sheet: ${sheetName} ---`);
      const worksheet = workbook.Sheets[sheetName];
      
      // Get the range of the sheet
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
      console.log(`Range: ${worksheet['!ref']}`);
      
      // Show first 10 rows
      const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      console.log('First 10 rows:');
      sheetData.slice(0, 10).forEach((row, index) => {
        if (row && row.length > 0) {
          console.log(`  Row ${index + 1}:`, row.slice(0, 10)); // Show first 10 columns
        }
      });
    });
    
  } catch (error) {
    console.error('❌ Error examining Excel file:', error);
  }
}

examineExcelFile(); 