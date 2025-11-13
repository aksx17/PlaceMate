const puppeteer = require('puppeteer');

class IndeedScraper {
  constructor() {
    this.name = 'Indeed';
    this.baseURL = 'https://in.indeed.com';
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
        args: [
          '--no-sandbox', 
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu'
        ]
      });

      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      
      // Set a shorter timeout and use 'domcontentloaded' instead of 'networkidle2'
      const url = `${this.baseURL}/jobs?q=${encodeURIComponent(keywords)}&l=${encodeURIComponent(location)}`;
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      
      // Wait for job cards to appear - try multiple selectors
      const selectors = ['.job_seen_beacon', '.jobsearch-ResultsList', '.slider_item', 'div.job_seen_beacon'];
      let found = false;
      
      for (const selector of selectors) {
        try {
          await page.waitForSelector(selector, { timeout: 5000 });
          console.log(`✓ Indeed: Found jobs using selector: ${selector}`);
          found = true;
          break;
        } catch (e) {
          continue;
        }
      }
      
      if (!found) {
        console.log('⚠️ Indeed: No job cards found with any selector');
      }

      const jobs = await page.evaluate((maxJobs) => {
        const jobCards = document.querySelectorAll('.job_seen_beacon, .slider_item, .jobsearch-ResultsList li, div[data-jk], .jobCard');
        const results = [];
        
        console.log(`Found ${jobCards.length} job cards on page`);

        jobCards.forEach((card, index) => {
          if (results.length >= maxJobs) return;

          const titleElement = card.querySelector('.jobTitle, h2.jobTitle a, .job-title, [data-testid="job-title"]');
          const companyElement = card.querySelector('.companyName, span.companyName, .company, [data-testid="company-name"]');
          const locationElement = card.querySelector('.companyLocation, div.companyLocation, .job-location, [data-testid="text-location"]');
          const salaryElement = card.querySelector('.salary-snippet, .metadata.salary-snippet-container, .salary, [data-testid="attribute_snippet_testid"]');
          const summaryElement = card.querySelector('.job-snippet, .job-snippet ul, .job-snippet li, .jobCardShelfContainer, [data-testid="job-snippet"]');
          
          // Try to get job key from different possible attributes
          const jobKey = card.getAttribute('data-jk') || 
                        card.querySelector('[data-jk]')?.getAttribute('data-jk') ||
                        card.querySelector('a[id^="job_"]')?.id?.replace('job_', '') ||
                        card.querySelector('h2 a')?.href?.match(/jk=([^&]+)/)?.[1];

          if (titleElement && companyElement) {
            const snippet = summaryElement?.textContent.trim() || '';
            const title = titleElement.textContent.trim();
            const company = companyElement.textContent.trim();
            
            // Create a meaningful description even if snippet is empty
            const description = snippet || 
              `${title} position at ${company}. This is a ${title.toLowerCase().includes('senior') ? 'senior' : 'junior to mid'} level role. Visit the application link for complete job details, requirements, and benefits.`;

            results.push({
              title: title,
              company: company,
              location: locationElement?.textContent.trim() || '',
              salary: salaryElement?.textContent.trim() || '',
              description: description,
              applicationUrl: jobKey ? `https://in.indeed.com/viewjob?jk=${jobKey}` : '',
              sourceJobId: jobKey ? `indeed_${jobKey}` : `indeed_${Date.now()}_${index}`,
              source: 'indeed'
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
        job.techStack = this.extractTechStack(job.description);
      });

      console.log(`✅ Indeed: Scraped ${jobs.length} jobs`);
      if (jobs.length > 0) {
        console.log(`📋 Sample job: ${jobs[0].title} at ${jobs[0].company}`);
        console.log(`   Description length: ${jobs[0].description?.length || 0} chars`);
      }
      return jobs;

    } catch (error) {
      console.error('❌ Indeed Scraper Error:', error.message);
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
          description: document.querySelector('#jobDescriptionText')?.textContent.trim() || '',
          benefits: Array.from(document.querySelectorAll('.benefits-list li')).map(li => li.textContent.trim())
        };
      });

      return details;

    } catch (error) {
      console.error('Indeed Job Details Error:', error.message);
      return null;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  extractTechStack(description) {
    const commonTech = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP',
      'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel',
      'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP'
    ];

    const text = description.toLowerCase();
    return commonTech.filter(tech => text.includes(tech.toLowerCase()));
  }
}

module.exports = new IndeedScraper();
