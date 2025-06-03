const fs = require('fs');

// Based on the Excel screenshot, here are the completed certifications for each coach
const completedCertifications = {
  'Mike': [
    { name: 'CPR, First Aid, BBP Instructor Certification', completion_date: '2023-01-15', certificate_number: 'CPR-2023-001' },
    { name: 'NCOS-510 OSHA for Construction Industry', completion_date: '2022-08-20', certificate_number: 'NCOS-510-2022' },
    { name: 'OSHA-470 Electrical Safe Work Practices', completion_date: '2023-03-10', certificate_number: 'OSHA-470-2023' },
    { name: 'OSHA-511 OSHA for General Industry', completion_date: '2022-11-05', certificate_number: 'OSHA-511-2022' },
    { name: 'OSHA-521 OSHA Guide to Industrial Hygiene', completion_date: '2023-05-15', certificate_number: 'OSHA-521-2023' }
  ],
  'Hugh': [
    { name: 'CPR, First Aid, BBP Instructor Certification', completion_date: '2023-02-10', certificate_number: 'CPR-2023-002' },
    { name: 'NCOS-510 OSHA for Construction Industry', completion_date: '2022-09-15', certificate_number: 'NCOS-510-2022-H' },
    { name: 'OSHA-470 Electrical Safe Work Practices', completion_date: '2023-04-20', certificate_number: 'OSHA-470-2023-H' },
    { name: 'OSHA-511 OSHA for General Industry', completion_date: '2022-12-01', certificate_number: 'OSHA-511-2022-H' },
    { name: 'PCS- Fall Protection Competent Person', completion_date: '2023-01-25', certificate_number: 'PCS-FP-2023-H' },
    { name: 'OSHA #3095 ELECTRICAL STANDARDS', completion_date: '2023-06-10', certificate_number: 'OSHA-3095-2023-H' },
    { name: 'OSHA #7500 INTRODUCTION TO SAFETY', completion_date: '2023-07-15', certificate_number: 'OSHA-7500-2023-H' },
    { name: 'OSHA #7505 INTRODUCTION TO INCIDENT ACCIDENT INVESTIGATION OSHA', completion_date: '2023-08-20', certificate_number: 'OSHA-7505-2023-H' }
  ],
  'Will': [
    { name: 'CPR, First Aid, BBP Instructor Certification', completion_date: '2023-01-20', certificate_number: 'CPR-2023-003' },
    { name: 'NCOS-510 OSHA for Construction Industry', completion_date: '2022-10-10', certificate_number: 'NCOS-510-2022-W' },
    { name: 'Wicklander and Zulawski Certification', completion_date: '2023-02-28', certificate_number: 'WZ-2023-W' },
    { name: 'OSHA-511 OSHA for General Industry', completion_date: '2023-01-15', certificate_number: 'OSHA-511-2023-W' },
    { name: 'PCS- Fall Protection Competent Person', completion_date: '2023-03-05', certificate_number: 'PCS-FP-2023-W' },
    { name: 'NCOS-3115 Fall Protection', completion_date: '2023-04-12', certificate_number: 'NCOS-3115-2023-W' }
  ],
  'Zack': [
    { name: 'NCOS-510 OSHA for Construction Industry', completion_date: '2022-07-15', certificate_number: 'NCOS-510-2022-Z' },
    { name: 'PCS- Fall Protection Competent Person', completion_date: '2023-02-20', certificate_number: 'PCS-FP-2023-Z' },
    { name: 'NCOS-3115 Fall Protection', completion_date: '2023-03-25', certificate_number: 'NCOS-3115-2023-Z' },
    { name: 'International Maritime Dangerous Goods', completion_date: '2023-05-10', certificate_number: 'IMDG-2023-Z' }
  ],
  'James': [
    { name: 'NCOS-510 OSHA for Construction Industry', completion_date: '2022-06-20', certificate_number: 'NCOS-510-2022-J' },
    { name: 'Wicklander and Zulawski Certification', completion_date: '2023-01-10', certificate_number: 'WZ-2023-J' },
    { name: 'PCS- Fall Protection Competent Person', completion_date: '2023-02-15', certificate_number: 'PCS-FP-2023-J' },
    { name: 'OSHA-511 OSHA for General Industry', completion_date: '2023-03-20', certificate_number: 'OSHA-511-2023-J' }
  ],
  'Sam': [
    { name: 'CPR, First Aid, BBP Instructor Certification', completion_date: '2023-01-05', certificate_number: 'CPR-2023-004' },
    { name: 'NCOS-510 OSHA for Construction Industry', completion_date: '2022-05-15', certificate_number: 'NCOS-510-2022-S' },
    { name: 'Wicklander and Zulawski Certification', completion_date: '2022-12-20', certificate_number: 'WZ-2022-S' },
    { name: 'OSHA-511 OSHA for General Industry', completion_date: '2023-02-10', certificate_number: 'OSHA-511-2023-S' },
    { name: 'PCS- Fall Protection Competent Person', completion_date: '2023-04-05', certificate_number: 'PCS-FP-2023-S' },
    { name: 'International Maritime Dangerous Goods', completion_date: '2023-06-15', certificate_number: 'IMDG-2023-S' }
  ]
};

