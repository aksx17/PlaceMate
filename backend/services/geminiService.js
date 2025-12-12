const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Updated to use gemini-2.5-pro (recommended model as of Nov 2024)
    // Alternative: 'gemini-1.5-pro' for more advanced reasoning
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
  }

  /**
   * Generate tailored resume content
   */
  async generateResumeContent(userData, jobDescription) {
    const prompt = `
You are an expert resume writer. Generate a tailored resume content based on the following:

USER PROFILE:
- GitHub Projects: ${JSON.stringify(userData.githubProjects, null, 2)}
- LinkedIn Profile: ${JSON.stringify(userData.linkedinData, null, 2)}
- Skills: ${userData.skills.join(', ')}

JOB DESCRIPTION:
${jobDescription}

Please generate:
1. A professional summary (2-3 sentences) tailored to this job
2. Key skills to highlight (matching job requirements)
3. Improved project descriptions that emphasize relevant technologies
4. Achievement statements for each experience
5. Keywords to include for ATS optimization

Return the response as a JSON object with the following structure:
{
  "summary": "...",
  "skills": ["skill1", "skill2"],
  "projects": [{"name": "...", "description": "...", "highlights": ["..."]}],
  "experience": [{"highlights": ["..."]}],
  "keywords": ["..."]
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from markdown code blocks if present
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : text;
      
      return JSON.parse(jsonText);
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate resume content');
    }
  }

  /**
   * Generate interview questions
   */
  async generateInterviewQuestions(userData, jobDescription, difficulty = 'medium') {
    const prompt = `
You are an expert technical interviewer. Generate interview questions based on:

USER BACKGROUND:
- GitHub: ${JSON.stringify(userData.githubProjects?.slice(0, 3), null, 2)}
- LinkedIn: ${JSON.stringify(userData.linkedinData, null, 2)}
- Skills: ${userData.skills.join(', ')}

JOB DESCRIPTION:
${jobDescription}

Generate 10 interview questions with the following distribution:
- 4 Technical questions (based on required skills and user's experience)
- 3 Behavioral questions (STAR method)
- 2 Situational questions
- 1 Company/role-specific question

Difficulty level: ${difficulty}

For each question, provide:
1. The question itself
2. A comprehensive model answer (3-5 sentences) that demonstrates what a strong candidate would say
3. Key points that should be covered in a good answer

Return as JSON array:
[
  {
    "question": "...",
    "category": "technical|behavioral|situational|company-specific",
    "difficulty": "easy|medium|hard",
    "expectedAnswer": "A detailed model answer (3-5 sentences) showing how a strong candidate would respond. Include specific examples, technical details, and demonstrate deep understanding.",
    "keyPoints": ["point1", "point2", "point3"]
  }
]
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : text;
      
      return JSON.parse(jsonText);
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate interview questions');
    }
  }

  /**
   * Evaluate interview answer
   */
  async evaluateAnswer(question, userAnswer, expectedAnswer) {
    const prompt = `
You are an expert interview evaluator. Evaluate this interview answer:

QUESTION: ${question}

USER'S ANSWER: ${userAnswer}

EXPECTED ANSWER GUIDELINE: ${expectedAnswer}

Provide:
1. Score (0-10)
2. Feedback on what was good
3. Areas for improvement
4. Overall assessment

Return as JSON:
{
  "score": 8,
  "strengths": ["point1", "point2"],
  "improvements": ["point1", "point2"],
  "feedback": "Overall feedback paragraph"
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : text;
      
      return JSON.parse(jsonText);
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to evaluate answer');
    }
  }

  /**
   * Generate portfolio content
   */
  async generatePortfolioContent(userData) {
    const prompt = `
You are a professional portfolio designer. Create compelling portfolio content:

USER DATA:
- GitHub: ${JSON.stringify(userData.githubProjects, null, 2)}
- LinkedIn: ${JSON.stringify(userData.linkedinData, null, 2)}
- Skills: ${userData.skills.join(', ')}

Generate:
1. Professional headline (5-10 words)
2. Bio/About section (2-3 paragraphs)
3. Enhanced project descriptions
4. Skills categorization
5. Professional summary

Return as JSON:
{
  "headline": "...",
  "bio": "...",
  "projects": [{"title": "...", "description": "...", "highlights": ["..."]}],
  "skillCategories": [{"category": "...", "skills": ["..."]}]
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : text;
      
      return JSON.parse(jsonText);
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate portfolio content');
    }
  }

  /**
   * Extract job requirements from description
   */
  async extractJobRequirements(jobDescription) {
    const prompt = `
Analyze this job description and extract:
1. Required skills
2. Preferred skills
3. Key responsibilities
4. Experience level
5. Important keywords for ATS

JOB DESCRIPTION:
${jobDescription}

Return as JSON:
{
  "requiredSkills": ["skill1", "skill2"],
  "preferredSkills": ["skill1", "skill2"],
  "responsibilities": ["resp1", "resp2"],
  "experienceLevel": "entry|mid|senior",
  "keywords": ["keyword1", "keyword2"]
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : text;
      
      return JSON.parse(jsonText);
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to extract job requirements');
    }
  }

  /**
   * Extract skills from job description with categorization
   */
  async extractSkillsFromJobDescription(jobDescription) {
    const prompt = `
Analyze this job description and extract all technical and soft skills with detailed categorization.

JOB DESCRIPTION:
${jobDescription}

Categorize each skill as:
- programming_language (e.g., Python, JavaScript, Java)
- framework (e.g., React, Django, Spring)
- tool (e.g., Git, Docker, Jenkins)
- database (e.g., MongoDB, PostgreSQL, MySQL)
- cloud (e.g., AWS, Azure, GCP)
- soft_skill (e.g., Communication, Leadership)
- other

Mark importance as:
- required (must-have skills explicitly mentioned)
- preferred (nice-to-have or preferred qualifications)
- nice_to_have (mentioned but not emphasized)

Return as JSON:
{
  "skills": [
    {
      "name": "React",
      "category": "framework",
      "importance": "required"
    }
  ]
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : text;
      
      return JSON.parse(jsonText);
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to extract skills from job description');
    }
  }

  /**
   * Extract skills from resume text
   */
  async extractSkillsFromResume(resumeText) {
    const prompt = `
Analyze this resume and extract all technical skills, tools, and technologies mentioned.

RESUME:
${resumeText}

For each skill, try to determine the proficiency level based on context:
- beginner (mentioned in coursework or just learning)
- intermediate (used in projects or some experience)
- advanced (extensive use, years of experience, or expert level)

Return as JSON:
{
  "skills": [
    {
      "name": "Python",
      "proficiencyLevel": "advanced",
      "context": "3 years experience, built multiple production systems"
    }
  ]
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : text;
      
      return JSON.parse(jsonText);
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to extract skills from resume');
    }
  }

  /**
   * Analyze skill gaps and provide recommendations
   */
  async analyzeSkillGaps(requiredSkills, userSkills, jobTitle, jobDescription) {
    const prompt = `
You are a career advisor. Analyze the skill gap between what a job requires and what the candidate has.

JOB: ${jobTitle}
JOB DESCRIPTION:
${jobDescription}

REQUIRED SKILLS:
${JSON.stringify(requiredSkills, null, 2)}

CANDIDATE'S SKILLS:
${JSON.stringify(userSkills, null, 2)}

Provide:
1. Matching skills (skills the candidate already has)
2. Missing skills (gaps to fill) with priority (high/medium/low)
3. Overall match score (0-100)
4. Top 5 online courses (prefer free resources like freeCodeCamp, Coursera free courses, edX, etc.)
5. Top 5 YouTube playlists or channels for learning missing skills
6. A detailed study plan (4-6 weeks) broken into phases
7. 3-5 project recommendations to build that demonstrate the missing skills

Return as JSON:
{
  "matchingSkills": [
    {"name": "Python", "confidence": 95}
  ],
  "missingSkills": [
    {
      "name": "React Redux",
      "category": "framework",
      "importance": "required",
      "priority": "high"
    }
  ],
  "matchScore": 65,
  "courses": [
    {
      "title": "React - The Complete Guide",
      "platform": "Udemy",
      "url": "https://www.udemy.com/...",
      "duration": "40 hours",
      "skill": "React",
      "isPaid": true
    }
  ],
  "videos": [
    {
      "title": "React Redux Tutorial for Beginners",
      "channel": "Programming with Mosh",
      "url": "https://youtube.com/...",
      "skill": "React Redux",
      "duration": "2 hours"
    }
  ],
  "studyPlan": {
    "totalDuration": "6 weeks",
    "phases": [
      {
        "phase": 1,
        "title": "React Fundamentals",
        "duration": "2 weeks",
        "skills": ["React", "JSX", "Components"],
        "description": "Master React basics...",
        "milestones": ["Build a todo app", "Understand hooks"]
      }
    ]
  },
  "projects": [
    {
      "title": "E-commerce Dashboard with React & Redux",
      "description": "Build a full-featured admin dashboard...",
      "skillsCovered": ["React", "Redux", "REST API"],
      "difficulty": "intermediate",
      "estimatedTime": "2-3 weeks",
      "keyFeatures": ["Product management", "State management", "API integration"],
      "technologies": ["React", "Redux", "Axios", "Chart.js"]
    }
  ]
}

IMPORTANT: For the "difficulty" field in projects, you MUST use ONLY one of these exact values:
- "beginner" (for easy projects)
- "intermediate" (for medium difficulty)
- "advanced" (for hard/expert level)

Do NOT use "easy", "medium", "hard" or any other values.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : text;
      
      return JSON.parse(jsonText);
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to analyze skill gaps');
    }
  }

  /**
   * Generate personalized networking message
   */
  async generateNetworkingMessage(userProfile, contactProfile, purpose = 'referral') {
    const prompt = `
You are a professional networking coach. Generate a personalized LinkedIn/email connection message.

USER PROFILE:
- Name: ${userProfile.name}
- Current Role/Status: ${userProfile.currentStatus || 'Student'}
- Institution: ${userProfile.institution || 'N/A'}
- Skills: ${userProfile.skills?.join(', ') || 'N/A'}
- Target Role: ${userProfile.targetRole || 'N/A'}

CONTACT PROFILE:
- Name: ${contactProfile.name}
- Current Role: ${contactProfile.currentRole}
- Company: ${contactProfile.company}
- Common Background: ${JSON.stringify(userProfile.commonalities || {})}

PURPOSE: ${purpose}
(Options: referral, mentorship, advice, informational_interview, job_opportunity)

Generate 3 message templates:
1. Short message (2-3 sentences) - for LinkedIn connection request
2. Medium message (1 paragraph) - for LinkedIn message or email
3. Detailed message (2-3 paragraphs) - for formal email

Each message should:
- Be professional yet personable
- Mention common ground (same college, similar interests, etc.)
- Be specific about what you're asking for
- Show you've researched their background
- Include a clear call-to-action
- Be genuine and not overly flattering

Return as JSON:
{
  "shortMessage": "Hi [Name], I'm a [your status] at [institution]...",
  "mediumMessage": "Dear [Name], I hope this message finds you well...",
  "detailedMessage": "Dear [Name], I hope this email finds you well...",
  "subject": "Email subject line",
  "tips": ["tip1", "tip2", "tip3"],
  "doNots": ["don't1", "don't2"]
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : text;
      
      return JSON.parse(jsonText);
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate networking message');
    }
  }

  /**
   * Generate networking strategy advice
   */
  async generateNetworkingStrategy(userProfile, targetRole, targetCompany) {
    const prompt = `
You are a career strategist. Create a networking strategy for a student/job seeker.

USER PROFILE:
- Name: ${userProfile.name}
- Institution: ${userProfile.institution}
- Skills: ${userProfile.skills?.join(', ')}
- Experience: ${JSON.stringify(userProfile.experience || [])}

TARGET:
- Role: ${targetRole}
- Company: ${targetCompany}

Provide a comprehensive networking strategy with:
1. Step-by-step action plan
2. Who to reach out to (roles/positions)
3. Best platforms to use
4. Timeline (when to do what)
5. Key talking points
6. Follow-up strategy

Return as JSON:
{
  "actionPlan": [
    {
      "step": 1,
      "action": "...",
      "timeline": "Week 1",
      "details": "..."
    }
  ],
  "targetContacts": [
    {
      "role": "Software Engineer",
      "why": "They can provide insights about day-to-day work",
      "priority": "high"
    }
  ],
  "platforms": ["LinkedIn", "GitHub", "Twitter"],
  "talkingPoints": ["point1", "point2"],
  "followUpTips": ["tip1", "tip2"]
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : text;
      
      return JSON.parse(jsonText);
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate networking strategy');
    }
  }
}

module.exports = new GeminiService();
