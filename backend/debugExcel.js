const XLSX = require('xlsx');
const path = require('path');

// Read the Excel file
const filePath = path.join(__dirname, 'school of cse SMVDU Alumni.xlsx');
console.log(`📁 Reading file: ${filePath}\n`);

const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
console.log(`📊 Sheet Name: ${sheetName}\n`);

const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

console.log(`📋 Total Rows: ${data.length}\n`);

if (data.length > 0) {
  console.log('📌 Column Headers (from first row):');
  console.log('='.repeat(50));
  const headers = Object.keys(data[0]);
  headers.forEach((header, index) => {
    console.log(`${index + 1}. "${header}"`);
  });
  
  console.log('\n📄 First 3 rows of data:');
  console.log('='.repeat(50));
  data.slice(0, 3).forEach((row, index) => {
    console.log(`\nRow ${index + 1}:`);
    console.log(JSON.stringify(row, null, 2));
  });
} else {
  console.log('⚠️  No data found in the Excel file');
}
