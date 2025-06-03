const XLSX = require('xlsx');

// Read the Excel file
const workbook = XLSX.readFile('Regional Safety Coaches - Bi-Weekly Touch Base.xlsx');

console.log('Available sheets:', workbook.SheetNames);

// Look for IDP-related sheets
const idpSheets = workbook.SheetNames.filter(name => 
  name.toLowerCase().includes('idp') || 
  name.toLowerCase().includes('certification') ||
  name.toLowerCase().includes('training') ||
  name.toLowerCase().includes('development')
);

console.log('IDP-related sheets:', idpSheets);

// Examine each sheet to find the IDP tracker
workbook.SheetNames.forEach(sheetName => {
  console.log(`\n=== SHEET: ${sheetName} ===`);
  const worksheet = workbook.Sheets[sheetName];
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
  
  // Check if this sheet contains certification/IDP data
  let hasIdpData = false;
  const sampleData = [];
  
  // Sample first 10 rows to identify structure
  for (let row = range.s.r; row <= Math.min(range.s.r + 10, range.e.r); row++) {
    const rowData = [];
    for (let col = range.s.c; col <= Math.min(range.s.c + 10, range.e.c); col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = worksheet[cellAddress];
      const value = cell ? cell.v : '';
      rowData.push(value);
      
      // Check for IDP-related keywords
      if (typeof value === 'string' && (
        value.toLowerCase().includes('certification') ||
        value.toLowerCase().includes('osha') ||
        value.toLowerCase().includes('training') ||
        value.toLowerCase().includes('course') ||
        value.toLowerCase().includes('competent') ||
        value.toLowerCase().includes('instructor')
      )) {
        hasIdpData = true;
      }
    }
    sampleData.push(rowData);
  }
  
  if (hasIdpData) {
    console.log('*** POTENTIAL IDP DATA FOUND ***');
    console.log('Sample data:');
    sampleData.forEach((row, idx) => {
      console.log(`Row ${idx + 1}:`, row.slice(0, 8)); // Show first 8 columns
    });
  }
});

// Look specifically for the sheet shown in the screenshot
const certificationSheet = workbook.Sheets['IDP Tracker'] || 
                          workbook.Sheets['Certification'] ||
                          workbook.Sheets['Training'] ||
                          workbook.SheetNames.find(name => name.toLowerCase().includes('cert'));

if (certificationSheet) {
  console.log('\n=== DETAILED IDP TRACKER ANALYSIS ===');
  const data = XLSX.utils.sheet_to_json(certificationSheet, { header: 1 });
  
  console.log('Headers (first few rows):');
  data.slice(0, 5).forEach((row, idx) => {
    console.log(`Row ${idx + 1}:`, row);
  });
  
  console.log('\nCoach names and certifications:');
  // Look for coach names in headers
  const headerRow = data[0] || [];
  const coachColumns = headerRow.map((header, idx) => ({ header, idx }))
    .filter(item => typeof item.header === 'string' && 
      (item.header.toLowerCase().includes('mike') ||
       item.header.toLowerCase().includes('james') ||
       item.header.toLowerCase().includes('sam') ||
       item.header.toLowerCase().includes('will') ||
       item.header.toLowerCase().includes('hugh') ||
       item.header.toLowerCase().includes('joe') ||
       item.header.toLowerCase().includes('zack')));
  
  console.log('Coach columns found:', coachColumns);
  
  // Extract certification requirements
  console.log('\nCertification requirements:');
  data.slice(1, 20).forEach((row, idx) => {
    if (row[0] && typeof row[0] === 'string' && row[0].trim()) {
      console.log(`${idx + 2}: ${row[0]}`);
    }
  });
} 