import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface AdGenerationRequest {
  product: string;
  audience: string;
  goal: string;
  platform?: string;
}

export interface GeneratedAd {
  headline: string;
  primaryText: string;
  callToAction: string;
  variations?: {
    headline: string[];
    primaryText: string[];
    callToAction: string[];
  };
}

export async function generateAdCopy(request: AdGenerationRequest): Promise<GeneratedAd> {
  try {
    const prompt = `Generate a high-converting advertisement copy for the following:

Product/Service: ${request.product}
Target Audience: ${request.audience}
Campaign Goal: ${request.goal}
Platform: ${request.platform || 'general social media'}

Please create compelling ad copy that:
1. Grabs attention with a strong headline
2. Clearly communicates value proposition
3. Speaks directly to the target audience
4. Includes a compelling call-to-action
5. Is optimized for ${request.goal.toLowerCase()}

Respond with JSON in this exact format:
{
  "headline": "main headline text",
  "primaryText": "main body text that explains the value and benefits",
  "callToAction": "action-oriented button text",
  "variations": {
    "headline": ["alternative headline 1", "alternative headline 2"],
    "primaryText": ["alternative body text 1", "alternative body text 2"],
    "callToAction": ["alternative CTA 1", "alternative CTA 2"]
  }
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert copywriter and marketing specialist. Generate high-converting ad copy that drives results. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      headline: result.headline || "Transform Your Business Today",
      primaryText: result.primaryText || "Discover the solution that leading businesses trust to achieve exceptional results.",
      callToAction: result.callToAction || "Get Started",
      variations: result.variations || {
        headline: [],
        primaryText: [],
        callToAction: []
      }
    };
  } catch (error) {
    throw new Error("Failed to generate ad copy: " + (error as Error).message);
  }
}

export async function generateCampaignName(product: string, goal: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a marketing expert. Generate a short, catchy campaign name that clearly identifies the product and goal. Respond with JSON containing a 'name' field."
        },
        {
          role: "user",
          content: `Generate a campaign name for: Product: ${product}, Goal: ${goal}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{"name": "Marketing Campaign"}');
    return result.name || "Marketing Campaign";
  } catch (error) {
    return `${product} - ${goal} Campaign`;
  }
}

export async function optimizeAdCopy(originalAd: GeneratedAd, performance: any): Promise<GeneratedAd> {
  try {
    const prompt = `Optimize this ad copy based on performance data:

Original Ad:
Headline: ${originalAd.headline}
Primary Text: ${originalAd.primaryText}
Call to Action: ${originalAd.callToAction}

Performance Data: ${JSON.stringify(performance)}

Generate an improved version that addresses any performance issues. Respond with JSON in the same format as the original.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in ad optimization. Analyze performance data and improve ad copy accordingly. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      headline: result.headline || originalAd.headline,
      primaryText: result.primaryText || originalAd.primaryText,
      callToAction: result.callToAction || originalAd.callToAction,
      variations: result.variations || originalAd.variations
    };
  } catch (error) {
    throw new Error("Failed to optimize ad copy: " + (error as Error).message);
  }
}