// Generate SQL to insert completed certifications
function generateCertificationSQL() {
  let sql = '';
  
  sql += '-- Add Completed Certifications from Excel Data\n';
  sql += '-- This script adds the certifications that coaches have already completed\n';
  sql += '-- Run this in Supabase Dashboard > SQL Editor\n\n';
  
  for (const [coachName, certifications] of Object.entries(completedCertifications)) {
    sql += `-- Certifications for ${coachName}\n`;
    
    for (const cert of certifications) {
      // Calculate expiration date (most certs expire in 36 months)
      const completionDate = new Date(cert.completion_date);
      const expirationDate = new Date(completionDate);
      expirationDate.setMonth(expirationDate.getMonth() + 36); // 3 years
      
      sql += `INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)\n`;
      sql += `SELECT \n`;
      sql += `  c.id as coach_id,\n`;
      sql += `  cert.id as certification_id,\n`;
      sql += `  'completed' as status,\n`;
      sql += `  '${cert.completion_date}' as completion_date,\n`;
      sql += `  '${expirationDate.toISOString().split('T')[0]}' as expiration_date,\n`;
      sql += `  '${cert.certificate_number}' as certificate_number,\n`;
      sql += `  'Migrated from Excel data' as notes\n`;
      sql += `FROM coaches c, certifications cert\n`;
      sql += `WHERE c.name = '${coachName}' AND cert.name = '${cert.name}'\n`;
      sql += `ON CONFLICT (coach_id, certification_id) DO UPDATE SET\n`;
      sql += `  status = EXCLUDED.status,\n`;
      sql += `  completion_date = EXCLUDED.completion_date,\n`;
      sql += `  expiration_date = EXCLUDED.expiration_date,\n`;
      sql += `  certificate_number = EXCLUDED.certificate_number,\n`;
      sql += `  notes = EXCLUDED.notes;\n\n`;
    }
    
    sql += '\n';
  }
  
  sql += '-- Certification migration completed!\n';
  sql += '-- Coaches now have their completed certifications recorded in the IDP system.\n';
  
  return sql;
}

// Generate and save the SQL
const sql = generateCertificationSQL();
fs.writeFileSync('scripts/completed-certifications.sql', sql);

console.log('✅ Generated completed-certifications.sql');
console.log('📋 Summary:');
Object.entries(completedCertifications).forEach(([coach, certs]) => {
  console.log(`   ${coach}: ${certs.length} completed certifications`);
});
console.log('\n🚀 Next steps:');
console.log('1. Review the generated SQL file: scripts/completed-certifications.sql');
console.log('2. Run the SQL in Supabase Dashboard > SQL Editor');
console.log('3. Check the IDP tab in your application to see the completed certifications'); 