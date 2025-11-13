const axios = require('axios');
const cheerio = require('cheerio');

class UnstopScraper {
  constructor() {
    this.name = 'Unstop';
    this.baseURL = 'https://unstop.com';
  }

  async scrapeJobs(searchParams = {}) {
    const {
      category = 'job',
      maxJobs = 50
    } = searchParams;

    try {
      // Unstop API endpoint for opportunities
      const url = `${this.baseURL}/api/public/opportunity/search-result?opportunity=${category}`;

      console.log(`🔍 Unstop URL: ${url}`);

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Referer': 'https://unstop.com/jobs',
          'Origin': 'https://unstop.com'
        },
        timeout: 10000
      });

      const jobs = [];
      const opportunities = response.data?.data?.data || response.data?.data || [];
      
      console.log(`📋 Unstop: API response structure:`, Object.keys(response.data || {}));
      console.log(`📋 Unstop: Found ${opportunities.length} opportunities in API response`);
      
      if (opportunities.length === 0 && response.data) {
        console.log(`⚠️ Unstop: Empty response, data keys:`, Object.keys(response.data));
      }

      opportunities.slice(0, maxJobs).forEach(opp => {
        const title = opp.title || 'Opportunity';
        const company = opp.organisation?.name || 'Unknown';
        const snippet = opp.description || '';
        
        // Create a meaningful description
        const description = snippet || 
          `${title} opportunity at ${company}. This is a great opportunity for students and professionals. Visit the application link for complete details.`;
        
        const job = {
          title: title,
          company: company,
          location: opp.locations?.map(loc => loc.name).join(', ') || 'Remote',
          jobType: opp.type,
          description: description,
          applicationUrl: `${this.baseURL}/opportunity/${opp.public_url}`,
          companyLogo: opp.organisation?.logo,
          source: 'unstop',
          sourceJobId: `unstop_${opp.id}`,
          postedDate: new Date(opp.start_date),
          expiryDate: new Date(opp.end_date),
          applicants: opp.impressions || 0,
          techStack: opp.tags?.map(tag => tag.name) || [],
          requirements: this.extractRequirements(opp),
          scrapedAt: new Date()
        };

        if (job.title && job.company) {
          jobs.push(job);
        }
      });

      console.log(`✅ Unstop: Scraped ${jobs.length} jobs`);
      if (jobs.length > 0) {
        console.log(`📋 Sample job: ${jobs[0].title} at ${jobs[0].company}`);
        console.log(`   Description: ${jobs[0].description?.substring(0, 50)}...`);
      }
      return jobs;

    } catch (error) {
      console.error('❌ Unstop Scraper Error:', error.message);
      return [];
    }
  }

  extractRequirements(opportunity) {
    const requirements = [];
    
    // Extract from eligibility
    if (opportunity.eligibility) {
      requirements.push(opportunity.eligibility);
    }

    // Extract from filters
    if (opportunity.filters) {
      opportunity.filters.forEach(filter => {
        if (filter.values) {
          filter.values.forEach(value => {
            requirements.push(value.name);
          });
        }
      });
    }

    return requirements;
  }

  /**
   * Get detailed job information
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
        fullDescription: $('.opportunity-description').text().trim(),
        eligibility: $('.eligibility-criteria').text().trim(),
        prizes: $('.prizes-section').text().trim(),
        perks: $('.perks-section').text().trim()
      };

    } catch (error) {
      console.error('Unstop Job Details Error:', error.message);
      return null;
    }
  }
}

module.exports = new UnstopScraper();
