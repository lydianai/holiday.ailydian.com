/**
 * ZAI (智谱AI) Provider Implementation
 * GLM-4.7 and GLM-4.5-Air models for cost-optimized AI operations
 *
 * Cost: ¥1-5 per 1M tokens (~$0.14-0.70 USD)
 * Context: 128K tokens
 * Speed: Ultra-fast responses
 */

import { BaseModelMessage, ModelResponse } from './types';

export interface ZAIConfig {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
}

export interface ZAIModelConfig {
  model: 'glm-4.7' | 'glm-4.5-air';
  temperature?: number;
  topP?: number;
  maxTokens?: number;
}

export class ZAIProvider {
  private config: ZAIConfig;

  constructor(config: ZAIConfig) {
    this.config = {
      ...config,
      baseURL: config.baseURL || 'https://open.bigmodel.cn/api/paas/v4/',
      timeout: config.timeout || 30000,
    };
  }

  /**
   * Generate completion using ZAI GLM models
   */
  async generateCompletion(
    messages: BaseModelMessage[],
    modelConfig: ZAIModelConfig
  ): Promise<ModelResponse> {
    const {
      model = 'glm-4.7',
      temperature = 0.7,
      topP = 0.9,
      maxTokens = 2048,
    } = modelConfig;

    try {
      const response = await fetch(`${this.config.baseURL}chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
          temperature,
          top_p: topP,
          max_tokens: maxTokens,
        }),
        signal: AbortSignal.timeout(this.config.timeout),
      });

      if (!response.ok) {
        throw new Error(`ZAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      return {
        content: data.choices[0]?.message?.content || '',
        model: data.model,
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0,
        },
        finishReason: data.choices[0]?.finish_reason,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`ZAI generation failed: ${error.message}`);
      }
      throw new Error('Unknown ZAI error');
    }
  }

  /**
   * Stream completion for real-time responses
   */
  async streamCompletion(
    messages: BaseModelMessage[],
    modelConfig: ZAIModelConfig,
    onChunk: (chunk: string) => void
  ): Promise<ModelResponse> {
    const {
      model = 'glm-4.7',
      temperature = 0.7,
      topP = 0.9,
      maxTokens = 2048,
    } = modelConfig;

    try {
      const response = await fetch(`${this.config.baseURL}chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
          temperature,
          top_p: topP,
          max_tokens: maxTokens,
          stream: true,
        }),
        signal: AbortSignal.timeout(this.config.timeout),
      });

      if (!response.ok) {
        throw new Error(`ZAI API error: ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let fullContent = '';
      let promptTokens = 0;
      let completionTokens = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content;
              if (content) {
                fullContent += content;
                onChunk(content);
                completionTokens++;
              }

              if (parsed.usage) {
                promptTokens = parsed.usage.prompt_tokens || 0;
                completionTokens = parsed.usage.completion_tokens || 0;
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      return {
        content: fullContent,
        model,
        usage: {
          promptTokens,
          completionTokens,
          totalTokens: promptTokens + completionTokens,
        },
        finishReason: 'stop',
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`ZAI streaming failed: ${error.message}`);
      }
      throw new Error('Unknown ZAI streaming error');
    }
  }

  /**
   * Health check for ZAI API
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.generateCompletion(
        [{ role: 'user', content: 'ping' }],
        { model: 'glm-4.5-air', maxTokens: 10 }
      );
      return response.content.length > 0;
    } catch {
      return false;
    }
  }

  /**
   * Get cost estimation for tokens
   * GLM-4.7: ¥5/1M tokens
   * GLM-4.5-Air: ¥1/1M tokens
   */
  estimateCost(tokens: number, model: 'glm-4.7' | 'glm-4.5-air' = 'glm-4.7'): number {
    const costPerMillion = model === 'glm-4.7' ? 5 : 1;
    return (tokens / 1_000_000) * costPerMillion;
  }
}

export default ZAIProvider;
