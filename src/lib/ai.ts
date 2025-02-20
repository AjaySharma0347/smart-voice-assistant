import { z } from 'zod';

const AIResponseSchema = z.object({
  type: z.enum(['conversation', 'task']),
  content: z.string(),
  action: z.object({
    type: z.enum(['task', 'meeting', 'note', 'response']).optional(),
    data: z.record(z.any()).optional(),
  }).optional(),
});

type AIResponse = z.infer<typeof AIResponseSchema>;

const systemPrompt = `
You are an AI assistant that helps users with their voice commands and queries.
Analyze the user's input and determine if it's:
1. A task/action to perform (e.g., "create a meeting", "add a note")
2. A question/conversation (e.g., "what's the weather", "tell me a joke")

For tasks, extract the relevant information and format it appropriately.
For questions, provide a helpful and concise response.

Return the response in JSON format with the following structure:
{
  "type": "conversation" | "task",
  "content": "string", // Response message or task description
  "action": { // Only for tasks
    "type": "task" | "meeting" | "note" | "response",
    "data": { // Relevant data for the action
      // Task-specific fields
    }
  }
}
`;

export async function processAIResponse(text: string): Promise<AIResponse> {
  if (!process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY) {
    throw new Error('Deepseek API key is not configured');
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.2,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = JSON.parse(data.choices[0].message.content);
    return AIResponseSchema.parse(aiResponse);
  } catch (error) {
    console.error('Error processing AI response:', error);
    throw new Error('Failed to process voice input');
  }
}