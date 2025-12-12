# SMVDU Alumni Data - Excel Template Guide

## Overview
This guide explains how to prepare your alumni data in Excel format for uploading to PlaceMate's Networking Helper.

## Excel Template Columns

### Required Columns

| Column Name | Description | Example | Required |
|------------|-------------|---------|----------|
| **Name** | Full name of the alumni | John Doe | ✅ Yes |
| **Email** | Email address | john.doe@example.com | ⚠️ Recommended |
| **Current Role** | Current job title | Software Engineer | ✅ Yes |
| **Company** | Current company name | Google | ✅ Yes |

### Optional but Recommended Columns

| Column Name | Description | Example |
|------------|-------------|---------|
| **LinkedIn** | LinkedIn profile URL | https://linkedin.com/in/johndoe |
| **GitHub** | GitHub profile URL | https://github.com/johndoe |
| **Location** | Current city/country | Bangalore, India |
| **Department** | SMVDU Department | CSE |
| **Degree** | Degree obtained | B.Tech |
| **Graduation Year** | Year of graduation | 2020 |
| **Skills** | Comma-separated skills | JavaScript, React, Node.js, MongoDB |
| **Bio** | Brief description | Passionate software developer with 3 years experience |

### Additional Optional Columns

| Column Name | Description | Example |
|------------|-------------|---------|
| **Twitter** | Twitter profile URL | https://twitter.com/johndoe |
| **Portfolio** | Personal website | https://johndoe.com |
| **Batch** | Graduation batch | 2020 |
| **Enrollment Number** | SMVDU enrollment number | 18BTCSE001 |

## Template Format

### Sample Data Row

```
Name: Amit Kumar
Email: amit.kumar@company.com
LinkedIn: https://linkedin.com/in/amitkumar
GitHub: https://github.com/amitkumar
Current Role: Senior Software Engineer
Company: Microsoft
Location: Hyderabad, India
Department: CSE
Degree: B.Tech
Graduation Year: 2019
Skills: Python, Django, Machine Learning, AWS
Bio: SMVDU CSE 2019 graduate working on AI/ML projects at Microsoft
```

## How to Prepare Your Data

### Step 1: Download Template
1. Go to PlaceMate → Alumni Upload page
2. Click "Download Template"
3. Open the downloaded Excel file

### Step 2: Fill in Data
1. **Don't delete the header row** (row 1)
2. Start entering data from row 2
3. Fill in as many columns as you have data for
4. For **Skills**: Use comma-separated values (e.g., "Java, Spring, MySQL")
5. For **LinkedIn/GitHub**: Use full URLs (e.g., "https://linkedin.com/in/username")

### Step 3: Data Validation
Before uploading, check:
- ✅ Name is filled for every row
- ✅ Current Role is filled
- ✅ Company is filled
- ✅ LinkedIn or Email is provided (for uniqueness)
- ✅ No extra blank rows at the end
- ✅ Skills are comma-separated

### Step 4: Upload
1. Save your Excel file
2. Go to Alumni Upload page
3. Click "Select Excel File"
4. Choose your file
5. Click "Upload Alumni Data"

## Field Details

### Department Values
Use standard abbreviations:
- **CSE** - Computer Science & Engineering
- **ECE** - Electronics & Communication Engineering
- **ME** - Mechanical Engineering
- **CE** - Civil Engineering
- **EE** - Electrical Engineering

### Skills Format
Separate multiple skills with commas:
```
Good: "JavaScript, React, Node.js, MongoDB, AWS"
Bad: "JavaScript; React; Node.js"
```

### LinkedIn URL Format
Use the full LinkedIn profile URL:
```
Good: "https://linkedin.com/in/johndoe"
Also Good: "https://www.linkedin.com/in/johndoe"
Bad: "linkedin.com/johndoe"
Bad: "johndoe"
```

### GitHub URL Format
Use the full GitHub profile URL:
```
Good: "https://github.com/johndoe"
Also Good: "https://www.github.com/johndoe"
Bad: "github.com/johndoe"
Bad: "johndoe"
```

## Import Behavior

### New Alumni
If the system doesn't find an existing record (based on LinkedIn or Email), it will create a new contact.

### Existing Alumni
If the system finds an existing record (same LinkedIn or Email), it will **update** the information with new data from your Excel file.

### Error Handling
If a row has errors:
- The system will skip that row
- Continue processing other rows
- Show you a detailed error report at the end

## Common Errors and Solutions

### Error: "Name is required"
**Solution**: Make sure the Name column has a value for that row

### Error: "Invalid Excel format"
**Solution**: Make sure you're uploading a .xlsx or .xls file

### Error: "Excel file is empty"
**Solution**: Add at least one row of data below the header row

### Error: "File size too large"
**Solution**: Break your data into smaller files (max 10MB per file)

## Tips for Best Results

### 1. Complete Profiles Get Better Matches
Alumni with more information (LinkedIn, skills, bio) will:
- Rank higher in search results
- Get better relevance scores
- Provide more connection options

### 2. Keep Skills Updated
Use current, relevant technology skills:
- Include programming languages
- Frameworks and libraries
- Cloud platforms
- Tools and methodologies

### 3. Verify Contact Links
Before uploading:
- Test LinkedIn URLs in your browser
- Verify GitHub usernames exist
- Check email addresses for typos

### 4. Standardize Company Names
Use consistent company names:
```
Good: "Microsoft"
Bad: "Microsoft Corporation", "MSFT", "Microsoft India"
```

### 5. Use Proper Case
```
Good: "John Doe"
Bad: "JOHN DOE" or "john doe"
```

## Example Excel Layout

| Name | Email | LinkedIn | Current Role | Company | Department | Graduation Year | Skills |
|------|-------|----------|-------------|---------|------------|----------------|--------|
| Amit Kumar | amit@company.com | https://linkedin.com/in/amit | Software Engineer | Google | CSE | 2019 | Python, Django, React |
| Priya Singh | priya@startup.com | https://linkedin.com/in/priya | Data Scientist | Amazon | CSE | 2020 | Machine Learning, Python, SQL |
| Rahul Sharma | rahul@tech.com | https://linkedin.com/in/rahul | Frontend Developer | Microsoft | CSE | 2018 | React, JavaScript, TypeScript |

## After Upload

### View Results
After upload, you'll see:
- **Total rows** processed
- **Imported**: New alumni added
- **Updated**: Existing alumni updated
- **Failed**: Rows with errors

### Check Statistics
The dashboard shows:
- Total alumni count
- Top companies where alumni work
- Department-wise distribution
- Batch-wise distribution

### Verify Data
Go to Networking Helper to:
- Search for uploaded alumni
- Verify their information appears correctly
- Test the networking message generation

## Getting Help

### Data Collection
If you don't have all the data:
1. Start with basic info (Name, Role, Company)
2. Add LinkedIn URLs (students can search and add)
3. Gradually update with more details
4. Re-upload the same file to update records

### Template Issues
If the template doesn't work:
1. Make sure you're using Excel (.xlsx)
2. Don't add or remove columns
3. Don't use merged cells
4. Save as Excel Workbook format

### Need Support?
- Check the error report after upload
- Verify your data matches the examples above
- Try uploading a small sample first (5-10 rows)

---

**Note**: The system automatically sets:
- Institution = "Shri Mata Vaishno Devi University"
- isAlumni = true
- alumniOf = ["SMVDU", "Shri Mata Vaishno Devi University"]

You don't need to include these in your Excel file.
