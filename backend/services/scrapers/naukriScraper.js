const axios = require('axios');
const cheerio = require('cheerio');

class NaukriScraper {
  constructor() {
    this.name = 'Naukri';
    this.baseURL = 'https://www.naukri.com';
  }

  async scrapeJobs(searchParams = {}) {
    const {
      keywords = 'software engineer',
      location = '',
      experience = '0-3',
      maxJobs = 50
    } = searchParams;

    try {
      const searchQuery = keywords.replace(/\s+/g, '-');
      const locationQuery = location.replace(/\s+/g, '-');
      
      const url = `${this.baseURL}/${searchQuery}-jobs${locationQuery ? `-in-${locationQuery}` : ''}?experience=${experience}`;

      console.log(`🔍 Naukri URL: ${url}`);

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      const jobs = [];

      const jobCards = $('.jobTuple, .srp-jobtuple-wrapper, article.jobTuple');
      console.log(`📋 Naukri: Found ${jobCards.length} job cards`);

      jobCards.each((index, element) => {
        if (jobs.length >= maxJobs) return false;

        const $job = $(element);
        const jobId = $job.attr('data-job-id');
        
        const title = $job.find('.title').text().trim();
        const company = $job.find('.companyInfo .subTitle').text().trim();
        const snippet = $job.find('.job-description').text().trim();
        
        // Create a meaningful description
        const description = snippet || 
          `${title} position at ${company}. Check the application link for complete job description, requirements, and benefits.`;
        
        const job = {
          title: title,
          company: company,
          location: $job.find('.location .ellipsis').text().trim(),
          experience: $job.find('.experience .ellipsis').text().trim(),
          salary: $job.find('.salary .ellipsis').text().trim(),
          description: description,
          techStack: this.extractTechStack($job.find('.tags').text()),
          applicationUrl: $job.find('.title').attr('href') || `${this.baseURL}/job-listings-${jobId}`,
          source: 'naukri',
          sourceJobId: `naukri_${jobId}`,
          postedDate: this.parsePostedDate($job.find('.footerLeft .fleft.date').text()),
          scrapedAt: new Date()
        };

        // Parse experience
        const expMatch = job.experience.match(/(\d+)-(\d+)/);
        if (expMatch) {
          job.experienceRange = {
            min: parseInt(expMatch[1]),
            max: parseInt(expMatch[2])
          };
        }

        // Parse salary
        const salaryMatch = job.salary.match(/(\d+)-(\d+)/);
        if (salaryMatch) {
          job.salaryRange = {
            min: parseInt(salaryMatch[1]),
            max: parseInt(salaryMatch[2]),
            currency: 'INR',
            period: 'yearly'
          };
        }

        if (job.title && job.company) {
          jobs.push(job);
        }
      });

      console.log(`✅ Naukri: Scraped ${jobs.length} jobs`);
      if (jobs.length > 0) {
        console.log(`📋 Sample job: ${jobs[0].title} at ${jobs[0].company}`);
        console.log(`   Description: ${jobs[0].description?.substring(0, 50)}...`);
      }
      return jobs;

    } catch (error) {
      console.error('❌ Naukri Scraper Error:', error.message);
      console.error('   Stack:', error.stack?.split('\n')[0]);
      return [];
    }
  }

  extractTechStack(tagsText) {
    const tags = tagsText.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    return tags;
  }

  parsePostedDate(dateText) {
    if (!dateText) return null;
    
    const text = dateText.toLowerCase().trim();
    const now = new Date();
    
    if (text.includes('today')) {
      return now;
    } else if (text.includes('yesterday')) {
      return new Date(now.setDate(now.getDate() - 1));
    } else if (text.includes('days ago')) {
      const days = parseInt(text.match(/(\d+)/)?.[1] || 0);
      return new Date(now.setDate(now.getDate() - days));
    }
    
    return null;
  }
}

module.exports = new NaukriScraper();
