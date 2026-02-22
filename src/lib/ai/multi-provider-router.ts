/**
 * Multi-Provider AI Router
 * Intelligent routing between multiple language model providers.
 * Optimizes for cost, speed, and quality.
 * Provider identities are resolved from environment variables at runtime.
 */

import { ZAIProvider } from './providers/zai-provider';
import { BaseModelMessage, ModelResponse } from './providers/types';

export type ProviderType = 'primary' | 'zai' | 'secondary' | 'tertiary';

export interface RouterConfig {
  primaryApiKey: string;
  zaiApiKey?: string;
  secondaryApiKey?: string;
  tertiaryApiKey?: string;
  defaultProvider?: ProviderType;
  enableCostOptimization?: boolean;
}

export interface RoutingStrategy {
  provider: ProviderType;
  model: string;
  reason: string;
  estimatedCost: number;
  estimatedSpeed: 'fast' | 'medium' | 'slow';
}

interface ProviderHealth {
  provider: ProviderType;
  healthy: boolean;
  lastCheck: Date;
  responseTime: number;
}

/**
 * Multi-Provider Router with intelligent routing
 */
export class MultiProviderRouter {
  private config: RouterConfig;
  private providers: Map<ProviderType, any>;
  private healthStatus: Map<ProviderType, ProviderHealth>;
  private requestCounts: Map<ProviderType, number>;

  constructor(config: RouterConfig) {
    this.config = {
      ...config,
      defaultProvider: config.defaultProvider || 'primary',
      enableCostOptimization: config.enableCostOptimization ?? true,
    };

    this.providers = new Map();
    this.healthStatus = new Map();
    this.requestCounts = new Map();

    // Initialize providers
    this.initializeProviders();
  }

  private initializeProviders() {
    // ZAI Provider (Cost-optimized)
    if (this.config.zaiApiKey) {
      this.providers.set('zai', new ZAIProvider({
        apiKey: this.config.zaiApiKey,
      }));
    }

    // Note: Additional providers are configured via environment variables
  }

  /**
   * Determine optimal provider based on task complexity and requirements
   */
  private determineRoutingStrategy(
    messages: BaseModelMessage[],
    options?: {
      requireHighQuality?: boolean;
      requireFastResponse?: boolean;
      maxCost?: number;
      preferredProvider?: ProviderType;
    }
  ): RoutingStrategy {
    const {
      requireHighQuality = false,
      requireFastResponse = false,
      maxCost,
      preferredProvider,
    } = options || {};

    // Count input tokens (rough estimation: ~0.25 words per token)
    const inputText = messages.map(m => m.content).join(' ');
    const estimatedTokens = Math.ceil(inputText.length / 4);

    // User-specified provider
    if (preferredProvider && this.providers.has(preferredProvider)) {
      return this.getStrategyForProvider(preferredProvider, estimatedTokens);
    }

    // Cost optimization mode
    if (this.config.enableCostOptimization && !requireHighQuality) {
      // Use ZAI for cost-effective operations
      if (this.providers.has('zai')) {
        return {
          provider: 'zai',
          model: process.env.ZAI_MODEL_FAST || 'glm-4.5-air',
          reason: 'Cost optimization - fast and affordable',
          estimatedCost: this.estimateZAICost(estimatedTokens, 'fast'),
          estimatedSpeed: 'fast',
        };
      }
    }

    // High-quality requirement
    if (requireHighQuality) {
      if (this.providers.has('primary')) {
        return {
          provider: 'primary',
          model: process.env.LLM_MODEL_PRIMARY || '',
          reason: 'High quality reasoning required',
          estimatedCost: this.estimatePrimaryCost(estimatedTokens),
          estimatedSpeed: 'medium',
        };
      }
    }

    // Fast response requirement
    if (requireFastResponse) {
      if (this.providers.has('zai')) {
        return {
          provider: 'zai',
          model: process.env.ZAI_MODEL_FAST || 'glm-4.5-air',
          reason: 'Ultra-fast response needed',
          estimatedCost: this.estimateZAICost(estimatedTokens, 'fast'),
          estimatedSpeed: 'fast',
        };
      }
    }

    // Default fallback
    const defaultProvider = this.config.defaultProvider!;
    if (this.providers.has(defaultProvider)) {
      return this.getStrategyForProvider(defaultProvider, estimatedTokens);
    }

    // Last resort: first available provider
    const firstAvailable = Array.from(this.providers.keys())[0];
    return this.getStrategyForProvider(firstAvailable, estimatedTokens);
  }

