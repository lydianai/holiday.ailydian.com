import OpenAI from 'openai';
import logger from './logger';

// AI service configuration - model identifiers resolved from environment variables
const AI_CONFIG = {
  llm: {
    model: process.env.LLM_MODEL_PRIMARY || process.env.LLM_API_MODEL || '',
    maxTokens: 1000,
    temperature: 0.7,
  },
  rateLimit: {
    requestsPerMinute: 60,
    requestsPerHour: 1000,
  }
};

// Initialize language model provider client
const llmClient = new OpenAI({
  apiKey: process.env.LLM_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.LLM_BASE_URL,
});

// AI service interfaces
interface AIRecommendationRequest {
  userId?: string;
  preferences?: {
    budget?: number;
    travelStyle?: 'luxury' | 'budget' | 'mid-range';
    interests?: string[];
    duration?: number;
    destination?: string;
    language?: string;
  };
}

interface AIRecommendationResponse {
  destinations: {
    name: string;
    country: string;
    confidence: number;
    reasons: string[];
    estimatedCost: number;
    bestTimeToVisit: string;
    activities: string[];
    aiInsights: string;
  }[];
  personalizedMessage: string;
  totalConfidence: number;
}

class AIServiceManager {
  // AI-powered travel recommendations
  static async generateRecommendations(
    request: AIRecommendationRequest
  ): Promise<AIRecommendationResponse> {
    try {
      const prompt = this.buildRecommendationPrompt(request);

      const completion = await llmClient.chat.completions.create({
        model: AI_CONFIG.llm.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert travel assistant for Holiday.AILYDIAN. You specialize in blockchain-based payments, VR tours, and sustainable tourism.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: AI_CONFIG.llm.maxTokens,
        temperature: AI_CONFIG.llm.temperature,
        response_format: { type: 'json_object' }
      });

      const response = JSON.parse(completion.choices[0].message.content || '{}');
      return response;
    } catch (error) {
      logger.error('AI recommendation generation failed:', error as Error, { component: 'AiServiceManager' });
      throw new Error('AI recommendation generation failed');
    }
  }

  // Private helper methods
  private static buildRecommendationPrompt(request: AIRecommendationRequest): string {
    const { preferences = {} } = request;

    return `Generate personalized travel recommendations based on:

Preferences:
- Budget: ${preferences.budget || 'Not specified'}
- Travel Style: ${preferences.travelStyle || 'Not specified'}
- Interests: ${preferences.interests?.join(', ') || 'Not specified'}
- Duration: ${preferences.duration || 'Not specified'} days
- Language: ${preferences.language || 'English'}

Provide 5 destination recommendations with detailed reasons, cost estimates, and insights.`;
  }

  // Health check for AI services
  static async healthCheck(): Promise<{
    llm: boolean;
    overallHealth: 'healthy' | 'degraded' | 'unhealthy';
  }> {
    const health: {
      llm: boolean;
      overallHealth: 'healthy' | 'degraded' | 'unhealthy';
    } = {
      llm: false,
      overallHealth: 'unhealthy'
    };

    try {
      // Test language model provider connection
      await llmClient.chat.completions.create({
        model: process.env.LLM_MODEL_FAST || AI_CONFIG.llm.model,
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 5
      });
      health.llm = true;
      health.overallHealth = 'healthy';
    } catch (error) {
      logger.error('Language model provider health check failed:', error as Error, { component: 'AiServiceManager' });
    }

    return health;
  }
}

export default AIServiceManager;
export type { AIRecommendationRequest, AIRecommendationResponse };
