const puppeteer = require('puppeteer');

class GlassdoorScraper {
  constructor() {
    this.name = 'Glassdoor';
    this.baseURL = 'https://www.glassdoor.co.in';
  }

  async scrapeJobs(searchParams = {}) {
    const {
      keywords = 'software engineer',
      location = 'India',
      maxJobs = 50
    } = searchParams;

    let browser;
    try {
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

      const url = `${this.baseURL}/Job/jobs.htm?sc.keyword=${encodeURIComponent(keywords)}&locT=N&locId=115&locKeyword=${encodeURIComponent(location)}`;
      
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      } catch (navError) {
        console.log('⚠️ Glassdoor: Navigation timeout, but continuing...');
      }
      
      // Wait for job listings to load - try multiple selectors
      const selectors = ['[data-test="jobListing"]', '.react-job-listing', 'li.jl', '.job-search-results', 'article'];
      let found = false;
      
      for (const selector of selectors) {
        try {
          await page.waitForSelector(selector, { timeout: 5000 });
          console.log(`✓ Glassdoor: Found jobs using selector: ${selector}`);
          found = true;
          break;
        } catch (e) {
          continue;
        }
      }
      
      if (!found) {
        console.log('⚠️ Glassdoor: No job listings found with any selector');
      }

      const jobs = await page.evaluate((maxJobs) => {
        const jobCards = document.querySelectorAll('[data-test="jobListing"], .react-job-listing, li.jl, .job-search-results article, .JobCard');
        const results = [];
        
        console.log(`Found ${jobCards.length} job cards on Glassdoor`);

        jobCards.forEach((card) => {
          if (results.length >= maxJobs) return;

          const titleElement = card.querySelector('[data-test="job-title"], .jobTitle, .job-title, h2 a, .JobCard_jobTitle');
          const companyElement = card.querySelector('[data-test="employer-name"], .employerName, .employer-name, .company, .EmployerProfile_employerName');
          const locationElement = card.querySelector('[data-test="emp-location"], .location, .jobLocation, .JobCard_location');
          const salaryElement = card.querySelector('[data-test="detailSalary"], .salary, .salaryText, .JobCard_salary');
          const linkElement = card.querySelector('[data-test="job-link"], a.jobLink, a.jobTitle, h2 a');

          if (titleElement && companyElement) {
            const jobUrl = linkElement?.getAttribute('href') || '';
            const jobId = jobUrl.split('jobListingId=')[1]?.split('&')[0] || 
                         jobUrl.split('/')[jobUrl.split('/').length - 1] ||
                         Date.now();
            const title = titleElement.textContent.trim();
            const company = companyElement.textContent.trim();

            // Create a meaningful description
            const description = `${title} position at ${company}. Visit the application link for complete job details and requirements.`;

            results.push({
              title: title,
              company: company,
              location: locationElement?.textContent.trim() || '',
              salary: salaryElement?.textContent.trim() || '',
              description: description,
              applicationUrl: jobUrl.startsWith('http') ? jobUrl : `https://www.glassdoor.co.in${jobUrl}`,
              sourceJobId: `glassdoor_${jobId}`,
              source: 'glassdoor'
            });
          }
        });

        console.log(`Extracted ${results.length} jobs from ${jobCards.length} cards`);
        return results;
      }, maxJobs);

      // Add metadata
      jobs.forEach(job => {
        job.postedDate = new Date();
        job.scrapedAt = new Date();
      });

      console.log(`✅ Glassdoor: Scraped ${jobs.length} jobs`);
      if (jobs.length > 0) {
        console.log(`📋 Sample job: ${jobs[0].title} at ${jobs[0].company}`);
        console.log(`   Description: ${jobs[0].description?.substring(0, 50)}...`);
      }
      return jobs;

    } catch (error) {
      console.error('❌ Glassdoor Scraper Error:', error.message);
      return [];
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  /**
   * Scrape detailed job information
   */
  async scrapeJobDetails(jobUrl) {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      await page.goto(jobUrl, { waitUntil: 'networkidle2', timeout: 30000 });

      const details = await page.evaluate(() => {
        return {
          description: document.querySelector('[data-test="jobDescriptionContent"]')?.textContent.trim() || '',
          benefits: document.querySelector('[data-test="benefits"]')?.textContent.trim() || ''
        };
      });

      return details;

    } catch (error) {
      console.error('Glassdoor Job Details Error:', error.message);
      return null;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}

module.exports = new GlassdoorScraper();
