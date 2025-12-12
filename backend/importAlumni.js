require('dotenv').config();
const mongoose = require('mongoose');
const XLSX = require('xlsx');
const path = require('path');
const NetworkingContact = require('./models/NetworkingContact');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/placemate', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Import alumni data from all sheets
const importAlumniData = async () => {
  try {
    console.log('\n🚀 Starting SMVDU Alumni Data Import...\n');

    // Read the Excel file
    const filePath = path.join(__dirname, 'school of cse SMVDU Alumni.xlsx');
    console.log(`📁 Reading file: ${filePath}`);
    
    const workbook = XLSX.readFile(filePath);
    console.log(`📊 Available sheets: ${workbook.SheetNames.join(', ')}\n`);

    const results = {
      total: 0,
      imported: 0,
      updated: 0,
      failed: 0,
      errors: [],
      bySheet: {}
    };

    // Process each sheet
    for (const sheetName of workbook.SheetNames) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📄 Processing Sheet: ${sheetName}`);
      console.log('='.repeat(60));

      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      console.log(`📋 Found ${data.length} rows in this sheet\n`);

      if (data.length === 0) {
        console.log('⚠️  No data found in this sheet, skipping...\n');
        continue;
      }

      // Determine batch year from sheet name (e.g., "18-22" -> 2022, "19-23" -> 2023)
      let graduationYear = 2022; // default
      const yearMatch = sheetName.match(/(\d{2})-(\d{2})/);
      if (yearMatch) {
        const endYear = parseInt('20' + yearMatch[2]);
        graduationYear = endYear;
      }

      const sheetResults = {
        imported: 0,
        updated: 0,
        failed: 0
      };

      // Process each row in this sheet
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const rowIndex = i + 1; // Excel rows are 1-indexed, but we add 1 to account for header
        
        try {
          // Get first column (handles different sheet formats)
          const firstColKey = Object.keys(row)[0];
          const firstCol = row[firstColKey];
          
          // Skip header row or empty rows
          if (!firstCol || firstCol === 'NAME' || firstCol.toLowerCase().includes('updated')) {
            continue;
          }

          // Extract data from columns (handles __EMPTY, __EMPTY_1, etc.)
          const name = row[firstColKey];
          const enrollmentNumber = row[Object.keys(row)[1]];
          const workInfo = row[Object.keys(row)[2]] || '';
          const contact = row[Object.keys(row)[3]] || '';
          const remark = row[Object.keys(row)[4]] || '';

          // Skip if no valid name
          if (!name || name.trim() === '') {
            continue;
          }

          // Parse work info (format: "Role @Company, Location" or "Role @Company")
          let currentRole = 'Not specified';
          let company = 'Not specified';
          let location = '';

          if (workInfo && workInfo.trim()) {
            const atMatch = workInfo.match(/(.+?)\s*@\s*(.+)/);
            if (atMatch) {
              currentRole = atMatch[1].trim();
              const companyLocation = atMatch[2].trim();
              
              const commaIndex = companyLocation.indexOf(',');
              if (commaIndex > -1) {
                company = companyLocation.substring(0, commaIndex).trim();
                location = companyLocation.substring(commaIndex + 1).trim();
              } else {
                company = companyLocation;
              }
            } else {
              currentRole = workInfo.trim();
            }
          }

          // Extract LinkedIn URL from hyperlink in contact column (column D)
          let linkedin = '';
          let email = '';
          
          // Try to get hyperlink from the cell (column D is index 3, so cell is like D2, D3, etc.)
          const contactCellAddress = `D${rowIndex + 1}`; // +1 because Excel is 1-indexed and we have header
          const contactCell = worksheet[contactCellAddress];
          
          if (contactCell && contactCell.l && contactCell.l.Target) {
            // Cell has a hyperlink
            linkedin = contactCell.l.Target;
            // Clean up the URL if needed
            if (linkedin && !linkedin.startsWith('http')) {
              linkedin = 'https://' + linkedin;
            }
          } else if (contact && contact.trim()) {
            // Fallback: try to parse from text
            if (contact.includes('linkedin.com')) {
              linkedin = contact.trim();
              if (!linkedin.startsWith('http')) {
                linkedin = 'https://' + linkedin;
              }
            } else if (contact.includes('@')) {
              email = contact.trim();
            }
          }

          // Build contact data
          const contactData = {
            name: name.trim(),
            currentRole: currentRole,
            company: company,
            location: location || '',
            bio: remark || '',
            
            education: [{
              institution: 'Shri Mata Vaishno Devi University',
              degree: 'B.Tech',
              field: 'Computer Science & Engineering',
              department: 'CSE',
              graduationYear: graduationYear
            }],
            
            skills: remark ? 
              remark.split('|').map(s => s.trim()).filter(s => s && s.length < 50)
              : [],
            
            contactLinks: {
              linkedin: linkedin,
              github: '',
              email: email,
              twitter: '',
              portfolio: ''
            },
            
            isAlumni: true,
            alumniOf: ['Shri Mata Vaishno Devi University', 'SMVDU'],
            batch: String(graduationYear),
            enrollmentNumber: enrollmentNumber || ''
          };

          // Check if contact already exists
          let existingContact = null;
          
          if (enrollmentNumber && enrollmentNumber.trim()) {
            existingContact = await NetworkingContact.findOne({
              enrollmentNumber: enrollmentNumber.trim()
            });
          }
          
          if (!existingContact && linkedin && linkedin.trim()) {
            existingContact = await NetworkingContact.findOne({
              'contactLinks.linkedin': linkedin.trim()
            });
          }
          
          if (!existingContact) {
            existingContact = await NetworkingContact.findOne({
              name: name.trim(),
              'education.institution': 'Shri Mata Vaishno Devi University'
            });
          }

          if (existingContact) {
            await NetworkingContact.findByIdAndUpdate(existingContact._id, contactData);
            results.updated++;
            sheetResults.updated++;
            console.log(`✓ Updated: ${name}`);
          } else {
            await NetworkingContact.create(contactData);
            results.imported++;
            sheetResults.imported++;
            console.log(`✓ Imported: ${name} - ${company}`);
          }

          results.total++;

        } catch (error) {
          results.failed++;
          sheetResults.failed++;
          results.errors.push({
            sheet: sheetName,
            row: i + 2,
            name: row[Object.keys(row)[0]] || 'Unknown',
            error: error.message
          });
          console.log(`✗ Failed: Row ${i + 2} - ${error.message}`);
        }
      }

      results.bySheet[sheetName] = sheetResults;
      console.log(`\n📊 Sheet "${sheetName}" Results:`);
      console.log(`   ✅ Imported: ${sheetResults.imported}`);
      console.log(`   🔄 Updated: ${sheetResults.updated}`);
      console.log(`   ❌ Failed: ${sheetResults.failed}`);
    }

    // Print overall results
    console.log('\n\n' + '='.repeat(60));
    console.log('📊 OVERALL IMPORT RESULTS');
    console.log('='.repeat(60));
    console.log(`Total Records:  ${results.total}`);
    console.log(`✅ Imported:    ${results.imported} (new alumni)`);
    console.log(`🔄 Updated:     ${results.updated} (existing records)`);
    console.log(`❌ Failed:      ${results.failed}`);
    console.log('='.repeat(60));

    if (results.errors.length > 0) {
      console.log('\n⚠️  Errors:');
      results.errors.forEach(err => {
        console.log(`  [${err.sheet}] Row ${err.row}: ${err.name || 'Unknown'} - ${err.error}`);
      });
    }

    console.log('\n✅ Import completed successfully!\n');

  } catch (error) {
    console.error('❌ Import Error:', error.message);
    throw error;
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await importAlumniData();
    
    console.log('🎉 All done! Closing database connection...\n');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal Error:', error);
    process.exit(1);
  }
};

main();
