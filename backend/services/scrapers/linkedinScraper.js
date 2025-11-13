const axios = require('axios');
const cheerio = require('cheerio');

class LinkedInScraper {
  constructor() {
    this.name = 'LinkedIn';
  }

  /**
   * Scrape LinkedIn jobs
   * Note: LinkedIn has anti-scraping measures. Consider using:
   * 1. LinkedIn API (requires partnership)
   * 2. RapidAPI LinkedIn scrapers
   * 3. Puppeteer with proxies and delays
   */
  async scrapeJobs(searchParams = {}) {
    const {
      keywords = 'software engineer',
      location = 'India',
      maxJobs = 50
    } = searchParams;

    try {
      // Using LinkedIn's public job search URL
      const url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${encodeURIComponent(keywords)}&location=${encodeURIComponent(location)}&start=0`;

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      const jobs = [];

      $('.job-search-card').each((index, element) => {
        if (jobs.length >= maxJobs) return false;

        const $job = $(element);
        const jobId = $job.attr('data-entity-urn')?.split(':').pop();
        
        // Get snippet as description, or use a default if not available
        const snippet = $job.find('.base-search-card__snippet').text().trim();
        const description = snippet || `${$job.find('.base-search-card__title').text().trim()} position at ${$job.find('.base-search-card__subtitle').text().trim()}. Visit the application link for full details.`;
        
        const job = {
          title: $job.find('.base-search-card__title').text().trim(),
          company: $job.find('.base-search-card__subtitle').text().trim(),
          location: $job.find('.job-search-card__location').text().trim(),
          description: description,
          applicationUrl: `https://www.linkedin.com/jobs/view/${jobId}`,
          source: 'linkedin',
          sourceJobId: `linkedin_${jobId}`,
          postedDate: this.parsePostedDate($job.find('time').attr('datetime')),
          scrapedAt: new Date()
        };

        // Only add jobs with required fields
        if (job.title && job.company && job.description) {
          jobs.push(job);
        }
      });

      console.log(`✅ LinkedIn: Scraped ${jobs.length} jobs`);
      if (jobs.length > 0) {
        console.log(`📋 Sample job: ${jobs[0].title} at ${jobs[0].company}`);
        console.log(`   Description: ${jobs[0].description?.substring(0, 50)}...`);
        console.log(`   Has description: ${!!jobs[0].description}, Length: ${jobs[0].description?.length || 0}`);
      }
      return jobs;

    } catch (error) {
      console.error('❌ LinkedIn Scraper Error:', error.message);
      return [];
    }
  }

  /**
   * Scrape detailed job information
   */
  async scrapeJobDetails(jobUrl) {
    try {
      const response = await axios.get(jobUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const $ = cheerio.load(response.data);

      return {
        description: $('.show-more-less-html__markup').text().trim(),
        requirements: this.extractRequirements($),
        techStack: this.extractTechStack($)
      };

    } catch (error) {
      console.error('LinkedIn Job Details Error:', error.message);
      return null;
    }
  }

  extractRequirements($) {
    // Extract requirements from job description
    const requirements = [];
    const text = $('.show-more-less-html__markup').text();
    
    // Look for common requirement patterns
    const reqPatterns = [
      /requirements?:(.+?)(?=responsibilities|qualifications|$)/is,
      /qualifications?:(.+?)(?=responsibilities|requirements|$)/is,
      /must have:(.+?)(?=nice to have|responsibilities|$)/is
    ];

    reqPatterns.forEach(pattern => {
      const match = text.match(pattern);
      if (match) {
        const items = match[1].split(/[•\n-]/).filter(item => item.trim().length > 0);
        requirements.push(...items.map(item => item.trim()));
      }
    });

    return requirements.slice(0, 10);
  }

  extractTechStack($) {
    const commonTech = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP',
      'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel',
      'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
      'Git', 'CI/CD', 'REST', 'GraphQL', 'Microservices', 'Machine Learning', 'AI', 'TensorFlow'
    ];

    const text = $('.show-more-less-html__markup').text().toLowerCase();
    const foundTech = commonTech.filter(tech => text.includes(tech.toLowerCase()));

    return foundTech;
  }

  parsePostedDate(dateString) {
    if (!dateString) return null;
    return new Date(dateString);
  }
}

module.exports = new LinkedInScraper();
