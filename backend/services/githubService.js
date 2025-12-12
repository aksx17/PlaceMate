const axios = require('axios');

class GitHubService {
  constructor() {
    this.baseURL = 'https://api.github.com';
    this.token = process.env.GITHUB_TOKEN;
  }

  /**
   * Get user profile
   */
  async getUserProfile(username) {
    try {
      if (!username) {
        throw new Error('GitHub username is required');
      }

      // Extract username from URL if provided
      const cleanUsername = this.extractUsername(username);

      const response = await axios.get(`${this.baseURL}/users/${cleanUsername}`, {
        headers: {
          Authorization: `token ${this.token}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });

      return {
        name: response.data.name,
        bio: response.data.bio,
        location: response.data.location,
        email: response.data.email,
        blog: response.data.blog,
        company: response.data.company,
        followers: response.data.followers,
        following: response.data.following,
        publicRepos: response.data.public_repos,
        avatarUrl: response.data.avatar_url,
        githubUrl: response.data.html_url
      };
    } catch (error) {
      if (error.response?.status === 404) {
        console.error(`GitHub API Error: User '${username}' not found`);
        throw new Error(`GitHub user '${username}' does not exist`);
      }
      console.error('GitHub API Error:', error.message);
      throw new Error('Failed to fetch GitHub profile');
    }
  }

  /**
   * Extract username from GitHub URL or return as-is
   */
  extractUsername(input) {
    if (!input) return input;
    
    // Remove any whitespace
    const trimmed = input.trim();
    
    // Check if it's a URL and extract username
    const urlPatterns = [
      /^https?:\/\/github\.com\/([^\/]+)/i,  // https://github.com/username
      /^github\.com\/([^\/]+)/i,              // github.com/username
      /^www\.github\.com\/([^\/]+)/i         // www.github.com/username
    ];
    
    for (const pattern of urlPatterns) {
      const match = trimmed.match(pattern);
      if (match && match[1]) {
        console.log(`✓ Extracted username '${match[1]}' from '${trimmed}'`);
        return match[1];
      }
    }
    
    // Not a URL, return as-is (assuming it's already a username)
    return trimmed;
  }

  /**
   * Get user repositories
   */
  async getUserRepositories(username, maxRepos = 20) {
    try {
      // Extract username from URL if provided
      const cleanUsername = this.extractUsername(username);
      
      const response = await axios.get(`${this.baseURL}/users/${cleanUsername}/repos`, {
        headers: {
          Authorization: `token ${this.token}`,
          Accept: 'application/vnd.github.v3+json'
        },
        params: {
          sort: 'updated',
          per_page: maxRepos,
          type: 'owner'
        }
      });

      return response.data.map(repo => ({
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        language: repo.language,
        languages: [], // Will be fetched separately
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        topics: repo.topics,
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        homepage: repo.homepage,
        isPrivate: repo.private
      }));
    } catch (error) {
      console.error('GitHub API Error:', error.message);
      throw new Error('Failed to fetch GitHub repositories');
    }
  }

  /**
   * Get repository languages
   */
  async getRepositoryLanguages(username, repoName) {
    try {
      // Extract username from URL if provided
      const cleanUsername = this.extractUsername(username);
      
      const response = await axios.get(
        `${this.baseURL}/repos/${cleanUsername}/${repoName}/languages`,
        {
          headers: {
            Authorization: `token ${this.token}`,
            Accept: 'application/vnd.github.v3+json'
          }
        }
      );

      return Object.keys(response.data);
    } catch (error) {
      console.error('GitHub API Error:', error.message);
      return [];
    }
  }

  /**
   * Get comprehensive user data
   */
  async getComprehensiveUserData(username) {
    try {
      const profile = await this.getUserProfile(username);
      const repos = await this.getUserRepositories(username);

      // Fetch languages for top 5 repos
      const topRepos = repos.slice(0, 5);
      for (let repo of topRepos) {
        repo.languages = await this.getRepositoryLanguages(username, repo.name);
      }

      // Extract all unique technologies
      const allLanguages = new Set();
      const allTopics = new Set();

      repos.forEach(repo => {
        if (repo.language) allLanguages.add(repo.language);
        repo.languages.forEach(lang => allLanguages.add(lang));
        repo.topics.forEach(topic => allTopics.add(topic));
      });

      return {
        profile,
        repositories: repos,
        projects: topRepos,
        skills: {
          languages: Array.from(allLanguages),
          topics: Array.from(allTopics)
        },
        stats: {
          totalRepos: repos.length,
          totalStars: repos.reduce((sum, repo) => sum + repo.stars, 0),
          totalForks: repos.reduce((sum, repo) => sum + repo.forks, 0),
          languages: Array.from(allLanguages)
        }
      };
    } catch (error) {
      console.error('GitHub Service Error:', error.message);
      throw error;
    }
  }

  /**
   * Extract technical skills from GitHub repositories
   * Returns structured skill data with proficiency indicators
   */
  async extractSkillsFromGitHub(username) {
    try {
      const userData = await this.getComprehensiveUserData(username);
      const { repositories, skills, stats } = userData;

      // Categorize technologies
      const programmingLanguages = [];
      const frameworks = [];
      const tools = [];
      const databases = [];

      // Common framework keywords
      const frameworkKeywords = ['react', 'vue', 'angular', 'django', 'flask', 'express', 'spring', 'laravel', 'rails', 'nextjs', 'nuxt'];
      const databaseKeywords = ['mongodb', 'mysql', 'postgresql', 'redis', 'firebase', 'dynamodb', 'sqlite'];
      const toolKeywords = ['docker', 'kubernetes', 'git', 'jenkins', 'webpack', 'babel', 'jest', 'graphql', 'rest-api'];

      // Process languages
      skills.languages.forEach(lang => {
        programmingLanguages.push({
          name: lang,
          source: 'github',
          proficiencyLevel: this.estimateProficiency(lang, repositories)
        });
      });

      // Process topics and categorize them
      skills.topics.forEach(topic => {
        const lowerTopic = topic.toLowerCase();
        
        if (frameworkKeywords.some(fw => lowerTopic.includes(fw))) {
          frameworks.push({
            name: topic,
            source: 'github',
            proficiencyLevel: this.estimateProficiency(topic, repositories)
          });
        } else if (databaseKeywords.some(db => lowerTopic.includes(db))) {
          databases.push({
            name: topic,
            source: 'github',
            proficiencyLevel: this.estimateProficiency(topic, repositories)
          });
        } else if (toolKeywords.some(tool => lowerTopic.includes(tool))) {
          tools.push({
            name: topic,
            source: 'github',
            proficiencyLevel: this.estimateProficiency(topic, repositories)
          });
        } else {
          tools.push({
            name: topic,
            source: 'github',
            proficiencyLevel: 'intermediate'
          });
        }
      });

      // Combine all skills
      const allSkills = [
        ...programmingLanguages,
        ...frameworks,
        ...databases,
        ...tools
      ];

      return {
        skills: allSkills,
        categorized: {
          programmingLanguages,
          frameworks,
          databases,
          tools
        },
        projects: repositories.slice(0, 10).map(repo => ({
          name: repo.name,
          description: repo.description,
          technologies: [repo.language, ...repo.languages, ...repo.topics].filter(Boolean),
          url: repo.url,
          stars: repo.stars
        }))
      };
    } catch (error) {
      console.error('GitHub Skills Extraction Error:', error.message);
      throw error;
    }
  }

  /**
   * Estimate proficiency level based on repository usage
   */
  estimateProficiency(technology, repositories) {
    const relatedRepos = repositories.filter(repo => {
      const techLower = technology.toLowerCase();
      return (
        repo.language?.toLowerCase() === techLower ||
        repo.languages?.some(l => l.toLowerCase() === techLower) ||
        repo.topics?.some(t => t.toLowerCase().includes(techLower)) ||
        repo.description?.toLowerCase().includes(techLower)
      );
    });

    const repoCount = relatedRepos.length;
    const totalStars = relatedRepos.reduce((sum, repo) => sum + repo.stars, 0);

    // Determine proficiency based on usage
    if (repoCount >= 5 || totalStars >= 10) {
      return 'advanced';
    } else if (repoCount >= 2) {
      return 'intermediate';
    } else {
      return 'beginner';
    }
  }
}

module.exports = new GitHubService();

