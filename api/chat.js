import { createClient } from '@supabase/supabase-js';

// Create Supabase client directly here
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
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

        let preferences = null;
        let tutorials = [];

        // Try to fetch preferences
        try {
            const { data } = await supabase
                .from('user_preferences')
                .select('goals, skill_level')
                .eq('id', userId)
                .single();
            preferences = data;
        } catch (err) {
            console.log('Could not fetch preferences:', err);
        }

        // Try to fetch tutorials
        if (preferences?.goals) {
            try {
                const { data } = await supabase
                    .from('tutorials')
                    .select('title, category, level, key_points')
                    .in('category', preferences.goals)
                    .order('level', { ascending: true });
                tutorials = data || [];
            } catch (err) {
                console.log('Could not fetch tutorials:', err);
            }
        }

        const tutorialContext = tutorials.length > 0
            ? `\n\nAVAILABLE TUTORIALS:\n${tutorials.map(t =>
                `- "${t.title}" (${t.level}): ${t.key_points?.join(', ') || 'Key strategies included'}`
            ).join('\n')}\n\nWhen users ask about these topics, reference the specific tutorial.`
            : '';

        const systemPrompt = `You are APEX Coach, an elite internet money strategist.
Focus on: ${preferences?.goals?.join(', ') || 'making money online'}.
Be aggressive and direct. Push for immediate action.

FORMATTING:
- Use **bold** for emphasis
- Use bullet points for lists
- Use ## for headers

${tutorialContext}`;

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