const linkedinScraper = require('./linkedinScraper');
const glassdoorScraper = require('./glassdoorScraper');
const naukriScraper = require('./naukriScraper');
const unstopScraper = require('./unstopScraper');
const indeedScraper = require('./indeedScraper');
const Job = require('../../models/Job');

class ScraperOrchestrator {
  constructor() {
    this.scrapers = {
      linkedin: linkedinScraper,
      glassdoor: glassdoorScraper,
      naukri: naukriScraper,
      unstop: unstopScraper,
      indeed: indeedScraper
    };
  }

  /**
   * Run all scrapers
   */
  async scrapeAll(searchParams = {}) {
    console.log('🚀 Starting job scraping from all sources...');
    
    const results = {
      success: [],
      failed: [],
      totalJobs: 0
    };

    const scraperPromises = Object.entries(this.scrapers).map(async ([name, scraper]) => {
      try {
        console.log(`⏳ Scraping ${name}...`);
        const jobs = await scraper.scrapeJobs(searchParams);
        
        if (jobs && jobs.length > 0) {
          // Save jobs to database
          const saved = await this.saveJobs(jobs);
          results.success.push({
            source: name,
            count: saved
          });
          results.totalJobs += saved;
        } else {
          results.failed.push({
            source: name,
            error: 'No jobs found'
          });
        }
      } catch (error) {
        console.error(`❌ ${name} failed:`, error.message);
        results.failed.push({
          source: name,
          error: error.message
        });
      }
    });

    await Promise.allSettled(scraperPromises);

    console.log(`✅ Scraping complete! Total jobs: ${results.totalJobs}`);
    return results;
  }

  /**
   * Run specific scraper
   */
  async scrapeSingle(source, searchParams = {}) {
    const scraper = this.scrapers[source.toLowerCase()];
    
    if (!scraper) {
      throw new Error(`Scraper not found for source: ${source}`);
    }

    console.log(`🚀 Scraping ${source}...`);
    const jobs = await scraper.scrapeJobs(searchParams);
    
    if (jobs && jobs.length > 0) {
      const saved = await this.saveJobs(jobs);
      return {
        source,
        count: saved,
        jobs
      };
    }

    return {
      source,
      count: 0,
      jobs: []
    };
  }

  /**
   * Save jobs to database (avoid duplicates)
   */
  async saveJobs(jobs) {
    let savedCount = 0;

    console.log(`📝 Attempting to save ${jobs.length} jobs...`);

    for (const jobData of jobs) {
      try {
        // Validate required fields before saving
        if (!jobData.title || !jobData.company || !jobData.description) {
          console.log(`⚠️ Skipping job "${jobData.title || 'Unknown'}" from ${jobData.source} - missing: ${!jobData.title ? 'title ' : ''}${!jobData.company ? 'company ' : ''}${!jobData.description ? 'description' : ''}`);
          continue;
        }

        // Check if job already exists
        const exists = await Job.findOne({ sourceJobId: jobData.sourceJobId });

        if (!exists) {
          // Extract and structure the data properly
          const job = new Job({
            title: jobData.title,
            company: jobData.company,
            location: jobData.location,
            jobType: this.normalizeJobType(jobData.jobType),
            workMode: this.normalizeWorkMode(jobData.location),
            experience: jobData.experienceRange || this.parseExperience(jobData.experience),
            salary: jobData.salaryRange || this.parseSalary(jobData.salary),
            description: jobData.description,
            requirements: jobData.requirements || [],
            techStack: jobData.techStack || [],
            applicationUrl: jobData.applicationUrl,
            companyLogo: jobData.companyLogo,
            source: jobData.source,
            sourceJobId: jobData.sourceJobId,
            postedDate: jobData.postedDate,
            expiryDate: jobData.expiryDate,
            applicants: jobData.applicants || 0,
            metadata: {
              scrapedAt: new Date(),
              lastUpdated: new Date()
            }
          });

          await job.save();
          savedCount++;
          console.log(`✅ Saved: ${jobData.title} at ${jobData.company} (${jobData.source})`);
        } else {
          // Update existing job
          await Job.findOneAndUpdate(
            { sourceJobId: jobData.sourceJobId },
            {
              $set: {
                'metadata.lastUpdated': new Date(),
                applicants: jobData.applicants || exists.applicants
              }
            }
          );
          console.log(`🔄 Updated existing: ${jobData.title} (${jobData.source})`);
        }
      } catch (error) {
        console.error(`❌ Error saving job "${jobData.title}" from ${jobData.source}:`, error.message);
      }
    }

    console.log(`💾 Successfully saved ${savedCount} new jobs out of ${jobs.length} total`);
    return savedCount;
  }

  /**
   * Normalize job type
   */
  normalizeJobType(type) {
    if (!type) return undefined;
    const typeMap = {
      'full time': 'full-time',
      'fulltime': 'full-time',
      'part time': 'part-time',
      'parttime': 'part-time',
      'internship': 'internship',
      'contract': 'contract',
      'freelance': 'freelance'
    };
    return typeMap[type.toLowerCase()] || 'full-time';
  }

  /**
   * Normalize work mode based on location
   */
  normalizeWorkMode(location) {
    if (!location) return undefined;
    const loc = location.toLowerCase();
    if (loc.includes('remote')) return 'remote';
    if (loc.includes('hybrid')) return 'hybrid';
    return 'onsite';
  }

  /**
   * Parse experience string
   */
  parseExperience(expString) {
    if (!expString) return undefined;
    const match = expString.match(/(\d+)-(\d+)/);
    if (match) {
      return {
        min: parseInt(match[1]),
        max: parseInt(match[2]),
        unit: 'years'
      };
    }
    return undefined;
  }

  /**
   * Parse salary string
   */
  parseSalary(salaryString) {
    if (!salaryString) return undefined;
    const match = salaryString.match(/(\d+)(?:,(\d+))?(?:-|to)(\d+)(?:,(\d+))?/);
    if (match) {
      return {
        min: parseInt(match[1] + (match[2] || '')),
        max: parseInt(match[3] + (match[4] || '')),
        currency: 'INR',
        period: 'yearly'
      };
    }
    return undefined;
  }

  /**
   * Schedule periodic scraping
   */
  setupScheduledScraping() {
    const cron = require('node-cron');
    
    // Run every 6 hours
    cron.schedule(process.env.SCRAPER_INTERVAL || '0 */6 * * *', async () => {
      console.log('⏰ Running scheduled job scraping...');
      await this.scrapeAll();
    });

    console.log('✅ Scheduled scraping configured');
  }
}

module.exports = new ScraperOrchestrator();
