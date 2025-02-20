import * as chrono from 'chrono-node';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const ActionSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['task', 'meeting', 'note']),
  title: z.string(),
  details: z.string().optional(),
  date: z.date().optional(),
  created_at: z.date(),
  status: z.enum(['pending', 'completed', 'cancelled']).default('pending'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  tags: z.array(z.string()).default([]),
});

export type Action = z.infer<typeof ActionSchema>;

interface NLPResponse {
  actions: Array<Omit<Action, 'id' | 'created_at' | 'status'>>;
}

const systemPrompt = `
You are an AI assistant that extracts structured information from text.
Your task is to identify tasks, meetings, and important notes from the provided text.
For each item, determine its priority (low, medium, high) based on context and urgency.
Add relevant tags based on the content.

Extract the following types of items:
1. Tasks: Action items, todos, or assignments
2. Meetings: Any scheduled events, calls, or gatherings
3. Notes: Important information that should be recorded

For dates:
- Parse any mentioned dates or times
- Use relative dates (e.g., "next Friday", "tomorrow at 2pm")
- If no specific time is mentioned for meetings, use 9:00 AM as default

For priority:
- High: Urgent items, tight deadlines, or critical information
- Medium: Standard tasks and regular meetings
- Low: FYI items, general notes, or long-term items

For tags:
- Extract relevant keywords from the content
- Include project names, people names, or categories
- Add context-specific tags (e.g., "client", "internal", "deadline")

Return the information in JSON format with the following structure:
{
  "actions": [
    {
      "type": "task" | "meeting" | "note",
      "title": "string",
      "details": "string" (optional),
      "date": "ISO date string" (optional),
      "priority": "low" | "medium" | "high",
      "tags": ["string"]
    }
  ]
}
`;

export async function extractActionsFromText(text: string): Promise<Action[]> {
  try {
    if (!process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY) {
      throw new Error('Deepseek API key is not configured');
    }

    // Call Deepseek API for NLP analysis
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
            content: systemPrompt
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.2,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid API response format');
    }

    let nlpResponse: NLPResponse;
    try {
      nlpResponse = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error('Error parsing API response:', parseError);
      throw new Error('Invalid API response format');
    }

    // Process and enhance the extracted actions
    return nlpResponse.actions.map(action => {
      let date = action.date ? new Date(action.date) : undefined;

      // Use chrono for additional date parsing if needed
      if (!date && action.title) {
        const parsedDate = chrono.parseDate(action.title);
        if (parsedDate) {
          date = parsedDate;
        }
      }

      return ActionSchema.parse({
        id: uuidv4(),
        ...action,
        date,
        created_at: new Date(),
      });
    });
  } catch (error) {
    console.error('Error in NLP processing:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to process text. Please try again.');
  }
}