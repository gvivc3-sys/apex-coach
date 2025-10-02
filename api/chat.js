import { supabase } from './supabase'; // Add this import at the top

export default async function handler(req, res) {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { messages, userId } = req.body;

        // Fetch user preferences to know their goals
        const { data: preferences } = await supabase
            .from('user_preferences')
            .select('goals, skill_level')
            .eq('id', userId)
            .single();

        // Fetch relevant tutorials based on user's goals
        let tutorials = [];
        if (preferences?.goals) {
            const { data } = await supabase
                .from('tutorials')
                .select('title, category, level, content, key_points')
                .in('category', preferences.goals)
                .order('level', { ascending: true });

            tutorials = data || [];
        }

        // Format tutorials for the system prompt
        const tutorialContext = tutorials.length > 0
            ? `\n\nAVAILABLE TUTORIALS:\n${tutorials.map(t =>
                `- "${t.title}" (${t.level}): ${t.key_points.join(', ')}`
            ).join('\n')}\n\nWhen users ask about these topics, reference the specific tutorial and offer to guide them through it.`
            : '';

        const systemPrompt = `You are APEX Coach, an elite internet money strategist.
Focus on: ${preferences?.goals?.join(', ') || 'making money online'}.
Be aggressive and direct. Push for immediate action.
Give specific platforms and dollar amounts.
Always end with a clear next step.

${tutorialContext}

FORMATTING INSTRUCTIONS:
- Use **bold** for emphasis on key points
- Use bullet points (- or *) for lists
- Use markdown links: [text](url) for any resources
- Use ## for section headers when appropriate
- Keep responses scannable and well-structured

When referencing tutorials, say "I recommend checking out our '[Tutorial Name]' tutorial in the Tutorials tab" and give them a quick 2-3 sentence summary of what they'll learn.`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages
                ],
                temperature: 0.8,
                max_tokens: 500,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('OpenAI error:', data);
            return res.status(500).json({ error: data.error?.message || 'OpenAI error' });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: error.message });
    }
}