  private getStrategyForProvider(
    provider: ProviderType,
    tokens: number
  ): RoutingStrategy {
    switch (provider) {
      case 'zai':
        return {
          provider: 'zai',
          model: process.env.ZAI_MODEL_BALANCED || 'glm-4.7',
          reason: 'ZAI - balanced performance',
          estimatedCost: this.estimateZAICost(tokens, 'balanced'),
          estimatedSpeed: 'fast',
        };
      case 'primary':
        return {
          provider: 'primary',
          model: process.env.LLM_MODEL_PRIMARY || '',
          reason: 'Primary provider - high quality',
          estimatedCost: this.estimatePrimaryCost(tokens),
          estimatedSpeed: 'medium',
        };
      default:
        return {
          provider: 'zai',
          model: process.env.ZAI_MODEL_BALANCED || 'glm-4.7',
          reason: 'Default provider',
          estimatedCost: this.estimateZAICost(tokens, 'balanced'),
          estimatedSpeed: 'fast',
        };
    }
  }

  /**
   * Generate completion with automatic routing
   */
  async generateCompletion(
    messages: BaseModelMessage[],
    options?: {
      requireHighQuality?: boolean;
      requireFastResponse?: boolean;
      maxCost?: number;
      preferredProvider?: ProviderType;
    }
  ): Promise<ModelResponse & { routingStrategy: RoutingStrategy }> {
    const strategy = this.determineRoutingStrategy(messages, options);

    // Route to selected provider
    const provider = this.providers.get(strategy.provider);
    if (!provider) {
      throw new Error(`Provider ${strategy.provider} not available`);
    }

    // Increment request count
    const currentCount = this.requestCounts.get(strategy.provider) || 0;
    this.requestCounts.set(strategy.provider, currentCount + 1);

    try {
      const startTime = Date.now();

      // Generate response (provider-specific implementation)
      let response: ModelResponse;

      if (strategy.provider === 'zai') {
        response = await provider.generateCompletion(messages, { model: strategy.model });
      } else {
        throw new Error(`Provider ${strategy.provider} not implemented yet`);
      }

      const responseTime = Date.now() - startTime;

      // Update health status
      this.healthStatus.set(strategy.provider, {
        provider: strategy.provider,
        healthy: true,
        lastCheck: new Date(),
        responseTime,
      });

      return {
        ...response,
        routingStrategy: strategy,
      };
    } catch (error) {
      // Update health status
      this.healthStatus.set(strategy.provider, {
        provider: strategy.provider,
        healthy: false,
        lastCheck: new Date(),
        responseTime: -1,
      });

      // Fallback to next available provider
      console.error(`Provider ${strategy.provider} failed, trying fallback...`);

      for (const [fallbackProvider, fallbackInstance] of this.providers) {
        if (fallbackProvider !== strategy.provider) {
          try {
            const fallbackModel = process.env.ZAI_MODEL_BALANCED || 'glm-4.7';
            const fallbackResponse = await fallbackInstance.generateCompletion(
              messages,
              { model: fallbackModel }
            );
            return {
              ...fallbackResponse,
              routingStrategy: {
                ...strategy,
                provider: fallbackProvider,
                reason: `Fallback after ${strategy.provider} failure`,
              },
            };
          } catch (fallbackError) {
            console.error(`Fallback provider ${fallbackProvider} also failed`);
            continue;
          }
        }
      }

      throw new Error(`All providers failed. Last error: ${error}`);
    }
  }

  /**
   * Get routing statistics
   */
  getStatistics() {
    return {
      requestCounts: Object.fromEntries(this.requestCounts),
      healthStatus: Object.fromEntries(this.healthStatus),
      totalRequests: Array.from(this.requestCounts.values()).reduce((a, b) => a + b, 0),
      availableProviders: Array.from(this.providers.keys()),
    };
  }

  // Cost estimation helpers (¥ to USD conversion: ~0.14)
  private estimateZAICost(tokens: number, tier: 'fast' | 'balanced'): number {
    const costPerMillion = tier === 'balanced' ? 5 : 1; // ¥
    const costInYuan = (tokens / 1_000_000) * costPerMillion * 2; // input + output
    return costInYuan * 0.14; // Convert to USD
  }

  private estimatePrimaryCost(tokens: number): number {
    // Estimated cost based on typical provider pricing
    const inputCost = (tokens / 1_000_000) * 3;
    const outputCost = (tokens / 1_000_000) * 15;
    return inputCost + outputCost;
  }
}

export default MultiProviderRouter;
