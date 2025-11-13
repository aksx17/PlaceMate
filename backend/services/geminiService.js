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
}

module.exports = new GeminiService();
