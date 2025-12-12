const XLSX = require('xlsx');
const NetworkingContact = require('../models/NetworkingContact');

// Upload and import alumni data from Excel
exports.importAlumniData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an Excel file'
      });
    }

    // Read the Excel file
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Excel file is empty'
      });
    }

    const importResults = {
      total: data.length,
      imported: 0,
      updated: 0,
      failed: 0,
      errors: []
    };

    // Process each row
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      try {
        // Map Excel columns to our schema
        const contactData = {
          name: row['Name'] || row['name'] || row['Full Name'],
          currentRole: row['Current Role'] || row['Role'] || row['Position'] || 'Not specified',
          company: row['Company'] || row['Current Company'] || row['Organization'] || 'Not specified',
          location: row['Location'] || row['City'],
          bio: row['Bio'] || row['About'],
          
          // Education
          education: [{
            institution: 'Shri Mata Vaishno Devi University',
            degree: row['Degree'] || row['Program'] || 'B.Tech',
            field: row['Field'] || row['Specialization'],
            department: row['Department'] || row['Branch'] || 'CSE',
            graduationYear: row['Graduation Year'] || row['Year'] || row['Batch']
          }],
          
          // Skills
          skills: row['Skills'] ? 
            (typeof row['Skills'] === 'string' ? row['Skills'].split(',').map(s => s.trim()) : []) 
            : [],
          
          // Contact Links
          contactLinks: {
            linkedin: row['LinkedIn'] || row['LinkedIn URL'] || row['linkedin'],
            github: row['GitHub'] || row['Github'] || row['github'],
            email: row['Email'] || row['email'],
            twitter: row['Twitter'] || row['twitter'],
            portfolio: row['Portfolio'] || row['Website']
          },
          
          // Alumni Status
          isAlumni: true,
          alumniOf: ['Shri Mata Vaishno Devi University', 'SMVDU'],
          
          // Additional metadata
          batch: row['Batch'] || row['Graduation Year'],
          enrollmentNumber: row['Enrollment Number'] || row['Roll Number']
        };

        // Validate required fields
        if (!contactData.name) {
          importResults.failed++;
          importResults.errors.push({
            row: i + 2, // Excel rows start at 2 (1 is header)
            error: 'Name is required'
          });
          continue;
        }

        // Check if contact already exists (by LinkedIn or Email)
        let existingContact = null;
        
        if (contactData.contactLinks.linkedin) {
          existingContact = await NetworkingContact.findOne({
            'contactLinks.linkedin': contactData.contactLinks.linkedin
          });
        } else if (contactData.contactLinks.email) {
          existingContact = await NetworkingContact.findOne({
            'contactLinks.email': contactData.contactLinks.email
          });
        }

        if (existingContact) {
          // Update existing contact
          await NetworkingContact.findByIdAndUpdate(existingContact._id, contactData);
          importResults.updated++;
        } else {
          // Create new contact
          await NetworkingContact.create(contactData);
          importResults.imported++;
        }

      } catch (error) {
        importResults.failed++;
        importResults.errors.push({
          row: i + 2,
          name: row['Name'] || 'Unknown',
          error: error.message
        });
      }
    }

    // Delete the uploaded file
    const fs = require('fs');
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      message: 'Alumni data import completed',
      results: importResults
    });

  } catch (error) {
    console.error('Alumni Import Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to import alumni data',
      error: error.message
    });
  }
};

// Get import statistics
exports.getAlumniStats = async (req, res) => {
  try {
    const stats = await NetworkingContact.aggregate([
      {
        $match: {
          isAlumni: true,
          alumniOf: { $in: ['Shri Mata Vaishno Devi University', 'SMVDU'] }
        }
      },
      {
        $facet: {
          byDepartment: [
            { $unwind: '$education' },
            { $group: { _id: '$education.department', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          byCompany: [
            { $group: { _id: '$company', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
          ],
          byYear: [
            { $unwind: '$education' },
            { $group: { _id: '$education.graduationYear', count: { $sum: 1 } } },
            { $sort: { _id: -1 } }
          ],
          total: [
            { $count: 'count' }
          ]
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: stats[0].total[0]?.count || 0,
        byDepartment: stats[0].byDepartment,
        byCompany: stats[0].byCompany,
        byYear: stats[0].byYear
      }
    });

  } catch (error) {
    console.error('Get Alumni Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get alumni statistics',
      error: error.message
    });
  }
};

// Download Excel template
exports.downloadTemplate = (req, res) => {
  try {
    // Create sample data
    const templateData = [
      {
        'Name': 'John Doe',
        'Email': 'john.doe@example.com',
        'LinkedIn': 'https://linkedin.com/in/johndoe',
        'GitHub': 'https://github.com/johndoe',
        'Current Role': 'Software Engineer',
        'Company': 'Google',
        'Location': 'Bangalore, India',
        'Department': 'CSE',
        'Degree': 'B.Tech',
        'Graduation Year': 2020,
        'Skills': 'JavaScript, React, Node.js, MongoDB',
        'Bio': 'Passionate software developer'
      }
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(templateData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 20 }, // Name
      { wch: 30 }, // Email
      { wch: 40 }, // LinkedIn
      { wch: 30 }, // GitHub
      { wch: 30 }, // Current Role
      { wch: 20 }, // Company
      { wch: 20 }, // Location
      { wch: 10 }, // Department
      { wch: 10 }, // Degree
      { wch: 15 }, // Graduation Year
      { wch: 40 }, // Skills
      { wch: 50 }  // Bio
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Alumni Data');

    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Send file
    res.setHeader('Content-Disposition', 'attachment; filename=SMVDU_Alumni_Template.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);

  } catch (error) {
    console.error('Download Template Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download template',
      error: error.message
    });
  }
};

// Get all SMVDU alumni
exports.getAllAlumni = async (req, res) => {
  try {
    const { department, batch, company } = req.query;
    
    // Build query
    const query = {
      isAlumni: true,
      alumniOf: { $in: ['Shri Mata Vaishno Devi University', 'SMVDU'] }
    };

    if (department) {
      query['education.department'] = department;
    }

    if (batch) {
      query.batch = batch;
    }

    if (company) {
      query.company = new RegExp(company, 'i');
    }

    const alumni = await NetworkingContact.find(query)
      .select('-__v')
      .sort({ 'education.graduationYear': -1, name: 1 });

    res.status(200).json({
      success: true,
      count: alumni.length,
      data: alumni
    });

  } catch (error) {
    console.error('Get All Alumni Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get alumni data',
      error: error.message
    });
  }
};
